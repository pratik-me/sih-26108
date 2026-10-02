'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Laboratory } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { LaboratoryCard, LoadingState, EmptyState } from '@bis/ui';
import { Building2, Search, MapPin, Filter, CheckCircle2 } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";

function LaboratoriesFinderContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const stdParam = searchParams.get('std') || '';

  const [filterStd, setFilterStd] = useState(stdParam);
  const [filterState, setFilterState] = useState('');
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    'All States',
    'Maharashtra',
    'Delhi',
    'Uttar Pradesh',
    'Karnataka',
    'Haryana',
    'Tamil Nadu',
    'Gujarat'
  ];

  const fetchLaboratories = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.searchLaboratories({
        standardNumber: filterStd || undefined,
        state: filterState === 'All States' ? undefined : filterState
      });
      setLaboratories(res.laboratories);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratories();
  }, [filterState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLaboratories();
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
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#10243A] text-[#0057A8] dark:text-[#16A9D8] text-xs font-semibold border border-[#D8E3EE] dark:border-[#263B50] shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" />
            <span>{t("labs.badge", "Accredited Testing Infrastructure")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] dark:text-[#EAF2F8] tracking-tight">
            {t("labs.title", "Find a BIS Recognized Laboratory")}
          </h1>
          <p className="text-sm sm:text-base text-[#52657A] dark:text-[#AFC1D2] max-w-2xl leading-relaxed">
            {t("labs.subtitle", "Search NABL (ISO/IEC 17025) accredited and BIS Recognized Testing Laboratories across Indian states and cities with valid testing scopes.")}
          </p>
        </div>

        {/* Search & State Filter */}
        <div className="bg-white dark:bg-[#10243A] p-5 rounded-2xl border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.30)] space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7A8CA0] dark:text-[#7F91A5] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={filterStd}
                onChange={e => setFilterStd(e.target.value)}
                placeholder={t("labs.search_placeholder", "Search by Indian Standard (e.g. IS 17526, IS 14543, IS 16046, IS 1786)...")}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D8E3EE] dark:border-[#263B50] bg-white dark:bg-[#0B1A2B] text-[#263B53] dark:text-[#EAF2F8] placeholder:text-[#7A8CA0] dark:placeholder:text-[#7A8CA0] focus:outline-none focus:border-[#0E9FCE] focus:ring-2 focus:ring-[#0E9FCE]/12"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#0057A8] hover:bg-[#004783] dark:bg-[#1268B3] dark:hover:bg-[#1679C7] text-white rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {t("labs.btn_filter", "Filter Labs")}
            </button>
          </form>

          {/* State Selection Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#D8E3EE] dark:border-[#263B50] text-xs">
            <span className="font-semibold text-[#7A8CA0] dark:text-[#A8B6C7] mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0057A8] dark:text-[#16A9D8]" /> {t("labs.filter_state", "State")}:
            </span>
            {states.map(st => {
              const isSel = (filterState === '' && st === 'All States') || filterState === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterState(st === 'All States' ? '' : st)}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    isSel
                      ? 'bg-[#EAF4FB] dark:bg-[#163B59] text-[#0057A8] dark:text-[#16A9D8] border border-[#B9DDED] dark:border-[#16A9D8] font-bold shadow-2xs'
                      : 'bg-white dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#A8B6C7] border border-[#D8E3EE] dark:border-[#263B50] hover:bg-[#F1F7FC] hover:text-[#0057A8] hover:border-[#B9DDED] dark:hover:bg-[#153653] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  {st === 'All States'
                    ? t("labs.filter_allstates", "All States")
                    : st === 'Maharashtra'
                    ? t("labs.state_maharashtra", "Maharashtra")
                    : st === 'Delhi'
                    ? t("labs.state_delhi", "Delhi")
                    : st === 'Uttar Pradesh'
                    ? t("labs.state_uttar_pradesh", "Uttar Pradesh")
                    : st === 'Karnataka'
                    ? t("labs.state_karnataka", "Karnataka")
                    : st === 'Haryana'
                    ? t("labs.state_haryana", "Haryana")
                    : st === 'Tamil Nadu'
                    ? t("labs.state_tamil_nadu", "Tamil Nadu")
                    : st === 'Gujarat'
                    ? t("labs.state_gujarat", "Gujarat")
                    : st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Laboratories Grid */}
        {isLoading ? (
          <LoadingState
            message="Locating Recognized Testing Laboratories..."
            submessage="Matching accredited testing parameters and laboratory validity schedules..."
          />
        ) : laboratories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laboratories.map((lab, idx) => (
              <LaboratoryCard key={lab.id || idx} laboratory={lab} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Laboratories Found"
            description="Try removing the standard filter or choosing 'All States' to view national reference laboratories."
            icon={Building2}
            actionLabel="View All Laboratories"
            onAction={() => {
              setFilterStd('');
              setFilterState('');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function LaboratoriesFinderPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Laboratories...</div>}>
      <LaboratoriesFinderContent />
    </React.Suspense>
  );
}

