"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Standard, SupersededStandardMapping } from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { StandardCard, SupersededAlertCard, LoadingState, EmptyState } from "@bis/ui";
import { Search, Filter, BookOpen, AlertOctagon, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

export default function StandardsCatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "superseded">("active");
  const [query, setQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [mandatoryOnly, setMandatoryOnly] = useState<boolean>(false);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [supersededList, setSupersededList] = useState<SupersededStandardMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const divisions = [
    "All Divisions",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrotechnical",
    "Metallurgical Engineering",
    "Food and Agriculture"
  ];

  const fetchStandards = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.searchStandards(query, {
        division: selectedDivision === "All Divisions" ? undefined : selectedDivision,
        isMandatory: mandatoryOnly ? true : undefined
      });
      setStandards(res.standards);

      const sup = await apiClient.getAllSupersededStandards();
      setSupersededList(sup);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [selectedDivision, mandatoryOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStandards();
  };

  const handleSelectStandard = (standard: Standard) => {
    router.push(`/procure`);
  };

  const filteredSuperseded = supersededList.filter(s =>
    !query ||
    s.obsoleteStandard.toLowerCase().includes(query.toLowerCase()) ||
    s.activeStandard.toLowerCase().includes(query.toLowerCase()) ||
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#F7FAFC] dark:bg-[#07111F] text-[#0B1F3A] dark:text-[#EAF2F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FC] dark:bg-[#163B59] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold border border-[#B9DDED] dark:border-[#263B50]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Authoritative BIS Repository & QCO Mandates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] dark:text-[#EAF2F8] tracking-tight">
              Indian Standards & <span className="text-[#0057A8] dark:text-[#16A9D8]">QCO Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
              Explore active Indian Standards (IS), mandatory Quality Control Orders (QCOs) notified by DPIIT/Ministries, and authoritative superseded standard mappings for public procurement drafting.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/procure"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0057A8] hover:bg-[#004783] text-white shadow-sm transition-all"
            >
              <Layers className="w-4 h-4" /> Match Tender BOQ
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "active"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Active Standards & QCOs ({standards.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("superseded")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "superseded"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-red-500" /> Superseded & Withdrawn Standards ({supersededList.length})
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-[#D8E3EE] dark:border-[#263B50] shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  activeTab === "active"
                    ? "Search active standards (e.g. IS 4984, IS 1786, IS 16221, solar, pipe, steel)..."
                    : "Search obsolete standards (e.g. IS 800:1984, IS 456:1978, IS 4984:1995)..."
                }
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1A2B] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#0057A8] hover:bg-[#004783] text-white rounded-xl shadow-sm transition-all"
            >
              Search
            </button>
          </form>

          {activeTab === "active" && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-blue-600" /> Division:
                </span>
                {divisions.map((div) => {
                  const isSel = (selectedDivision === "" && div === "All Divisions") || selectedDivision === div;
                  return (
                    <button
                      key={div}
                      type="button"
                      onClick={() => setSelectedDivision(div === "All Divisions" ? "" : div)}
                      className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                        isSel
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold"
                          : "bg-white dark:bg-[#0B1A2B] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {div}
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={mandatoryOnly}
                  onChange={(e) => setMandatoryOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Mandatory QCO Only</span>
              </label>
            </div>
          )}
        </div>

        {/* Content Display */}
        {isLoading ? (
          <LoadingState
            message="Retrieving Standards & QCO Schedules..."
            submessage="Filtering by active status, division classifications, and gazette notifications..."
          />
        ) : activeTab === "active" ? (
          standards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standards.map((std) => (
                <StandardCard
                  key={std.id || std.standardNumber}
                  standard={std}
                  onSelect={handleSelectStandard}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Indian Standards Found"
              description="Try broadening your search query or reset the division and mandatory QCO filters."
              icon={BookOpen}
              actionLabel="Reset Filters"
              onAction={() => {
                setQuery("");
                setSelectedDivision("");
                setMandatoryOnly(false);
              }}
            />
          )
        ) : (
          <div className="space-y-4">
            {filteredSuperseded.length > 0 ? (
              filteredSuperseded.map((mapping, idx) => (
                <SupersededAlertCard
                  key={idx}
                  mapping={mapping}
                  onSelectActive={(activeStd) => {
                    setQuery(activeStd);
                    setActiveTab("active");
                  }}
                />
              ))
            ) : (
              <EmptyState
                title="No Superseded Standards Found"
                description="No obsolete standard matches your search query."
                icon={AlertOctagon}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
