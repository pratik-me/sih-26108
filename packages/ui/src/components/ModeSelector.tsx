import React from 'react';
import { UserRole } from '@bis/shared-types';
import {
  FileCheck2,
  Layers,
  FlaskConical,
  ShieldCheck,
  Check,
  LucideIcon
} from 'lucide-react';

export interface ModeOption {
  id: UserRole;
  label: string;
  badge?: string;
  desc?: string;
  icon: LucideIcon;
}

interface ModeSelectorProps {
  currentMode: UserRole;
  onModeChange: (mode: UserRole) => void;
  modes?: ModeOption[];
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  modes,
  className = ''
}) => {
  const defaultModes: ModeOption[] = [
    {
      id: UserRole.PROCUREMENT_OFFICER,
      label: 'Procurement Officer',
      badge: 'Tenders & Specs',
      desc: 'Identify active IS, enforce QCO, audit GFR 144(i) bias',
      icon: FileCheck2,
    },
    {
      id: UserRole.BUYER_GEM,
      label: 'GeM Buyer',
      badge: 'GeM Compliance',
      desc: 'Verify CRS R-numbers, ISI CM/L, & copy specs',
      icon: Layers,
    },
    {
      id: UserRole.QA_ENGINEER,
      label: 'QA / Inspection',
      badge: 'PDI & Testing',
      desc: 'IS 2500 sampling tables & lot acceptance tests',
      icon: FlaskConical,
    },
    {
      id: UserRole.BIDDER_SUPPLIER,
      label: 'Bidder / Supplier',
      badge: 'Bidding & Rights',
      desc: 'Check eligibility & challenge restrictive specs',
      icon: ShieldCheck,
    },
  ];

  const activeModes = modes || defaultModes;

  const gridColsClass =
    activeModes.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : activeModes.length === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${gridColsClass} gap-3.5 ${className}`}>
      {activeModes.map(m => {
        const isSelected = currentMode === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            type="button"
            suppressHydrationWarning
            onClick={() => onModeChange(m.id)}
            className={`group relative p-4 rounded-2xl text-left transition-all duration-200 ease-out overflow-hidden cursor-pointer ${
              isSelected
                ? 'bg-[#F0F8FD] dark:bg-[#102E47] border-2 border-[#0057A8] dark:border-[#16A9D8] shadow-[0_8px_24px_rgba(0,87,168,0.12)] dark:shadow-[0_0_15px_rgba(22,169,216,0.15)] -translate-y-0.5'
                : 'bg-[#FFFFFF] dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.20)] hover:border-[#B9DDED] dark:hover:border-[#16A9D8] hover:shadow-[0_8px_24px_rgba(11,31,58,0.10)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.30)] hover:-translate-y-0.5'
            }`}
          >
            {/* Header: Icon & Status indicator */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#0057A8] text-white dark:bg-[#1268B3] dark:text-white shadow-xs'
                    : 'bg-[#EAF6FC] text-[#0057A8] dark:bg-[#153653] dark:text-[#16A9D8] group-hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4 transition-transform duration-200" />
              </span>

              {/* Status indicator / pill */}
              <div className="shrink-0">
                {isSelected ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0057A8] text-white border border-[#0057A8] dark:bg-[#1268B3] dark:border-[#1583D1] shadow-2xs whitespace-nowrap"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center whitespace-nowrap text-[11px] font-semibold text-[#7A8CA0] dark:text-[#8299AD] group-hover:text-[#0057A8] dark:group-hover:text-[#16A9D8] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                    Switch &rarr;
                  </span>
                )}
              </div>
            </div>

            {/* Title - Full Width */}
            <h4
              className={`text-sm font-bold mb-1.5 transition-colors duration-200 ${
                isSelected
                  ? 'text-[#0B1F3A] dark:text-[#F1F5F9]'
                  : 'text-[#0B1F3A] dark:text-[#F1F5F9] group-hover:text-[#0057A8] dark:group-hover:text-[#16A9D8]'
              }`}
            >
              {m.label}
            </h4>

            {m.desc && (
              <p className="text-xs text-[#52657A] dark:text-[#AFC1D2] line-clamp-2 leading-relaxed">
                {m.desc}
              </p>
            )}

            {/* Subtle role badge tag */}
            {m.badge && (
              <div className="mt-2.5 pt-2 border-t border-[#D8E3EE] dark:border-[#263B50] flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8CA0] dark:text-[#8299AD]">
                  {m.badge}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#0057A8] dark:bg-[#16A9D8] scale-125'
                      : 'bg-[#D8E3EE] dark:bg-[#263B50] group-hover:bg-[#0057A8] dark:group-hover:bg-[#16A9D8]'
                  }`}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
