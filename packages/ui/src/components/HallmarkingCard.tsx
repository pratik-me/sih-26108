import React from 'react';
import { PurityFineness } from '@bis/shared-types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface HallmarkingCardProps {
  purity: PurityFineness;
  className?: string;
}

export const HallmarkingCard: React.FC<HallmarkingCardProps> = ({ purity, className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] hover:shadow-[0_8px_24px_rgba(11,31,58,0.10)] space-y-3.5 hover:border-[#B9DDED] dark:hover:border-[#16A9D8] transition-all ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-[#0B1A2B] text-[#C58A16] dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0B1F3A] dark:text-[#EAF2F8]">
              {purity.karatDisplay} ({purity.finenessNumber} Fineness)
            </h3>
            <span className="text-xs text-[#7A8CA0] dark:text-[#8299AD] font-mono">Standard: {purity.officialStandard}</span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50">
          {purity.metal}
        </span>
      </div>

      <p className="text-xs text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
        {purity.description}
      </p>

      <div className="p-3.5 rounded-xl bg-[#F1F7FC] dark:bg-[#0B1A2B] border border-[#D8E3EE] dark:border-[#263B50] space-y-2 text-xs">
        <h4 className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" /> Mandatory Hallmarks on Article:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {purity.mandatoryMarkings.map((m, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-[#153653] border border-[#D8E3EE] dark:border-[#263B50] text-center shadow-2xs">
              <span className="text-[11px] font-bold text-[#0057A8] dark:text-[#16A9D8] block">{m.name}</span>
              <span className="text-[10px] text-[#52657A] dark:text-[#A8B6C7]">{m.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
