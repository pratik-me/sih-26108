"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProcurementReport } from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { LoadingState } from "@bis/ui";
import {
  Printer,
  FileBarChart2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  FlaskConical,
  Scale,
  Copy,
  Check,
  Download,
  BookOpen
} from "lucide-react";
import Image from "next/image";

function ComplianceReportsContent() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") || "High Density Polyethylene (HDPE) Potable Water Pipes";
  const tenderParam = searchParams.get("tender") || "Supply of PE 100 HDPE Pipes (DN 110mm to DN 315mm, PN 16)";

  const [dossier, setDossier] = useState<ProcurementReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedClauseIdx, setCopiedClauseIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.generateProcurementDossier({
          tenderTitle: tenderParam,
          procuringEntity: "Central / State PSU & GeM Buyer Organization",
          rawSpecificationText: `${tenderParam}. HDPE pipe conforming to IS 4984:2016 PE 100 grade resin with carbon black 2.0-2.5% and hydrostatic pressure resistance at 80°C.`
        });
        setDossier(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDossier();
  }, [productParam, tenderParam]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyClause = (clause: string, idx: number) => {
    navigator.clipboard.writeText(clause);
    setCopiedClauseIdx(idx);
    setTimeout(() => setCopiedClauseIdx(null), 2000);
  };

  if (isLoading || !dossier) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState
          message="Synthesizing GeM Procurement Compliance Dossier..."
          submessage="Compiling applicable Indian Standards, QCO legal mandates, GFR 144(i) certification, and PDI inspection schedules..."
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F7FAFC] dark:bg-[#07111F] text-[#0B1F3A] dark:text-[#EAF2F8] py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:text-slate-900 print:p-0">
      <div className="max-w-5xl mx-auto space-y-8 print:space-y-4">
        {/* Top Action Bar (hidden in print) */}
        <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#10243A] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold border border-[#D8E3EE] dark:border-[#263B50]">
              <FileBarChart2 className="w-3.5 h-3.5" />
              <span>SIH 26108 • GeM / CPPP Procurement Deliverable</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Procurement Compliance Dossier
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0057A8] hover:bg-[#004783] text-white shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF Dossier</span>
            </button>
          </div>
        </div>

        {/* Dossier Document Container */}
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-200 dark:border-slate-700 pb-6 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#0057A8] dark:text-[#16A9D8] font-bold text-xs uppercase tracking-wider">
                <Image
                  src={"/BIS-LOGO.png"}
                  alt="BIS Logo"
                  height={26}
                  width={26}
                  unoptimized
                />
                <span>Government e-Marketplace (GeM) & BIS Procurement Compliance Portal</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Tender Technical Specification & Standards Compliance Dossier
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Dossier ID: {dossier.id} • Date of Synthesis: {dossier.generationDate}
              </p>
            </div>

            <div className="text-right text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-800 dark:text-slate-200">Tender Ref:</div>
              <div className="font-mono text-blue-600 dark:text-blue-400 font-bold">{dossier.tenderNumber}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{dossier.procuringEntity}</div>
            </div>
          </div>

          {/* Section 1: Executive Summary & GFR Certification */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
              <Scale className="w-4 h-4 text-amber-600" />
              1. Statutory & GFR 2017 Rule 144(i) Compliance Certification
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  GFR Rule 144(i) Audit Status:
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  GFR Compliant (Fairness Score: {dossier.gfrAudit.overallComplianceScore}/100)
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {dossier.gfrAudit.summary}
              </p>
            </div>
          </div>

          {/* Section 2: Applicable Indian Standards & QCO Mandates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              2. Applicable Primary Indian Standards & Statutory QCO Mandates
            </div>
            <div className="space-y-3">
              {dossier.standardRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {rec.primaryStandard.standardNumber}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        — {rec.primaryStandard.title}
                      </span>
                    </div>
                    {rec.qcoMandate.isMandatory && (
                      <span className="font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Mandatory QCO Order
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {rec.primaryStandard.scope}
                  </p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Statutory Rule: {rec.qcoMandate.penalProvisionSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: GeM Copy-Pasteable Specification Clauses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                <FileText className="w-4 h-4 text-purple-600" />
                3. GeM / CPPP Copy-Pasteable Technical Specification Clauses
              </div>
            </div>
            <div className="space-y-2">
              {dossier.gemClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                    {clause}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyClause(clause, idx)}
                    className="shrink-0 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-blue-600 print:hidden transition-colors"
                    title="Copy Clause"
                  >
                    {copiedClauseIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Pre-Dispatch Inspection (PDI) Schedule */}
          {dossier.pdiSchedules && dossier.pdiSchedules.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                4. Pre-Dispatch Inspection (PDI) & Acceptance Testing Matrix
              </div>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                      <th className="p-2.5">Test Parameter</th>
                      <th className="p-2.5">Clause / Standard</th>
                      <th className="p-2.5">Sampling Plan</th>
                      <th className="p-2.5">Acceptance Criteria</th>
                      <th className="p-2.5">Witness Agency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dossier.pdiSchedules[0].testItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{item.parameter}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{item.standardClause}</td>
                        <td className="p-2.5">{item.samplingPlan}</td>
                        <td className="p-2.5">{item.acceptanceCriteria}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{item.witnessAgency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Statutory Undertakings Required */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              5. Mandatory Bidder Certificates & Undertakings for GeM Submission
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {dossier.statutoryCertificatesRequired.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Statutory Notice:</p>
            <p>{dossier.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComplianceReportsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Generating Compliance Dossier...</div>}>
      <ComplianceReportsContent />
    </React.Suspense>
  );
}
