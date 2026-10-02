import { QueryIntent } from './enums';
import { Citation, Evidence } from './rag';

export type ToolName =
  | 'extract_tender_specifications'
  | 'recommend_procurement_standards'
  | 'audit_gfr_144i_compliance'
  | 'check_superseded_standard'
  | 'get_qco_statutory_mandate'
  | 'get_pdi_inspection_schedule'
  | 'search_standards'
  | 'recommend_standards'
  | 'get_standard_details'
  | 'search_certification_schemes'
  | 'get_certification_process'
  | 'get_testing_requirements'
  | 'search_laboratories'
  | 'search_bis_documents'
  | 'get_source_details'
  | 'translate_query';

export interface ToolCallPayload {
  tool: ToolName;
  arguments: Record<string, unknown>;
}

export interface ToolExecutionResult {
  tool: ToolName;
  success: boolean;
  data: unknown;
  evidence: Evidence[];
  error?: string;
}

export interface AgentStepTrace {
  stepNumber: number;
  thoughtSummary?: string;
  toolCalled?: ToolName;
  arguments?: Record<string, unknown>;
  evidenceCount?: number;
}

export interface AgentExecutionResponse {
  query: string;
  intent: QueryIntent;
  structuredAnswer: string;
  citations: Citation[];
  evidence: Evidence[];
  suggestedFollowUps: string[];
  workflowOffers: Array<{
    type: 'ANALYZE_TENDER' | 'RUN_GFR_AUDIT' | 'CHECK_SUPERSEDED' | 'VIEW_PDI_SCHEDULE' | 'FIND_TESTING' | 'FIND_LAB' | 'GENERATE_REPORT' | 'VIEW_ROADMAP';
    label: string;
    actionPayload: Record<string, unknown>;
  }>;
}
