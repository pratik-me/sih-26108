import { Injectable } from '@nestjs/common';
import {
  AgentExecutionResponse,
  Evidence,
  IndianLanguage,
  ToolName
} from '@bis/shared-types';
import {
  BISSaarthiAgent,
  BISAgentToolsHandler,
  getLLMProvider
} from '@bis/ai';
import { StandardsService } from '../standards/standards.service';
import { TestingService } from '../testing/testing.service';
import { LaboratoriesService } from '../laboratories/laboratories.service';
import { ProcurementService } from '../procurement/procurement.service';
import { CertificationService } from '../certification/certification.service';
import { RAGService } from '../rag/rag.service';

@Injectable()
export class AiAgentService implements BISAgentToolsHandler {
  private agent: BISSaarthiAgent;
  private llmProvider = getLLMProvider();

  constructor(
    private standardsService: StandardsService,
    private testingService: TestingService,
    private laboratoriesService: LaboratoriesService,
    private procurementService: ProcurementService,
    private certificationService: CertificationService,
    private ragService: RAGService
  ) {
    this.agent = new BISSaarthiAgent(this.llmProvider, this);
  }

  async executeTool(tool: ToolName, args: Record<string, unknown>): Promise<{ data: unknown; evidence: Evidence[] }> {
    const query = String(args.query || '');

    switch (tool) {
      case 'recommend_procurement_standards':
      case 'recommend_standards': {
        const rec = await this.procurementService.recommendProcurementStandards({
          productName: query,
          rawText: query
        });
        const evidence: Evidence[] = rec.recommendations.flatMap(r => r.evidence);
        return { data: rec, evidence };
      }
      case 'audit_gfr_144i_compliance': {
        const audit = await this.procurementService.auditGFR144iCompliance({
          specificationText: query
        });
        const evidence: Evidence[] = [
          {
            id: 'ev-gfr-144i',
            documentTitle: 'General Financial Rules (GFR) 2017 - Rule 144(i)',
            standardNumber: 'GFR 2017 Rule 144(i)',
            clause: 'Rule 144(i)',
            page: 1,
            publicationDate: '2017-02-11',
            status: 'ACTIVE' as any,
            sourceUrl: 'https://doe.gov.in/sites/default/files/GFR2017_0.pdf',
            excerpt: 'Rule 144(i): The technical specifications should be generic, functional and measurable. The specifications shall not indicate a requirement for or reference to a particular trademark or trade name, patent, design or type, specific origin or producer.',
            similarityScore: 0.99
          }
        ];
        return { data: audit, evidence };
      }
      case 'check_superseded_standard': {
        let sup: any = null;
        try {
          sup = await this.procurementService.getSupersededStandardDetails(query);
        } catch {
          sup = null;
        }
        const evidence: Evidence[] = sup
          ? [
              {
                id: `ev-sup-${sup.obsoleteStandard.replace(/[^a-zA-Z0-9]/g, '')}`,
                documentTitle: `BIS Gazette Notification - Superseded Standard ${sup.obsoleteStandard}`,
                standardNumber: sup.activeStandard,
                clause: 'Revision Schedule',
                page: 1,
                publicationDate: `${sup.yearActive}-01-01`,
                status: 'ACTIVE' as any,
                sourceUrl: 'https://www.services.bis.gov.in',
                excerpt: `${sup.obsoleteStandard} has been superseded by ${sup.activeStandard}. Key revisions: ${sup.keyChanges.join('; ')}. ${sup.transitionGuidance}`,
                similarityScore: 0.98
              }
            ]
          : [];
        return { data: sup, evidence };
      }
      case 'get_pdi_inspection_schedule': {
        const pdi = await this.testingService.getPDISchedule(query);
        const evidence: Evidence[] = [
          {
            id: `ev-pdi-${pdi.standardNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
            documentTitle: `Pre-Dispatch Inspection (PDI) Schedule - ${pdi.standardNumber}`,
            standardNumber: pdi.standardNumber,
            clause: 'PDI Schedule / IS 2500',
            page: 1,
            publicationDate: '2024-01-01',
            status: 'ACTIVE' as any,
            sourceUrl: 'https://www.services.bis.gov.in',
            excerpt: `Sampling plan based on ${pdi.samplingStandard}. Lot criteria: ${pdi.lotInspectionCriteria}. Routine & acceptance test parameters: ${pdi.testItems.map(t => t.parameter).join(', ')}.`,
            similarityScore: 0.95
          }
        ];
        return { data: pdi, evidence };
      }
      case 'get_testing_requirements': {
        const reqs = await this.testingService.getTestingRequirements({ standardNumber: query, productName: query, testName: query });
        const evidence: Evidence[] = reqs.slice(0, 4).map((r, i) => ({
          id: `ev-test-${i}-${r.standardNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
          documentTitle: `Testing Specification - ${r.standardNumber}`,
          standardNumber: r.standardNumber,
          clause: r.clauseNumber,
          page: 5,
          publicationDate: '2021-01-01',
          status: 'ACTIVE' as any,
          sourceUrl: r.sourceUrl || 'https://www.services.bis.gov.in',
          excerpt: `${r.testName}: ${r.description} Acceptance Criteria: ${r.acceptanceCriteria} Sampling: ${r.samplingRequirements} Frequency: ${r.testingFrequency}`,
          similarityScore: 0.92
        }));
        return { data: reqs, evidence };
      }
      case 'search_standards': {
        const res = await this.standardsService.searchStandards(query);
        const evidence: Evidence[] = res.standards.slice(0, 3).map(s => ({
          id: `ev-${s.standardNumber}`,
          documentTitle: s.title,
          standardNumber: s.standardNumber,
          clause: 'Scope',
          page: 1,
          publicationDate: s.publicationDate,
          status: s.status,
          sourceUrl: s.sourceUrl,
          excerpt: `${s.scope} ${s.abstract || ''}`,
          similarityScore: 0.9
        }));
        return { data: res, evidence };
      }
      case 'search_laboratories': {
        const labs = await this.laboratoriesService.searchLaboratories({ standardNumber: query, testName: query });
        const evidence: Evidence[] = labs.laboratories.slice(0, 3).map((l, i) => ({
          id: `ev-lab-${i}`,
          documentTitle: `BIS Recognized Laboratory Directory`,
          standardNumber: l.recognizedStandards[0] || 'BIS Recognized Labs',
          clause: 'Accreditation Schedule',
          page: 1,
          publicationDate: '2024-01-01',
          status: 'ACTIVE' as any,
          sourceUrl: l.sourceUrl,
          excerpt: `${l.name} (${l.city}, ${l.state}) is recognized for standards: ${l.recognizedStandards.join(', ')}. Capabilities: ${l.testingCapabilities.join(', ')}.`,
          similarityScore: 0.95
        }));
        return { data: labs, evidence };
      }
      default: {
        const ragRes = await this.ragService.searchEvidence({ query });
        return { data: ragRes, evidence: ragRes.results };
      }
    }
  }

  async runAgent(query: string, preferredLanguage?: IndianLanguage): Promise<AgentExecutionResponse> {
    return this.agent.execute(query, preferredLanguage);
  }
}
