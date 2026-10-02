import { Injectable } from "@nestjs/common";
import { ProcurementReport, TenderSpecification } from "@bis/shared-types";
import { ProcurementService } from "../procurement/procurement.service";
import { TestingService } from "../testing/testing.service";
import { LaboratoriesService } from "../laboratories/laboratories.service";

@Injectable()
export class ComplianceService {
  constructor(
    private procurementService: ProcurementService,
    private testingService: TestingService,
    private laboratoriesService: LaboratoriesService,
  ) {}

  async generateProcurementDossier(payload: {
    tenderTitle: string;
    tenderNumber?: string;
    procuringEntity?: string;
    rawSpecificationText: string;
  }): Promise<ProcurementReport> {
    const parsed = await this.procurementService.parseTenderSpecifications(
      payload.rawSpecificationText,
      payload.tenderTitle,
    );

    const recs = await this.procurementService.recommendProcurementStandards({
      tenderTitle: payload.tenderTitle,
      productName: parsed.boqItems[0]?.title || "Procured Items",
      materialSpec: parsed.boqItems[0]?.materialSpecification,
      operatingConditions: parsed.boqItems[0]?.operatingConditions,
      rawText: payload.rawSpecificationText,
    });

    const gfrAudit = await this.procurementService.auditGFR144iCompliance({
      tenderTitle: payload.tenderTitle,
      specificationText: payload.rawSpecificationText,
      boqItems: parsed.boqItems,
    });

    const topStandard =
      recs.recommendations[0]?.primaryStandard.standardNumber || "IS 4984:2016";
    const pdiSchedule = await this.testingService.getPDISchedule(topStandard);
    const labs = await this.laboratoriesService.searchLaboratories({
      standardNumber: topStandard,
    });

    const gemClauses = recs.recommendations.map((r) => {
      const qcoText = r.qcoMandate.isMandatory
        ? `Mandatory compliance with ${r.qcoMandate.orderTitle} (Gazette Notification: ${r.qcoMandate.gazetteNotificationNumber || "Statutory"}). Bidder must possess valid BIS Standard Mark (ISI / CRS) licence.`
        : "Recommended compliance with Bureau of Indian Standards specifications.";
      return `Item Specification: ${r.primaryStandard.title} shall strictly conform to Indian Standard ${r.primaryStandard.standardNumber}. ${qcoText} Sampling & PDI shall be executed as per ${pdiSchedule.samplingStandard}.`;
    });

    return {
      id: `DOSSIER-${Date.now().toString().slice(-6)}`,
      tenderTitle:
        payload.tenderTitle || "Public Procurement Compliance Dossier",
      tenderNumber:
        payload.tenderNumber ||
        `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`,
      procuringEntity:
        payload.procuringEntity ||
        "Government Department / Central PSU / GeM Buyer",
      generationDate: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      boqItems: parsed.boqItems,
      standardRecommendations: recs.recommendations,
      gfrAudit,
      gemClauses,
      pdiSchedules: [pdiSchedule],
      accreditedLaboratories: labs.laboratories.map((l) => ({
        name: l.name,
        location: `${l.city}, ${l.state}`,
        standards: l.recognizedStandards,
        nablStatus: l.recognitionStatus,
      })),
      statutoryCertificatesRequired: [
        "Valid BIS Certification Marks Licence (CM/L Number) or CRS Registration (R-Number)",
        "Class-I / Class-II Local Content Self-Declaration under Public Procurement (Preference to Make in India) Order 2017",
        "Raw Material Mill Test Certificate (MTC) with batch traceability",
        "NABL Accredited Type Test Report issued within last 24 months",
        "GFR 2017 Rule 144(xi) Land Border Country Compliance Undertaking",
      ],
      disclaimer:
        "This Procurement Compliance Dossier is synthesized via Manak Setu AI (Manak Setu Procurement Edition) in compliance with Bureau of Indian Standards (BIS), GeM Guidelines, and General Financial Rules (GFR 2017 Rule 144(i)). Official Gazette notifications can be verified at egazette.gov.in and manakonline.in.",
    };
  }
}
