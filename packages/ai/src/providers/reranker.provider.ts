import { Evidence, QueryIntent, StandardStatus } from '@bis/shared-types';

export interface ScoredEvidence extends Evidence {
  rerankScore?: number;
}

export interface IRerankerProvider {
  rerank(query: string, candidates: Evidence[], intent?: QueryIntent): Promise<ScoredEvidence[]>;
}

export class HybridReranker implements IRerankerProvider {
  /**
   * Deterministic cross-encoder inspired hybrid scoring logic:
   * 1. Dense cosine similarity baseline (from Vector DB)
   * 2. Exact standard designation match boosting (e.g. "IS 10500" in text)
   * 3. Term frequency / lexical overlap with tender & procurement keywords
   * 4. Domain intent matching boost (Tender Analysis, GFR Audit, Superseded, PDI Testing)
   * 5. Document freshness and active standard status verification
   */
  async rerank(
    query: string,
    candidates: Evidence[],
    intent?: QueryIntent
  ): Promise<ScoredEvidence[]> {
    if (!candidates || candidates.length === 0) return [];

    const qLower = query.toLowerCase();
    const queryTokens = qLower.split(/[^a-zA-Z0-9:]+/).filter(t => t.length > 2);

    // Extract exact standard numbers (e.g. 10500, 17526, 4984, 1786)
    const stdMatches = query.match(/(?:IS\s*[-:]?\s*|standard\s+)?(\d{2,6}(?:\s*\([^)]+\))?(?::\d{4})?)/gi) || [];
    const extractedNums = stdMatches.map(m => m.replace(/^(?:IS\s*[-:]?\s*|standard\s+)/i, '').trim()).filter(Boolean);

    const scored = candidates.map(candidate => {
      let score = (candidate.similarityScore || 0.5) * 50; // Base: 0 - 50

      const candStdUpper = candidate.standardNumber.toUpperCase();
      const excerptLower = candidate.excerpt.toLowerCase();

      // 1. Exact Standard Number Match Boost
      const hasExactStd = extractedNums.some(num => candStdUpper.includes(num.toUpperCase()));
      if (hasExactStd) {
        score += 30;
      }

      // 2. Clause Specific Match
      if (candidate.clause && qLower.includes(candidate.clause.toLowerCase())) {
        score += 20;
      }

      // 3. Lexical Token Overlap
      const titleLower = candidate.documentTitle.toLowerCase();
      let matchCount = 0;
      for (const token of queryTokens) {
        if (excerptLower.includes(token) || titleLower.includes(token)) {
          matchCount++;
        }
      }
      score += Math.min(matchCount * 5, 25);

      // 4. Intent Specific Boost (SIH 26108 Procurement)
      if (intent === QueryIntent.TENDER_ANALYSIS || intent === QueryIntent.PROCUREMENT_STANDARD_RECOMMENDATION) {
        if (excerptLower.includes('specification') || excerptLower.includes('requirement') || excerptLower.includes('scope')) {
          score += 15;
        }
      }
      if (intent === QueryIntent.GFR_COMPLIANCE_AUDIT && (excerptLower.includes('rule 144') || excerptLower.includes('generic') || excerptLower.includes('make'))) {
        score += 25;
      }
      if (intent === QueryIntent.SUPERSEDED_STANDARD_CHECK && (excerptLower.includes('supersed') || excerptLower.includes('withdrawn') || excerptLower.includes('revision'))) {
        score += 25;
      }
      if (intent === QueryIntent.PDI_INSPECTION_SCHEDULE || intent === QueryIntent.TESTING_REQUIREMENTS) {
        if (excerptLower.includes('sampling') || excerptLower.includes('acceptance') || excerptLower.includes('routine') || excerptLower.includes('test')) {
          score += 20;
        }
      }
      if (intent === QueryIntent.QCO_LEGAL_MANDATE && (excerptLower.includes('quality control') || excerptLower.includes('gazette') || excerptLower.includes('order'))) {
        score += 20;
      }

      // 5. Freshness / Status Adjustments
      if (candidate.status === StandardStatus.OUTDATED || candidate.status === StandardStatus.WITHDRAWN) {
        score -= 20;
      } else if (candidate.status === StandardStatus.ACTIVE) {
        score += 5;
      }

      return {
        ...candidate,
        rerankScore: Math.round(score * 10) / 10
      };
    });

    // Sort descending by rerankScore
    scored.sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0));
    return scored;
  }
}

export const defaultReranker = new HybridReranker();
export { HybridReranker as HybridBISCrossReranker };
