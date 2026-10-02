import React from 'react';
import { Standard } from '@bis/shared-types';
import { BookOpen, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { SourceFreshnessBadge } from './SourceFreshnessBadge';

interface StandardCardProps {
  standard: Standard;
  onSelect?: (standard: Standard) => void;
  className?: string;
}

export const StandardCard: React.FC<StandardCardProps> = ({ standard, onSelect, className = '' }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(standard)}
      className={`p-5 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] hover:shadow-[0_8px_24px_rgba(11,31,58,0.10)] hover:border-[#B9DDED] dark:hover:border-[#16A9D8] dark:hover:bg-[#153653] transition-all cursor-pointer flex flex-col justify-between group ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#EAF6FC] dark:bg-[#0B1A2B] text-[#0057A8] dark:text-[#16A9D8]">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-[#0B1F3A] dark:text-[#EAF2F8] group-hover:text-[#0057A8] dark:group-hover:text-[#16A9D8] transition-colors">
              {standard.standardNumber}
            </h3>
          </div>
          <SourceFreshnessBadge status={standard.status} year={standard.year} />
        </div>

        <h4 className="text-sm font-semibold text-[#263B53] dark:text-[#EAF2F8] mb-2 line-clamp-1">
          {standard.title}
        </h4>

        <p className="text-xs text-[#52657A] dark:text-[#AFC1D2] line-clamp-2 mb-3 leading-relaxed">
          {standard.scope || standard.abstract}
        </p>

        {/* Division & Mandatory Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#F1F7FC] dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50]">
            {standard.division}
          </span>
          {standard.isMandatory ? (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
              <Award className="w-3 h-3 text-[#C58A16] dark:text-amber-400" /> Mandatory QCO
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-[#22C55E] dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-[#16845B] dark:text-[#22C55E]" /> Voluntary Scheme
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-[#D8E3EE] dark:border-[#263B50] flex items-center justify-between text-xs text-[#7A8CA0] dark:text-[#8299AD]">
        <span>Published: {standard.publicationDate || standard.year}</span>
        <a
          href={standard.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[#0057A8] dark:text-[#16A9D8] hover:text-[#004783] dark:hover:underline font-semibold"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
