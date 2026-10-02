import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  Evidence,
  IndianLanguage,
  QueryIntent,
  RAGSearchRequest,
  RAGSearchResponse,
  StandardStatus
} from '@bis/shared-types';
import {
  HybridBISCrossReranker,
  IndicLanguageEngine,
  getEmbeddingProvider
} from '@bis/ai';
import { SEED_STANDARDS } from '@bis/seed-data';

@Injectable()
export class RAGService {
  private languageEngine = new IndicLanguageEngine();
  private embedder = getEmbeddingProvider();
  private reranker = new HybridBISCrossReranker();

  constructor(private prisma: PrismaService) {}

  async searchEvidence(request: RAGSearchRequest): Promise<RAGSearchResponse> {
    const startTime = Date.now();
    const rawQuery = request.query || '';

    // 1. Detect language
    const detectedLang = request.language || (await this.languageEngine.detectLanguage(rawQuery));

    // 2. Translate & normalize query preserving IS numbers, clauses, and technical tokens
    const { translatedText, preservedEntities } = await this.languageEngine.translateToEnglish(rawQuery, detectedLang);

    // 3. Classify intent
    const intent = this.classifyIntent(translatedText);

    // Candidate accumulator map keyed by evidence id
    const candidateMap = new Map<string, Evidence>();

    // Step 4.1: Vector search via pgvector (cosine distance)
    try {
      const queryVector = await this.embedder.embedText(translatedText);
      const vectorString = `[${queryVector.join(',')}]`;

      const rawVectorRows: any[] = await this.prisma.$queryRaw`
        SELECT
          dc.id,
          dc."documentId",
          dc."standardNumber",
          dc.section,
          dc.clause,
          dc.page,
          dc.content,
          dc.status,
          d.title as "documentTitle",
          d."publicationDate",
          d."sourceUrl",
          1 - (dc."vectorEmbedding" <=> ${vectorString}::vector) as similarity
        FROM document_chunks dc
        JOIN documents d ON d.id = dc."documentId"
        WHERE dc."vectorEmbedding" IS NOT NULL
        ORDER BY dc."vectorEmbedding" <=> ${vectorString}::vector ASC
        LIMIT 20;
      `;

      for (const r of rawVectorRows) {
        const sim = Number(r.similarity || 0.75);
        candidateMap.set(r.id, {
          id: r.id,
          documentTitle: r.documentTitle || r.standardNumber,
          standardNumber: r.standardNumber,
          section: r.section || undefined,
          clause: r.clause,
          page: Number(r.page || 1),
          publicationDate: r.publicationDate || '2024-01-01',
          status: (r.status as StandardStatus) || StandardStatus.ACTIVE,
          sourceUrl: r.sourceUrl || 'https://www.services.bis.gov.in',
          excerpt: r.content,
          similarityScore: sim,
          isOutdated: r.status === StandardStatus.OUTDATED
        });
      }
    } catch (err) {
      // If vector column isn't populated or native query fails, proceed to FTS / Exact match
    }

    // Step 4.2: Full-text search (BM25-style keyword matching in PostgreSQL)
    try {
      const cleanTerms = translatedText.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
      if (cleanTerms) {
        const rawFtsRows: any[] = await this.prisma.$queryRaw`
          SELECT
            dc.id,
            dc."documentId",
            dc."standardNumber",
            dc.section,
            dc.clause,
            dc.page,
            dc.content,
            dc.status,
            d.title as "documentTitle",
            d."publicationDate",
            d."sourceUrl",
            ts_rank(to_tsvector('english', dc.content), plainto_tsquery('english', ${cleanTerms})) as rank
          FROM document_chunks dc
          JOIN documents d ON d.id = dc."documentId"
          WHERE to_tsvector('english', dc.content) @@ plainto_tsquery('english', ${cleanTerms})
          ORDER BY rank DESC
          LIMIT 20;
        `;

        for (const r of rawFtsRows) {
          const rankScore = Math.min(0.5 + Number(r.rank || 0) * 0.5, 0.95);
          if (!candidateMap.has(r.id) || (candidateMap.get(r.id)?.similarityScore || 0) < rankScore) {
            candidateMap.set(r.id, {
              id: r.id,
              documentTitle: r.documentTitle || r.standardNumber,
              standardNumber: r.standardNumber,
              section: r.section || undefined,
              clause: r.clause,
              page: Number(r.page || 1),
              publicationDate: r.publicationDate || '2024-01-01',
              status: (r.status as StandardStatus) || StandardStatus.ACTIVE,
              sourceUrl: r.sourceUrl || 'https://www.services.bis.gov.in',
              excerpt: r.content,
              similarityScore: rankScore,
              isOutdated: r.status === StandardStatus.OUTDATED
            });
          }
        }
      }
    } catch (err) {
      // ignore
    }

    // Step 4.3: Exact standard / clause match against DB rows
    if (preservedEntities.length > 0) {
      try {
        for (const entity of preservedEntities) {
          const dbChunks = await this.prisma.documentChunk.findMany({
            where: {
              OR: [
                { standardNumber: { contains: entity, mode: 'insensitive' } },
                { clause: { contains: entity, mode: 'insensitive' } },
                { content: { contains: entity, mode: 'insensitive' } }
              ]
            },
            take: 10,
            include: { document: true }
          });

          for (const ch of dbChunks) {
            if (!candidateMap.has(ch.id)) {
              candidateMap.set(ch.id, {
                id: ch.id,
                documentTitle: ch.document.title,
                standardNumber: ch.standardNumber,
                section: ch.section || undefined,
                clause: ch.clause,
                page: ch.page,
                publicationDate: ch.document.publicationDate,
                status: ch.status as StandardStatus,
                sourceUrl: ch.document.sourceUrl,
                excerpt: ch.content,
                similarityScore: 0.95,
                isOutdated: ch.status === StandardStatus.OUTDATED
              });
            }
          }
        }
      } catch (err) {
        // ignore
      }
    }

    const candidates = Array.from(candidateMap.values());

    // Step 4.4: Fallback to SEED_STANDARDS only if DocumentChunk table is empty
    if (candidates.length === 0) {
      const dbCount = await this.prisma.documentChunk.count().catch(() => 0);
      if (dbCount === 0) {
        console.warn(
          '[RAGService] WARNING: DocumentChunk database table is empty. Falling back to in-memory SEED_STANDARDS dataset for dev environment.'
        );

        const STOP_WORDS = new Set([
          'what', 'does', 'the', 'is', 'a', 'an', 'standard', 'for', 'used',
          'how', 'which', 'with', 'and', 'or', 'of', 'to', 'in', 'on', 'by',
          'this', 'that', 'are', 'was', 'were', 'tell', 'give', 'about', 'explain'
        ]);

        const qTokens = translatedText.toLowerCase().split(/[^a-zA-Z0-9:]+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));

        for (const std of (SEED_STANDARDS as any[])) {
          const fullContent = `${std.standardNumber} ${std.title} ${std.scope} ${std.abstract} ${std.keywords.join(' ')}`.toLowerCase();
          let matchCount = 0;
          for (const token of qTokens) {
            if (fullContent.includes(token)) matchCount++;
          }

          const isExactStd = preservedEntities.some(e => std.standardNumber.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(std.standardNumber.toLowerCase()));

          if (matchCount > 0 || isExactStd || qTokens.length === 0) {
            const baseSim = isExactStd ? 0.98 : Math.min(0.5 + matchCount * 0.12, 0.92);
            candidates.push({
              id: `ev-${std.standardNumber}-main`,
              documentTitle: std.title,
              standardNumber: std.standardNumber,
              section: 'General Requirements & Scope',
              clause: '4.1',
              page: 3,
              publicationDate: std.publicationDate,
              status: std.status,
              sourceUrl: std.sourceUrl,
              excerpt: `${std.scope} ${std.abstract}`,
              similarityScore: baseSim,
              isOutdated: std.status === StandardStatus.OUTDATED
            });
          }
        }
      }
    }

