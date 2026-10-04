import React from 'react';
import { GfrAuditResult, GFRViolationClause } from '@bis/shared-types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Check, Copy } from 'lucide-react';

interface GfrAuditBadgeProps {
  auditResult: GfrAuditResult;
  onCopyClause?: (text: string) => void;
}

export const GfrAuditBadge: React.FC<GfrAuditBadgeProps> = ({
  auditResult,
  onCopyClause
}) => {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    if (onCopyClause) onCopyClause(text);
  };

  const { overallComplianceScore, isGfrCompliant, violatingClauses, gfrRuleReference, summary } = auditResult;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isGfrCompliant
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isGfrCompliant ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                GFR 2017 Rule 144(i) Compliance Audit
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isGfrCompliant
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300'
                }`}
              >
                {isGfrCompliant ? 'Compliant' : `${violatingClauses.length} Biases Detected`}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              {gfrRuleReference}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Fairness Score
            </div>
            <div className={`text-xl font-extrabold ${overallComplianceScore >= 80 ? 'text-emerald-600' : overallComplianceScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {overallComplianceScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-600 dark:text-slate-300 my-3">
        {summary}
      </p>

      {/* Violations & Neutral Substitutes */}
      {violatingClauses && violatingClauses.length > 0 && (
        <div className="space-y-3 mt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Discriminatory Clauses & Suggested Neutral Replacements
          </div>

          {violatingClauses.map((v: GFRViolationClause, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  {v.biasType.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                  Severity: {v.severity}
                </span>
              </div>

              <div className="text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-red-600 dark:text-red-400">Flagged Clause: </span>
                <span className="font-mono text-[11px] bg-red-100/60 dark:bg-red-950/60 px-1 py-0.5 rounded">
                  "{v.originalText}"
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 italic">
                {v.explanation}
              </p>

              {/* Neutral Suggestion */}
              <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> GFR Compliant Neutral Replacement Clause:
                  </span>
                  <button
                    onClick={() => handleCopy(v.suggestedNeutralClause, idx)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold px-2 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedIdx === idx ? 'Copied' : 'Copy Clause'}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {v.suggestedNeutralClause}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
