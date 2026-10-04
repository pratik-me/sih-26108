import React from 'react';
import { ComplianceRoadmapStep } from '@bis/shared-types';
import { CheckCircle2, Clock, CircleDot, FileCheck } from 'lucide-react';

interface ComplianceStepProps {
  step: ComplianceRoadmapStep;
  isCurrent?: boolean;
  onSelect?: (step: ComplianceRoadmapStep) => void;
  className?: string;
}

export const ComplianceStep: React.FC<ComplianceStepProps> = ({
  step,
  isCurrent = false,
  onSelect,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-[#16845B] dark:text-[#22C55E]" />;
      case 'IN_PROGRESS':
        return <CircleDot className="w-5 h-5 text-[#0057A8] dark:text-[#16A9D8] animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-[#7A8CA0] dark:text-[#8299AD]" />;
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(step)}
      className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
        isCurrent
          ? 'bg-[#F0F8FD] dark:bg-[#163B59]/40 border-2 border-[#0057A8] dark:border-[#16A9D8] shadow-[0_8px_24px_rgba(0,87,168,0.12)]'
          : 'bg-white dark:bg-[#10243A] border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] hover:border-[#B9DDED] dark:hover:border-[#16A9D8]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getStatusIcon()}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0057A8] dark:text-[#16A9D8] uppercase tracking-wider">
                Step {step.stepNumber}: {step.phaseName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F7FC] dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50]">
                Est. {step.estimatedTimeframe}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0B1F3A] dark:text-[#EAF2F8] mt-0.5">
              {step.title}
            </h3>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F1F7FC] dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50]">
          {step.category}
        </span>
      </div>

      <p className="text-xs text-[#52657A] dark:text-[#AFC1D2] mt-2.5 leading-relaxed">
        {step.description}
      </p>

      {/* Action items */}
      {step.actionItems && step.actionItems.length > 0 && (
        <div className={`mt-3 p-3.5 rounded-xl border text-xs ${
          isCurrent
            ? 'bg-white/90 dark:bg-[#0B1A2B]/80 border-[#B9DDED] dark:border-[#263B50]'
            : 'bg-[#F1F7FC] dark:bg-[#0B1A2B] border-[#D8E3EE] dark:border-[#263B50]'
        }`}>
          <h4 className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8] mb-1.5 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" /> Key Action Items:
          </h4>
          <ul className="space-y-1 text-[#52657A] dark:text-[#AFC1D2]">
            {step.actionItems.map((action, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#0057A8] dark:text-[#16A9D8] font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Documents */}
      {step.requiredDocuments && step.requiredDocuments.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#7A8CA0] dark:text-[#8299AD]">
          <span className="font-semibold text-[#263B53] dark:text-[#EAF2F8]">Required Docs:</span>
          {step.requiredDocuments.map((doc, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-[#F1F7FC] dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50]">
              {doc}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
