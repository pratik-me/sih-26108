"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRole } from "@bis/shared-types";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FlaskConical,
  Building2,
  CheckCircle2,
  FileCheck2,
  Scale,
  Compass,
  AlertOctagon,
  FileText,
  FileBarChart2,
  Download,
  Bot,
  Layers,
  Check,
  Copy,
  AlertTriangle
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.PROCUREMENT_OFFICER);
  const [copiedSampleIdx, setCopiedSampleIdx] = useState<number | null>(null);

  const roleData: Record<
    string,
    {
      label: string;
      placeholder: string;
      prompts: string[];
    }
  > = {
    [UserRole.PROCUREMENT_OFFICER]: {
      label: "Procurement Officer",
      placeholder: "Ask about applicable Indian Standards, mandatory QCO Gazette orders, or tender BOQ...",
      prompts: [
        "Which Indian Standard and mandatory QCO apply to HDPE Potable Water Pipes?",
        "Audit our tender clause for GFR 144(i) brand bias (Solar Inverter ABB make only)",
        "Why is IS 800:1984 superseded, and what is the active replacement standard?",
        "What are the Pre-Dispatch Inspection (PDI) sampling requirements for Fe 500D TMT bars?",
      ],
    },
    [UserRole.BUYER_GEM]: {
      label: "GeM Buyer",
      placeholder: "Search GeM specification compliance, CRS registration R-numbers, or ISI licences...",
      prompts: [
        "What standards and CRS Scheme-II rules apply to Commercial LED Street Lighting?",
        "Generate copy-pasteable GeM specification clauses for Solar PV Modules",
        "How to verify bidder's BIS CM/L licence status for drinking water supply projects?",
        "Mandatory Make-in-India local content clauses under GFR 144(i)",
      ],
    },
    [UserRole.QA_ENGINEER]: {
      label: "QA / Inspection Engineer",
      placeholder: "Look up PDI lot inspection criteria, IS 2500 sampling tables, and acceptance tests...",
      prompts: [
        "Pre-Dispatch lot inspection criteria & 100-hour hydrostatic test for IS 4984 pipes",
        "Tensile TS/YS ratio and 180° bend test acceptance criteria for Fe 500D rebars",
        "Find NABL accredited testing laboratories for high voltage cable testing",
        "What is the required sample size under IS 2500 (Part 1) Level II inspection?",
      ],
    },
    [UserRole.BIDDER_SUPPLIER]: {
      label: "Bidder / Supplier",
      placeholder: "Check tender eligibility, BIS licence scopes, and substitute non-discriminatory clauses...",
      prompts: [
        "Our tender specifies 'Primary Steel Producer Only'. How does this violate GFR 144(i)?",
        "What test certificates and BIS mark markings are mandatory for GeM dispatch?",
        "Differences between IS 4984:1995 and IS 4984:2016 for tender bidding",
        "How to obtain Scheme-I ISI Mark licence for municipal water supply fittings?",
      ],
    },
  };

  const currentRoleConfig = roleData[currentRole] || roleData[UserRole.PROCUREMENT_OFFICER];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(searchQuery)}`);
  };

  const handlePromptClick = (promptText: string) => {
    router.push(`/chat?q=${encodeURIComponent(promptText)}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7FAFC] dark:bg-[#07111F] overflow-hidden text-[#0B1F3A] dark:text-[#EAF2F8]">
      {/* Background Hero Gradients */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[550px] pointer-events-none dark:hidden"
        style={{
          background: "radial-gradient(circle at 50% 10%, #EAF6FC 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[550px] pointer-events-none hidden dark:block"
        style={{
          background: "radial-gradient(circle at 50% 10%, rgba(22, 169, 216, 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#10243A] border border-[#B9DDED] dark:border-[#263B50] shadow-xs text-xs font-semibold text-[#0057A8] dark:text-[#16A9D8]">
            <Sparkles className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" />
            <span>Smart India Hackathon 2026 • Problem Statement 26108</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1F3A] dark:text-[#F1F5F9] leading-[1.12]">
            AI-Powered Recommendation Engine for{" "}
            <span className="text-[#0057A8] dark:text-[#16A9D8]">
              Procurement Specifications
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#52657A] dark:text-[#AFC1D2] max-w-3xl mx-auto leading-relaxed">
            Authoritative decision support for <strong>GeM Buyers, PSUs, and Tender Drafting Committees</strong> to instantly identify applicable Indian Standards (IS), enforce mandatory Quality Control Orders (QCO), eliminate GFR 144(i) brand bias, and generate Pre-Dispatch Inspection schedules.
          </p>

          {/* Role Persona Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { role: UserRole.PROCUREMENT_OFFICER, label: "Procurement Officer", icon: FileCheck2 },
              { role: UserRole.BUYER_GEM, label: "GeM Buyer", icon: Layers },
              { role: UserRole.QA_ENGINEER, label: "QA & Inspection Engineer", icon: FlaskConical },
              { role: UserRole.BIDDER_SUPPLIER, label: "Bidder / Supplier", icon: ShieldCheck },
            ].map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => setCurrentRole(role)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${currentRole === role
                    ? "bg-[#0057A8] text-white shadow-md shadow-blue-900/20 scale-105"
                    : "bg-white dark:bg-[#10243A] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50] hover:bg-[#F1F7FC]"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Search Query Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="relative flex items-center rounded-2xl bg-white dark:bg-[#10243A] border-2 border-[#D8E3EE] dark:border-[#263B50] shadow-[0_8px_30px_rgba(11,31,58,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-within:border-[#0057A8] dark:focus-within:border-[#16A9D8] transition-all p-1.5">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentRoleConfig.placeholder}
                  className="w-full px-3 py-3 text-xs sm:text-sm bg-transparent text-[#0B1F3A] dark:text-[#F1F5F9] placeholder:text-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#0057A8] hover:bg-[#004783] text-white shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              {currentRoleConfig.prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-[#10243A]/80 border border-slate-200 dark:border-slate-700/80 px-2.5 py-1 rounded-lg hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  &ldquo;{prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Launchpad Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tender Analyzer */}
          <Link
            href="/procure"
            className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Tender & BOQ Analyzer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload tender documents or paste BOQ lines to extract parameters and match primary Indian Standards.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1">
              Analyze Tender →
            </div>
          </Link>

          {/* Card 2: GFR 144(i) Bias Audit */}
          <Link
            href="/compliance"
            className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              GFR 144(i) Anti-Bias Audit
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Detect restrictive brand make bias or tailor-made conditions and generate neutral standard-compliant clauses.
            </p>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
              Audit Specifications →
            </div>
          </Link>

          {/* Card 3: PDI & Testing */}
          <Link
            href="/testing"
            className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Pre-Dispatch Inspection (PDI)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Access IS 2500 lot sampling criteria, acceptance tests, and Third-Party Inspection Agency (TPIA) protocols.
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              View PDI Schedules →
            </div>
          </Link>

          {/* Card 4: 3-Panel AI Workspace */}
          <Link
            href="/chat"
            className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              3-Panel AI Workspace
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Grounded AI chat with synchronized citation drawer, clause evidence panel, and tool-calling capabilities.
            </p>
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-1">
              Open AI Workspace →
            </div>
          </Link>
        </div>

        {/* Feature Spotlight: Superseded Standards Detector */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1F3A] to-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Superseded Standards Detection Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Eliminate Obsolete Standards From Public Tenders
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tenders citing withdrawn standards like <strong>IS 800:1984</strong>, <strong>IS 456:1978</strong>, <strong>IS 1786:1985</strong>, or <strong>IS 4984:1995</strong> risk statutory non-compliance and legal challenges under Quality Control Orders. Manak Setu AI automatically flags obsolete standards and replaces them with active revisions.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/standards"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0057A8] hover:bg-[#004783] text-white shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                  <span>Explore Superseded Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-xs">
              <div className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Live Superseded Resolution Example:
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200">
                  <span className="font-bold">❌ Cited in BOQ: </span>IS 4984:1995 (High Density Polyethylene Pipes)
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200">
                  <span className="font-bold">✔ Active Replacement: </span>IS 4984:2016 (PE 100 Virgin Grade + Slow Crack Growth SCG Notch Test)
                </div>
              </div>
              <p className="text-[11px] text-slate-300 italic pt-1">
                &ldquo;Incorporates mandatory DPIIT Quality Control Order compliance and alignment with Jal Jeevan Mission technical schedules.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Why Manak Setu AI Architecture Breakdown */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              State-of-the-Art Public Procurement Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Built on hybrid RAG, deterministic verification, and multilingual token protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Zero Hallucination Guarantee
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every recommended standard clause is backed by verified BIS document chunks, page numbers, and Gazette QCO citations in a 3-panel drawer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> GFR Rule 144(i) Audit Engine
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated regex and LLM semantic auditing for brand names (ABB, SAIL, Cisco) and generation of neutral generic replacement clauses.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#10243A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-purple-600 dark:text-purple-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> 22 Indian Languages + Hinglish
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete Eighth-Schedule Indian language support with token protection for standard designations (e.g. `IS 10500`, `Clause 4.2`, `QCO`).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
