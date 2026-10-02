"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CertificationScheme, ComplianceRoadmapStep } from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { ComplianceStep, LoadingState } from "@bis/ui";
import { useTranslation } from "@/lib/i18n";
import {
  Award,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  FileBarChart2,
} from "lucide-react";

function CertificationContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const stdParam = searchParams.get("std") || "IS 17526:2021";
  const productParam =
    searchParams.get("product") ||
    "Stainless Steel Vacuum Insulated Water Bottle";

  const [schemes, setSchemes] = useState<CertificationScheme[]>([]);
  const [selectedSchemeCode, setSelectedSchemeCode] =
    useState<string>("SCHEME-I");
  const [roadmapSteps, setRoadmapSteps] = useState<ComplianceRoadmapStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSchemesAndRoadmap = async () => {
      setIsLoading(true);
      try {
        const schemeList = await apiClient.getCertificationSchemes();
        setSchemes(schemeList);

        const roadmapRes = await apiClient.getCertificationRoadmap(
          stdParam,
          productParam,
        );
        setRoadmapSteps(roadmapRes.steps);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSchemesAndRoadmap();
  }, [stdParam, productParam]);

  const activeScheme =
    schemes.find((s) => s.code === selectedSchemeCode) ||
    (schemes.length > 0 ? schemes[0] : null);

  const handleGenerateReport = () => {
    router.push(
      `/reports?product=${encodeURIComponent(productParam)}&std=${encodeURIComponent(stdParam)}`,
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7FAFC] dark:bg-[#07111F] overflow-hidden text-[#0B1F3A] dark:text-[#EAF2F8]">
      {/* Subtle atmospheric hero glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[450px] pointer-events-none dark:hidden"
        style={{
          background: 'radial-gradient(circle at 50% 15%, #EAF6FC 0%, transparent 45%)',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[450px] pointer-events-none hidden dark:block"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(22, 169, 216, 0.08) 0%, transparent 45%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#10243A] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold border border-[#D8E3EE] dark:border-[#263B50] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" />
              <span>
                {t("certification.badge", "BIS Conformity Assessment Schemes")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] dark:text-[#EAF2F8] tracking-tight">
              {t(
                "certification.title",
                "Certification Schemes & Compliance Roadmap",
              )}
            </h1>
            <p className="text-sm sm:text-base text-[#52657A] dark:text-[#AFC1D2] max-w-2xl leading-relaxed">
              {t(
                "certification.subtitle",
                "Understand statutory conformity schemes, mandatory factory audits, laboratory sample testing, and step-by-step licence grant procedures.",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateReport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[#0057A8] hover:bg-[#004783] dark:bg-[#1268B3] dark:hover:bg-[#1679C7] text-white shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <FileBarChart2 className="w-4 h-4" />
            <span>
              {t("certification.btn_report", "Generate Full Compliance Report")}
            </span>
          </button>
        </div>

        {/* Active Product Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-[0_4px_16px_rgba(11,31,58,0.06)]">
          <div>
            <span className="font-bold text-[#0057A8] dark:text-[#16A9D8]">
              {t(
                "certification.active_product",
                "Active Product Roadmap:",
              )}{" "}
            </span>
            <span className="font-black text-[#0B1F3A] dark:text-[#EAF2F8]">{productParam}</span>
            <span className="text-[#0057A8] dark:text-[#16A9D8] ml-2 font-mono font-bold">
              ({stdParam})
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/standards/recommend")}
            className="text-[#0057A8] dark:text-[#16A9D8] font-bold hover:text-[#004783] dark:hover:text-white hover:underline shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>
              {t("certification.btn_change", "Change Product Profile →")}
            </span>
          </button>
        </div>

        {/* Schemes Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {schemes.map((s) => {
            const isSelected = selectedSchemeCode === s.code;
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => setSelectedSchemeCode(s.code)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#F0F8FD] dark:bg-[#163B59] border-2 border-[#0057A8] dark:border-[#16A9D8] shadow-[0_8px_24px_rgba(0,87,168,0.12)]"
                    : "bg-white dark:bg-[#10243A] border-[#D8E3EE] dark:border-[#263B50] hover:border-[#B9DDED] dark:hover:bg-[#153653] shadow-[0_4px_16px_rgba(11,31,58,0.06)]"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-[#0057A8] dark:text-[#16A9D8] block uppercase">
                  {s.code}
                </span>
                <h3 className="text-sm font-bold text-[#0B1F3A] dark:text-[#EAF2F8] mt-0.5">
                  {s.name.split("—")[0]}
                </h3>
                <p className="text-xs text-[#52657A] dark:text-[#AFC1D2] line-clamp-2 mt-1">
                  {s.applicability}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Roadmap Workflow */}
        {isLoading ? (
          <LoadingState
            message={t(
              "certification.loading_msg",
              "Loading Certification Scheme Requirements...",
            )}
            submessage={t(
              "certification.loading_sub",
              "Compiling documentation checklists and audit schedules...",
            )}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Roadmap Steps */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {t(
                    "certification.roadmap_title",
                    "Interactive Step-by-Step Certification Journey",
                  )}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-[#ADE8F4]/80">
                  ({roadmapSteps.length} {t("certification.phases", "Phases")})
                </span>
              </h2>

              <div className="space-y-4">
                {roadmapSteps.map((step, idx) => (
                  <ComplianceStep key={idx} step={step} isCurrent={idx === 1} />
                ))}
              </div>
            </div>

            {/* Right Scheme Details Drawer */}
            {activeScheme && (
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-slate-200 dark:border-[#263B50] shadow-sm dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] space-y-4 sticky top-24">
                  <div className="border-b border-slate-100 dark:border-[#263B50] pb-3">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {t("certification.details_tag", "Scheme Details")}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9] mt-0.5">
                      {activeScheme.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#A8B6C7] leading-relaxed">
                    {activeScheme.description}
                  </p>

                  {/* Mandatory Documentation Checklist */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-semibold text-slate-800 dark:text-[#F1F5F9] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-[#16A9D8]" />{" "}
                      {t(
                        "certification.docs_title",
                        "Statutory Documents Required:",
                      )}
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-[#A8B6C7]">
                      {activeScheme.requiredDocuments.map((doc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#22C55E] shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fees & Validity */}
                  <div className="pt-3 border-t border-slate-100 dark:border-[#263B50] space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-[#F1F5F9]">
                        {t("certification.fee_title", "Fee Structure:")}{" "}
                      </span>
                      <p className="text-slate-600 dark:text-[#A8B6C7] mt-0.5">
                        {activeScheme.feeStructureSummary}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-[#F1F5F9]">
                          {t("certification.validity", "Validity:")}{" "}
                        </span>
                        <span className="text-slate-600 dark:text-[#A8B6C7]">
                          {activeScheme.validityPeriod}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-[#F1F5F9]">
                          {t(
                            "certification.surveillance",
                            "Surveillance:",
                          )}{" "}
                        </span>
                        <span className="text-slate-600 dark:text-[#A8B6C7]">
                          {activeScheme.surveillanceFrequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* External Official Link */}
                  <a
                    href={activeScheme.officialGuidelineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-sm transition-all"
                  >
                    <span>
                      {t(
                        "certification.link_official",
                        "Official Manakonline / CRS Portal",
                      )}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CertificationSchemesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">Loading...</div>
      }
    >
      <CertificationContent />
    </React.Suspense>
  );
}
