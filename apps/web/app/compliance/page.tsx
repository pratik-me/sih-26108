"use client";

import React, { useState } from "react";
import { apiClient } from "@bis/api-client";
import { GfrAuditResult } from "@bis/shared-types";
import { GfrAuditBadge, LoadingState } from "@bis/ui";
import {
  Scale,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const SAMPLE_BIAS_PROMPTS = [
  {
    title: "Brand Make Restriction (Solar Inverters)",
    text: "Supply of 100 kW Solar Inverter. Preferred Make: ABB / Sungrow / SMA only. Disqualify any domestic manufacturer not possessing European factory headquarters."
  },
  {
    title: "Primary Producer Only Bias (TMT Steel)",
    text: "Supply of Fe 500D TMT bars conforming to IS 1786:1985. Must be sourced solely from Primary Integrated Blast Furnace Steel Producers (SAIL / TATA / JSW). Re-rollers strictly disqualified even if possessing valid BIS CM/L licence."
  },
  {
    title: "Machinery Make Bias (HDPE Potable Water Pipes)",
    text: "Supply of PE 100 HDPE Pipes conforming to IS 4984:1995. Pipes must be extruded solely on KraussMaffei German extrusion lines. Bidders using Indian extrusion machinery shall be disqualified."
  },
  {
    title: "Imported & Foreign Make Only (LED Lighting)",
    text: "Supply of 120W Outdoor LED Luminaires. All LED driver components must be 100% foreign imported make. Make in India Class-I suppliers shall not be considered."
  }
];

export default function ComplianceAuditPage() {
  const [specText, setSpecText] = useState("");
  const [tenderTitle, setTenderTitle] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<GfrAuditResult | null>(null);

  const handleRunAudit = async (textToAudit?: string, title?: string) => {
    const targetText = textToAudit || specText;
    if (!targetText.trim()) return;

    setIsAuditing(true);
    try {
      const res = await apiClient.auditGFRCompliance({
        specificationText: targetText,
        tenderTitle: title || tenderTitle || "Tender Specification GFR 144(i) Bias Audit"
      });
      setAuditResult(res);
    } catch (err) {
      console.error("GFR Audit Error:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_BIAS_PROMPTS[0]) => {
    setTenderTitle(sample.title);
    setSpecText(sample.text);
    handleRunAudit(sample.text, sample.title);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#07111F] text-[#0B1F3A] dark:text-[#EAF2F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FC] dark:bg-[#163B59] border border-[#B9DDED] dark:border-[#263B50] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>GFR 2017 Rule 144(i) • Anti-Discriminatory Compliance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0B1F3A] dark:text-[#EAF2F8]">
              GFR 144(i) Anti-Bias Audit & <span className="text-[#0057A8] dark:text-[#16A9D8]">Neutral Clause Generator</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
              Under General Financial Rules (GFR 2017 Rule 144(i)) and Public Procurement Manual guidelines, tender specifications must be generic, functional, and non-restrictive. Detect brand bias, proprietary models, or tailor-made conditions and generate compliant Indian Standard replacement clauses.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F8FD] dark:bg-[#0B1A2B] border border-[#B9DDED] dark:border-[#263B50] text-xs text-[#263B53] dark:text-[#AFC1D2] max-w-xs space-y-1.5 shrink-0 shadow-2xs">
            <div className="font-bold flex items-center gap-1.5 text-[#0B1F3A] dark:text-[#EAF2F8]">
              <ShieldCheck className="w-4 h-4 text-[#0057A8] dark:text-[#16A9D8]" />
              <span>Statutory Rule Mandate</span>
            </div>
            <p className="text-[11px] text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
              &quot;Specifications shall not indicate a requirement for or reference to a particular trademark, patent, specific origin or producer.&quot;
            </p>
          </div>
        </div>

        {/* Preset Sample Bias Tests */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            One-Click Common Discriminatory Specification Audits:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_BIAS_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10243A] hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                  <span>{sample.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {sample.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Specification Input Box */}
        <div className="bg-white dark:bg-[#10243A] rounded-2xl border border-[#D8E3EE] dark:border-[#263B50] p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Tender Title / Clause Reference (Optional)
            </label>
            <input
              type="text"
              value={tenderTitle}
              onChange={(e) => setTenderTitle(e.target.value)}
              placeholder="e.g. GeM Bid Technical Schedule - Section 4: Eligibility Criteria"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Specification Clause Text to Audit for Bias
            </label>
            <textarea
              rows={5}
              value={specText}
              onChange={(e) => setSpecText(e.target.value)}
              placeholder="Paste tender clause, eligibility requirement, material restriction, or manufacturer condition here..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Checks against GFR 2017 Rule 144(i), Make-in-India Order, & Superseded Standards</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSpecText("");
                  setTenderTitle("");
                  setAuditResult(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleRunAudit()}
                disabled={isAuditing || !specText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0057A8] hover:bg-[#004783] disabled:opacity-50 text-white shadow-md transition-all cursor-pointer"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Auditing GFR Compliance...
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    Run GFR 144(i) Audit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isAuditing && (
          <div className="py-8">
            <LoadingState
              message="Evaluating Specification for Anti-Discriminatory Compliance..."
              submessage="Scanning for brand names, proprietary test methods, restrictive dimensions, and superseded standards..."
            />
          </div>
        )}

        {/* Audit Results */}
        {auditResult && !isAuditing && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <GfrAuditBadge auditResult={auditResult} />
          </div>
        )}
      </div>
    </div>
  );
}
