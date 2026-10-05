import React from 'react';
import { StandardRecommendation } from '@bis/shared-types';
import { ShieldCheck, AlertTriangle, FileText, ArrowRight, BookOpen } from 'lucide-react';

interface ProcurementCardProps {
  recommendation: StandardRecommendation;
  onViewDetails?: (standardNumber: string) => void;
  onViewPDI?: (standardNumber: string) => void;
}

export const ProcurementCard: React.FC<ProcurementCardProps> = ({
  recommendation,
  onViewDetails,
  onViewPDI
}) => {
  const { primaryStandard, normativeStandards, qcoMandate, isSuperseded, activeStandardReplacement, confidenceScore } = recommendation;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-base font-bold text-navy-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900/50">
              {primaryStandard.standardNumber}
            </span>
            {qcoMandate?.isMandatory && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mandatory QCO
              </span>
            )}
            {isSuperseded && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                Superseded Standard
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-2 line-clamp-1">
            {primaryStandard.title}
          </h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Relevance</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{confidenceScore}%</div>
        </div>
      </div>

      {/* Scope Excerpt */}
      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
        {primaryStandard.scope}
      </p>

      {/* Superseded Warning Banner if applicable */}
      {isSuperseded && activeStandardReplacement && (
        <div className="mb-3 p-3 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-lg text-xs text-red-800 dark:text-red-200">
          <div className="font-semibold flex items-center gap-1.5 mb-1 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            Obsolete in Tenders: Upgrade to {activeStandardReplacement.standardNumber}
          </div>
          <p className="text-slate-600 dark:text-slate-300">{activeStandardReplacement.revisionSummary}</p>
        </div>
      )}

      {/* Normative References */}
      {normativeStandards && normativeStandards.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Normative Reference Standards
          </div>
          <div className="flex flex-wrap gap-1.5">
            {normativeStandards.map((norm, idx) => (
              <span
                key={idx}
                className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                title={`${norm.title} (${norm.relationshipType})`}
              >
                {norm.standardNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="text-slate-500 dark:text-slate-400">
          Division: <span className="font-medium text-slate-700 dark:text-slate-300">{primaryStandard.division}</span>
        </div>
        <div className="flex items-center gap-2">
          {onViewPDI && (
            <button
              onClick={() => onViewPDI(primaryStandard.standardNumber)}
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <FileText className="w-3.5 h-3.5" /> PDI Schedule
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(primaryStandard.standardNumber)}
              className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-navy-900 font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
