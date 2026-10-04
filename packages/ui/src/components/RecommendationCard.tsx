import React from 'react';
import { StandardRecommendationMatch } from '@bis/shared-types';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SourceFreshnessBadge } from './SourceFreshnessBadge';

interface RecommendationCardProps {
  match: StandardRecommendationMatch;
  onSelect?: (match: StandardRecommendationMatch) => void;
  onViewTesting?: (standardNumber: string) => void;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  match,
  onSelect,
  onViewTesting,
  className = ''
}) => {
  const { standard, relevanceScore, matchReason, matchingAttributes, missingInformationPrompt } = match;

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] hover:shadow-[0_8px_24px_rgba(11,31,58,0.10)] space-y-4 hover:border-[#B9DDED] dark:hover:border-[#16A9D8] transition-all ${className}`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4FB] text-[#0057A8] dark:bg-[#0B1A2B] dark:text-[#16A9D8] border border-[#B9DDED] dark:border-[#263B50]">
              {relevanceScore}% Match Score
            </span>
            <SourceFreshnessBadge status={standard.status} />
          </div>
          <h3 className="text-base font-bold text-[#0B1F3A] dark:text-[#EAF2F8]">
            {standard.standardNumber} — {standard.title}
          </h3>
        </div>
      </div>

      {/* Match Reason */}
      <div className="p-3.5 rounded-xl bg-[#F0F8FD] dark:bg-[#0B1A2B] border border-[#B9DDED] dark:border-[#263B50] text-xs text-[#263B53] dark:text-[#AFC1D2]">
        <span className="font-semibold text-[#0057A8] dark:text-[#EAF2F8]">Why this standard matches: </span>
        {matchReason}
      </div>

      {/* Matching Attributes & Missing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {matchingAttributes.length > 0 && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F1F7FC] dark:bg-[#0B1A2B] border border-[#D8E3EE] dark:border-[#263B50]">
            <h4 className="font-semibold text-[#16845B] dark:text-[#22C55E] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B] dark:text-[#22C55E]" /> Matching Product Criteria:
            </h4>
            <ul className="space-y-1 text-[#52657A] dark:text-[#AFC1D2]">
              {matchingAttributes.map((attr, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]" />
                  <span>{attr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {missingInformationPrompt.length > 0 && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30">
            <h4 className="font-semibold text-[#C58A16] dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#C58A16]" /> Additional Details Needed:
            </h4>
            <ul className="space-y-1 text-[#52657A] dark:text-[#AFC1D2]">
              {missingInformationPrompt.map((prompt, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C58A16]" />
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#D8E3EE] dark:border-[#263B50]">
        <div className="flex items-center gap-2">
          {standard.isMandatory && (
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C58A16]" /> Mandatory Certification Required
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onViewTesting && (
            <button
              type="button"
              onClick={() => onViewTesting(standard.standardNumber)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#263B53] dark:text-[#AFC1D2] bg-white dark:bg-[#0B1A2B] hover:bg-[#F1F7FC] dark:hover:bg-[#153653] dark:hover:text-[#F1F5F9] border border-[#D8E3EE] dark:border-[#263B50] transition-colors cursor-pointer"
            >
              Testing Clauses
            </button>
          )}
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(match)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#0057A8] dark:bg-[#1268B3] text-white hover:bg-[#004783] dark:hover:bg-[#1583D1] shadow-sm transition-colors cursor-pointer"
            >
              <span>View Compliance Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
