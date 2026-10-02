"use client";

import React, { useState } from "react";
import { apiClient } from "@bis/api-client";
import {
  BOQItem,
  GfrAuditResult,
  StandardRecommendation,
  TenderSpecification
} from "@bis/shared-types";
import {
  ProcurementCard,
  SupersededAlertCard,
  GfrAuditBadge,
  PDIScheduleCard,
  LoadingState
} from "@bis/ui";
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  RefreshCw,
  AlertTriangle,
  Download,
  BookOpen,
  Copy,
  Check,
  Layers,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TenderAnalyzerPage() {
  const router = useRouter();
  const [tenderTitle, setTenderTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [sampleTenders, setSampleTenders] = useState<TenderSpecification[]>([]);
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    tenderTitle: string;
    boqItems: BOQItem[];
    recommendations: StandardRecommendation[];
    gfrAudit: GfrAuditResult;
    totalItemsExtracted: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"recommendations" | "gfr" | "boq">("recommendations");

  React.useEffect(() => {
    const loadSamples = async () => {
      try {
        const samples = await apiClient.getSampleTenders();
        setSampleTenders(samples);
      } catch (err) {
        console.error("Failed to load sample tenders:", err);
      }
    };
    loadSamples();
  }, []);

  const handleSelectSample = (tenderId: string) => {
    const sample = sampleTenders.find((t) => t.tenderId === tenderId);
    if (sample) {
      setSelectedSample(tenderId);
      setTenderTitle(sample.tenderTitle);
      setRawText(sample.rawSpecificationText);
    }
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rawText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await apiClient.analyzeTender({
        rawText,
        tenderTitle: tenderTitle || "Public Procurement Tender Specification"
      });
      setAnalysisResult(res);
      setActiveTab("recommendations");
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#07111F] text-[#0B1F3A] dark:text-[#EAF2F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FC] dark:bg-[#163B59] border border-[#B9DDED] dark:border-[#263B50] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 26108 • Public Procurement AI Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0B1F3A] dark:text-[#EAF2F8]">
              Tender & BOQ <span className="text-[#0057A8] dark:text-[#16A9D8]">Specification Analyzer</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
              Upload or paste tender technical specifications & BOQ lines. Our AI extracts engineering parameters, identifies applicable Indian Standards (IS), verifies mandatory Quality Control Orders (QCO), audits GFR 2017 Rule 144(i) bias, and flags superseded standards.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/compliance"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#EAF4FB] dark:bg-[#163B59] text-[#0057A8] dark:text-[#16A9D8] hover:bg-[#D9EAF7] transition-all border border-[#B9DDED] dark:border-[#263B50]"
            >
              <Scale className="w-4 h-4" /> GFR 144(i) Bias Audit
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0057A8] hover:bg-[#004783] text-white transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> Export GeM Dossier
            </Link>
          </div>
        </div>

        {/* Input & Specification Box */}
        <div className="bg-white dark:bg-[#10243A] rounded-2xl border border-[#D8E3EE] dark:border-[#263B50] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Input Tender Specifications / BOQ Items
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste technical clauses or select pre-loaded GeM/CPPP sample tenders below
              </p>
            </div>

            {/* Quick Sample Selector */}
            {sampleTenders.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Demo Presets:</span>
                {sampleTenders.slice(0, 3).map((sample) => (
                  <button
                    key={sample.tenderId}
                    type="button"
                    onClick={() => handleSelectSample(sample.tenderId || "")}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                      selectedSample === sample.tenderId
                        ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {sample.category?.split("&")[0] || sample.tenderId}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Tender Title / GeM Bid Reference
              </label>
              <input
                type="text"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
                placeholder="e.g., Supply of HDPE Potable Water Pipes (DN 110mm - DN 315mm) or 100 kW Solar Inverter"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Technical Specifications & BOQ Lines (Text / Copy-Paste)
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste raw technical specification text, item descriptions, operating conditions, material grades, or test clauses here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero-Hallucination Grounding • Indian Standards Database</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTenderTitle("");
                    setRawText("");
                    setSelectedSample("");
                    setAnalysisResult(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || !rawText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0057A8] hover:bg-[#004783] disabled:opacity-50 text-white shadow-md transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Specifications...
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      Run AI Compliance Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="py-12">
            <LoadingState
              message="Analyzing Procurement Specifications & BOQ Lines..."
              submessage="Extracting engineering parameters, checking QCO Gazette mandates, verifying active vs superseded standards, and auditing GFR 144(i) bias..."
            />
          </div>
        )}

        {/* Results View */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Standards Matched</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {analysisResult.recommendations.length} Primary IS
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                  analysisResult.gfrAudit.isGfrCompliant ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">GFR 144(i) Fairness</div>
                  <div className={`text-xl font-extrabold ${
                    analysisResult.gfrAudit.overallComplianceScore >= 80 ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {analysisResult.gfrAudit.overallComplianceScore}/100
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">BOQ Items Analyzed</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {analysisResult.totalItemsExtracted} Items
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("recommendations")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "recommendations"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Applicable Indian Standards & QCOs ({analysisResult.recommendations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gfr")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "gfr"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                GFR 144(i) Bias Audit & Neutral Clauses
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("boq")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "boq"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Parsed BOQ Items & Parameters ({analysisResult.boqItems.length})
              </button>
            </div>

            {/* Tab 1: Recommendations */}
            {activeTab === "recommendations" && (
              <div className="space-y-4">
                {analysisResult.recommendations.map((rec, idx) => (
                  <ProcurementCard
                    key={idx}
                    recommendation={rec}
                    onViewDetails={(std) => router.push(`/standards`)}
                    onViewPDI={(std) => router.push(`/testing`)}
                  />
                ))}
              </div>
            )}

            {/* Tab 2: GFR Audit */}
            {activeTab === "gfr" && (
              <GfrAuditBadge auditResult={analysisResult.gfrAudit} />
            )}

            {/* Tab 3: BOQ Item Details */}
            {activeTab === "boq" && (
              <div className="space-y-4">
                {analysisResult.boqItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#10243A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                          BOQ Item #{item.itemNumber}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {item.title}
                        </h3>
                      </div>
                      {item.quantity && (
                        <div className="text-right text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">
                          Qty: <span className="font-bold">{item.quantity} {item.unit}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {item.extractedParameters && item.extractedParameters.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                          Extracted Engineering Parameters:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {item.extractedParameters.map((param, pIdx) => (
                            <div
                              key={pIdx}
                              className={`p-2.5 rounded-lg border text-xs ${
                                param.isRestrictedOrBiased
                                  ? "bg-red-50/70 border-red-200 dark:bg-red-950/30 dark:border-red-900"
                                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{param.name}</div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                                {param.specifiedValue}
                              </div>
                              {param.isRestrictedOrBiased && (
                                <div className="text-[10px] text-red-600 dark:text-red-400 font-medium mt-1">
                                  Restricted: {param.biasReason}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
