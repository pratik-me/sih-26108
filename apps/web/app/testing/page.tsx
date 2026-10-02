"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PDISchedule, TestingRequirement } from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { TestingRequirementCard, PDIScheduleCard, LoadingState, EmptyState } from "@bis/ui";
import { FlaskConical, Search, ShieldCheck, ClipboardCheck, FileText } from "lucide-react";

function TestingRequirementsContent() {
  const searchParams = useSearchParams();
  const stdParam = searchParams.get("std") || "";

  const [activeTab, setActiveTab] = useState<"pdi" | "routine">("pdi");
  const [filterStd, setFilterStd] = useState(stdParam);
  const [filterName, setFilterName] = useState("");
  const [requirements, setRequirements] = useState<TestingRequirement[]>([]);
  const [pdiSchedules, setPdiSchedules] = useState<PDISchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getTestingRequirements({
        standardNumber: filterStd || undefined,
        testName: filterName || undefined
      });
      setRequirements(data);

      const pdis = await apiClient.getAllPDISchedules();
      setPdiSchedules(pdis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPdis = pdiSchedules.filter((p) =>
    !filterStd ||
    p.standardNumber.toLowerCase().includes(filterStd.toLowerCase()) ||
    p.productName.toLowerCase().includes(filterStd.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#F7FAFC] dark:bg-[#07111F] text-[#0B1F3A] dark:text-[#EAF2F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FC] dark:bg-[#163B59] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold border border-[#B9DDED] dark:border-[#263B50]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Pre-Procurement Quality Assurance & Lot Inspection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] dark:text-[#EAF2F8] tracking-tight">
              Pre-Dispatch Inspection (PDI) & <span className="text-[#0057A8] dark:text-[#16A9D8]">Testing Schedules</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
              Examine lot sampling criteria (IS 2500 Level II), routine vs. acceptance test matrices, and Third-Party Inspection Agency (TPIA / RITES) witness protocols for public contracts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F8FD] dark:bg-[#0B1A2B] border border-[#B9DDED] dark:border-[#263B50] text-xs text-[#263B53] dark:text-[#AFC1D2] max-w-xs space-y-1.5 shrink-0 shadow-2xs">
            <div className="font-bold flex items-center gap-1.5 text-[#0B1F3A] dark:text-[#EAF2F8]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>IS 2500 Sampling Plan</span>
            </div>
            <p className="text-[11px] text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
              Mandatory acceptance testing verifies that supplied production batches strictly match BIS licence scopes.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("pdi")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "pdi"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ClipboardCheck className="w-4 h-4" /> Pre-Dispatch Inspection (PDI) Schedules ({pdiSchedules.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("routine")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "routine"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FlaskConical className="w-4 h-4" /> Individual Test Clauses & Methods ({requirements.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-[#D8E3EE] dark:border-[#263B50] shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={filterStd}
              onChange={(e) => setFilterStd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  fetchRequirements();
                }
              }}
              placeholder="Filter by Standard Number (e.g. IS 4984, IS 1786, IS 16221, IS 10322)..."
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1A2B] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="button"
            onClick={fetchRequirements}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#0057A8] hover:bg-[#004783] text-white rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
          >
            Filter Schedules
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingState
            message="Retrieving Inspection Schedules & Acceptance Matrices..."
            submessage="Cross-referencing laboratory test methods and sampling frequencies..."
          />
        ) : activeTab === "pdi" ? (
          filteredPdis.length > 0 ? (
            <div className="space-y-6">
              {filteredPdis.map((pdi, idx) => (
                <PDIScheduleCard key={idx} schedule={pdi} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No PDI Schedules Found"
              description="Try searching with a standard like 'IS 4984' or 'IS 1786'."
              icon={ClipboardCheck}
              actionLabel="Show All PDI Schedules"
              onAction={() => setFilterStd("")}
            />
          )
        ) : requirements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((test, idx) => (
              <TestingRequirementCard key={test.id || idx} test={test} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Testing Requirements Found"
            description="Try searching with a standard number like 'IS 4984', 'IS 1786', or 'IS 16221'."
            icon={FlaskConical}
            actionLabel="Show All Tests"
            onAction={() => {
              setFilterStd("");
              setFilterName("");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function TestingRequirementsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Testing Schedules...</div>}>
      <TestingRequirementsContent />
    </React.Suspense>
  );
}
