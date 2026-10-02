"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProductProfileQuery,
  ProductRecommendationResult,
} from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { RecommendationCard, LoadingState, EmptyState } from "@bis/ui";
import {
  Compass,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SampleFormData } from "@/lib/sample";
import { useTranslation } from "@/lib/i18n";

export default function FindMyStandardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<ProductProfileQuery>({
    productName: "",
    material: "",
    intendedApplication: "",
    industry: "",
    capacity: "",
    technicalCharacteristics: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProductRecommendationResult | null>(
    null,
  );

  const runEvaluation = async (payload: ProductProfileQuery) => {
    if (!payload.productName.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiClient.recommendStandards(payload);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await runEvaluation(formData);
  };

  const handleLoadSample = async () => {
    setFormData(SampleFormData);
    await runEvaluation(SampleFormData);
  };

  const handleClear = () => {
    setFormData({
      productName: "",
      material: "",
      intendedApplication: "",
      industry: "",
      capacity: "",
      technicalCharacteristics: "",
    });
    setResult(null);
  };

  const handleSelectMatch = (match: any) => {
    router.push(
      `/certification?std=${encodeURIComponent(match.standard.standardNumber)}&product=${encodeURIComponent(formData.productName)}`,
    );
  };

  const handleViewTesting = (stdNumber: string) => {
    router.push(`/testing?std=${encodeURIComponent(stdNumber)}`);
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
        {/* Header Banner */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10243A] text-[#0B1F3A] dark:text-[#EAF2F8] shadow-[0_4px_16px_rgba(11,31,58,0.06)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.30)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden border border-[#D8E3EE] dark:border-[#263B50]">
          <div className="relative space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FC] dark:bg-[#0B1A2B] border border-[#B9DDED] dark:border-[#263B50] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" />
              <span>{t("findstd.badge", "AI Product Scope Profiler")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0B1F3A] dark:text-[#EAF2F8]">
              {t("findstd.title_prefix", "Find Applicable")}{" "}
              <span className="text-[#0057A8] dark:text-[#16A9D8]">
                {t("findstd.title_highlight", "Indian Standard")}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52657A] dark:text-[#AFC1D2] max-w-xl leading-relaxed">
              {t("findstd.subtitle", "Input your product specifications, raw materials, and intended application. Our semantic engine matches your product against published Indian Standards with exact matching criteria and missing attribute prompts.")}
            </p>
          </div>

          <div className="relative z-10 p-4 rounded-2xl bg-[#F0F8FD] dark:bg-[#0B1A2B] border border-[#B9DDED] dark:border-[#263B50] text-xs text-[#263B53] dark:text-[#AFC1D2] max-w-xs space-y-1.5 shadow-2xs">
            <div className="font-bold flex items-center justify-center gap-1.5 text-[#0B1F3A] dark:text-[#EAF2F8]">
              <ShieldCheck className="w-4 h-4 text-[#0057A8] dark:text-[#16A9D8]" />
              <span>{t("findstd.anti_badge", "Anti-Speculation Standard")}</span>
            </div>
            <p className="text-[11px] text-[#52657A] dark:text-[#AFC1D2] text-center leading-relaxed">
              {t("findstd.anti_desc", "Semantic similarity is presented as potentially applicable. Always verify final grade classification against statutory QCOs.")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#10243A] p-6 rounded-2xl border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.30)] space-y-5">
            <div className="border-b border-[#D8E3EE] dark:border-[#263B50] pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A] dark:text-[#EAF2F8]">
                {t("findstd.form_title", "Product Specification Form")}
              </h2>
              <p className="text-xs text-[#7A8CA0] dark:text-[#8299AD]">
                {t("findstd.form_subtitle", "Provide as many details as possible for precise standard matching.")}
              </p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#263B53] dark:text-[#EAF2F8] mb-1">
                {t("findstd.field_product", "Product Name / Type")} <span className="text-[#C93636]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={e => setFormData({ ...formData, productName: e.target.value })}
                placeholder={t("findstd.placeholder_product", "e.g. Stainless Steel Vacuum Bottle, Lithium Battery, Submersible Pump")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E3EE] dark:border-[#263B50] bg-white dark:bg-[#0B1A2B] text-[#263B53] dark:text-[#EAF2F8] placeholder:text-[#7A8CA0] dark:placeholder:text-[#7A8CA0] focus:outline-none focus:border-[#0E9FCE] focus:ring-2 focus:ring-[#0E9FCE]/12"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263B53] dark:text-[#EAF2F8] mb-1">
                {t("findstd.field_material", "Raw Material Composition")}
              </label>
              <input
                type="text"
                value={formData.material ?? ""}
                onChange={e => setFormData({ ...formData, material: e.target.value })}
                placeholder={t("findstd.placeholder_material", "e.g. Austenitic SS 304, Grade Fe 500D, PVC Resin, Polyethylene")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E3EE] dark:border-[#263B50] bg-white dark:bg-[#0B1A2B] text-[#263B53] dark:text-[#EAF2F8] placeholder:text-[#7A8CA0] dark:placeholder:text-[#7A8CA0] focus:outline-none focus:border-[#0E9FCE] focus:ring-2 focus:ring-[#0E9FCE]/12"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-[#F1F5F9] mb-1">
                {t("findstd.field_use", "Intended End Use / Application")}
              </label>
              <input
                type="text"
                value={formData.intendedApplication ?? ""}
                onChange={e => setFormData({ ...formData, intendedApplication: e.target.value })}
                placeholder={t("findstd.placeholder_use", "e.g. Potable water storage, domestic food contact, structural reinforcement")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E3EE] dark:border-[#263B50] bg-white dark:bg-[#0B1A2B] text-[#263B53] dark:text-[#EAF2F8] placeholder:text-[#7A8CA0] dark:placeholder:text-[#7A8CA0] focus:outline-none focus:border-[#0E9FCE] focus:ring-2 focus:ring-[#0E9FCE]/12"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263B53] dark:text-[#EAF2F8] mb-1">
                {t("findstd.field_techspec", "Key Technical Characteristics")}
              </label>
              <input
                type="text"
                value={formData.technicalCharacteristics}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technicalCharacteristics: e.target.value,
                  })
                }
                placeholder={t("findstd.placeholder_techspec", "e.g. Voltage rating 1.1kV, double wall vacuum insulation, diameter 12mm Fe 500D")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E3EE] dark:border-[#263B50] bg-white dark:bg-[#0B1A2B] text-[#263B53] dark:text-[#EAF2F8] placeholder:text-[#7A8CA0] dark:placeholder:text-[#7A8CA0] focus:outline-none focus:border-[#0E9FCE] focus:ring-2 focus:ring-[#0E9FCE]/12"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#0057A8] hover:bg-[#004783] dark:bg-[#1268B3] dark:hover:bg-[#1679C7] text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{t("findstd.btn_evaluate", "Evaluate Applicable Standards")}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-[#F1F7FC] dark:bg-transparent dark:hover:bg-[#153653] text-[#52657A] dark:text-[#A8B6C7] border border-[#D8E3EE] dark:border-[#263B50] transition-all cursor-pointer"
              >
                {t("findstd.btn_clear", "Clear")}
              </button>
            </div>
          </form>
        </div>

        {/* Right Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">
              {t("findstd.results_title", "Evaluated Indian Standards")}{" "}
              {result ? `(${result.totalMatches})` : ""}
            </h2>
            {result && (
              <span className="text-xs text-slate-500 dark:text-[#7F91A5] font-medium">
                {t("findstd.results_complete", "Grounded Assessment Completed")}
              </span>
            )}
          </div>

          {isLoading ? (
            <LoadingState
              message={t("findstd.loading_msg", "Evaluating Product-to-Standard Scope...")}
              submessage={t("findstd.loading_sub", "Scanning Gazette notifications, sectional committee divisions, and material grade parameters...")}
            />
          ) : result && result.matches.length > 0 ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-[#0B1A2B] border border-blue-200 dark:border-[#263B50] text-xs text-blue-900 dark:text-[#A8B6C7] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-[#16A9D8] shrink-0 mt-0.5" />
                <span>{result.guidanceNotes}</span>
              </div>

              {result.matches.map((match, idx) => (
                <RecommendationCard
                  key={idx}
                  match={match}
                  onSelect={handleSelectMatch}
                  onViewTesting={handleViewTesting}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("findstd.empty_title", "No Profile Evaluated Yet")}
              description={t("findstd.empty_desc", "Fill in the product specification attributes on the left and click 'Evaluate Applicable Standards' to generate matched Indian Standards with clause citations.")}
              icon={Compass}
              actionLabel={t("findstd.btn_sample", "Run Sample Evaluation (SS Water Bottle)")}
              onAction={handleLoadSample}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);
}