    // 5. Rerank candidates with hybrid priority rules
    const reranked = await this.reranker.rerank(translatedText, candidates, intent);
    const topK = request.topK || 5;
    const finalResults = reranked.slice(0, topK);

    return {
      query: rawQuery,
      rewrittenQuery: translatedText !== rawQuery ? translatedText : undefined,
      detectedLanguage: detectedLang,
      intent,
      results: finalResults,
      totalRetrieved: finalResults.length,
      processingTimeMs: Date.now() - startTime
    };
  }

  private classifyIntent(query: string): QueryIntent {
    const q = query.toLowerCase();
    if (q.includes('tender') || q.includes('boq') || q.includes('specification') || q.includes('procure')) return QueryIntent.TENDER_ANALYSIS;
    if (q.includes('gfr') || q.includes('144') || q.includes('bias') || q.includes('restrictive') || q.includes('brand')) return QueryIntent.GFR_COMPLIANCE_AUDIT;
    if (q.includes('superseded') || q.includes('withdrawn') || q.includes('obsolete') || q.includes('replacement')) return QueryIntent.SUPERSEDED_STANDARD_CHECK;
    if (q.includes('pdi') || q.includes('pre-dispatch') || q.includes('acceptance test') || q.includes('sampling plan')) return QueryIntent.PDI_INSPECTION_SCHEDULE;
    if (q.includes('qco') || q.includes('gazette') || q.includes('mandatory order') || q.includes('statutory')) return QueryIntent.QCO_LEGAL_MANDATE;
    if (q.includes('clause') || q.includes('explain clause')) return QueryIntent.CLAUSE_EXPLANATION;
    if (q.includes('test') || q.includes('sampling') || q.includes('method')) return QueryIntent.TESTING_REQUIREMENTS;
    if (q.includes('lab') || q.includes('nabl') || q.includes('where to test')) return QueryIntent.LABORATORY_LOOKUP;
    if (q.includes('certif') || q.includes('scheme') || q.includes('crs')) return QueryIntent.CERTIFICATION_GUIDANCE;
    if (q.includes('roadmap') || q.includes('process')) return QueryIntent.COMPLIANCE_ROADMAP;
    if (q.includes('compare')) return QueryIntent.COMPARE_STANDARDS;
    return QueryIntent.FIND_STANDARD;
  }
}
