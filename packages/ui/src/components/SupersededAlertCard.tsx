import React from 'react';
import { SupersededStandardMapping } from '@bis/shared-types';
import { AlertOctagon, ArrowRight, CheckCircle, FileText, Info } from 'lucide-react';

interface SupersededAlertCardProps {
  mapping: SupersededStandardMapping;
  onSelectActive?: (activeStandard: string) => void;
}

export const SupersededAlertCard: React.FC<SupersededAlertCardProps> = ({
  mapping,
  onSelectActive
}) => {
  return (
    <div className="bg-gradient-to-r from-red-50/90 via-amber-50/40 to-emerald-50/50 dark:from-red-950/40 dark:via-amber-950/20 dark:to-emerald-950/30 border border-red-200/80 dark:border-red-900/50 rounded-xl p-5 shadow-sm">
      {/* Title Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-red-200/60 dark:border-red-900/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold line-through text-red-600 dark:text-red-400">
                {mapping.obsoleteStandard}
              </span>
              <span className="text-xs bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded font-semibold">
                WITHDRAWN ({mapping.yearWithdrawn})
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                {mapping.activeStandard}
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {mapping.title}
            </h4>
          </div>
        </div>

        {onSelectActive && (
          <button
            onClick={() => onSelectActive(mapping.activeStandard)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-sm"
          >
            Use Active Standard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Key Technical Upgrades */}
      <div className="mt-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Key Technical Changes & Revision Summary
        </div>
        <ul className="space-y-1.5">
          {mapping.keyChanges.map((change, idx) => (
            <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transition Guidance */}
      <div className="mt-3.5 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
        <span className="font-semibold text-navy-900 dark:text-blue-400">Tender Drafter Guidance: </span>
        {mapping.transitionGuidance}
      </div>
    </div>
  );
};
