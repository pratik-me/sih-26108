import { Standard } from './standards';
import { Evidence } from './rag';

export interface ExtractedParameter {
  name: string;
  specifiedValue: string;
  unit?: string;
  standardReference?: string;
  isRestrictedOrBiased: boolean;
  biasReason?: string;
  suggestedNeutralValue?: string;
  confidence: number; // 0-1
}

export interface BOQItem {
  itemNumber: number | string;
  title: string;
  description: string;
  quantity?: number;
  unit?: string;
  category?: string;
  materialSpecification?: string;
  operatingConditions?: string;
  extractedParameters: ExtractedParameter[];
  applicableStandardNumbers?: string[];
}

export interface TenderSpecification {
  tenderId?: string;
  tenderTitle: string;
  procuringEntity: string;
  category?: string;
  estimatedValue?: string;
  department?: string;
  rawSpecificationText: string;
  boqItems: BOQItem[];
}

export interface QCOMandate {
  isMandatory: boolean;
  orderTitle?: string;
  ministry?: string;
  gazetteNotificationNumber?: string;
  gazetteDate?: string;
  enforcementDate?: string;
  applicableScheme: 'SCHEME_I_ISI' | 'SCHEME_II_CRS' | 'SCHEME_IV_COPC' | 'SCHEME_X_FMCS' | 'VOLUNTARY';
  penalProvisionSummary?: string;
  officialGazetteUrl?: string;
}

export interface ActiveStandardReplacement {
  standardNumber: string;
  title: string;
  year: number;
  revisionSummary: string;
  effectiveDate: string;
  keyUpgrades: string[];
}

export interface NormativeReferenceStandard {
  standardNumber: string;
  title: string;
  relationshipType: 'RAW_MATERIAL' | 'TEST_METHOD' | 'DIMENSIONAL' | 'ENVIRONMENTAL' | 'SAFETY';
  mandatoryForPDI: boolean;
}

export interface StandardRecommendation {
  primaryStandard: Standard;
  normativeStandards: NormativeReferenceStandard[];
  qcoMandate: QCOMandate;
  isSuperseded: boolean;
  activeStandardReplacement?: ActiveStandardReplacement;
  confidenceScore: number; // 0 - 100
  relevanceReason: string;
  matchedBOQParameters: string[];
  missingMandatoryParameters: string[];
  pdiScheduleAvailable: boolean;
  evidence: Evidence[];
}

export interface GFRViolationClause {
  clauseIndex: number;
  originalText: string;
  biasType: 'BRAND_SPECIFIC' | 'RESTRICTIVE_DIMENSION' | 'PROPRIETARY_TEST' | 'OBSOLETE_STANDARD' | 'TAILOR_MADE_CRITERIA';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  suggestedNeutralClause: string;
  applicableISReference?: string;
}

export interface GfrAuditResult {
  tenderId?: string;
  tenderTitle?: string;
  overallComplianceScore: number; // 0 - 100
  isGfrCompliant: boolean;
  gfrRuleReference: string; // "GFR 2017 Rule 144(i) & Public Procurement (Preference to Make in India) Order"
  violatingClauses: GFRViolationClause[];
  summary: string;
  recommendations: string[];
  auditTimestamp?: string;
}

export interface PDITestItem {
  parameter: string;
  standardClause: string;
  testMethod: string;
  testType: 'ROUTINE' | 'TYPE' | 'ACCEPTANCE' | 'SPECIAL';
  samplingPlan: string;
  acceptanceCriteria: string;
  isDestructive: boolean;
  witnessAgency: string; // e.g., "Buyer QA / Third-Party Inspection Agency (TPIA)"
}

export interface PDISchedule {
  standardNumber: string;
  productName: string;
  lotInspectionCriteria: string;
  samplingStandard: string; // e.g. "IS 2500 (Part 1):2000"
  testItems: PDITestItem[];
  preDispatchChecklist: string[];
  recommendedTPIAs: string[]; // Third Party Inspection Agencies (e.g. RITES, CEIL, DNV, SGS, TUV)
}

export interface ProcurementReport {
  id: string;
  tenderTitle: string;
  tenderNumber?: string;
  procuringEntity: string;
  generationDate: string;
  boqItems: BOQItem[];
  standardRecommendations: StandardRecommendation[];
  gfrAudit: GfrAuditResult;
  gemClauses: string[];
  pdiSchedules: PDISchedule[];
  accreditedLaboratories: Array<{
    name: string;
    location: string;
    standards: string[];
    nablStatus: string;
  }>;
  statutoryCertificatesRequired: string[];
  disclaimer: string;
}

export interface SupersededStandardMapping {
  obsoleteStandard: string;
  activeStandard: string;
  title: string;
  yearWithdrawn: number;
  yearActive: number;
  gazetteReference?: string;
  keyChanges: string[];
  transitionGuidance: string;
}

