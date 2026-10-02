import React from 'react';
import { TestingRequirement } from '@bis/shared-types';
import { FlaskConical, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TestingRequirementCardProps {
  test: TestingRequirement;
  className?: string;
}

export const TestingRequirementCard: React.FC<TestingRequirementCardProps> = ({ test, className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] hover:shadow-[0_8px_24px_rgba(11,31,58,0.10)] space-y-3.5 hover:border-[#B9DDED] dark:hover:border-[#16A9D8] transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-[#EAF6FC] dark:bg-[#0B1A2B] text-[#0057A8] dark:text-[#16A9D8] mt-0.5">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A] dark:text-[#EAF2F8]">
              {test.testName}
            </h3>
            <span className="text-xs font-mono font-medium text-[#0057A8] dark:text-[#16A9D8]">
              {test.standardNumber} — Clause {test.clauseNumber}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {test.isMandatoryRoutineTest ? (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-[#22C55E] dark:border-emerald-800">
              Mandatory Routine Test
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#F1F7FC] dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50]">
              Type / Approval Test
            </span>
          )}
          {test.isDestructive && (
            <span className="text-[10px] text-[#C58A16] dark:text-amber-400 font-semibold">Destructive Testing</span>
          )}
        </div>
      </div>

      <p className="text-xs text-[#52657A] dark:text-[#AFC1D2] leading-relaxed">
        {test.description}
      </p>

      {/* Criteria & Sampling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
        <div className="p-3.5 rounded-xl bg-[#F1F7FC] dark:bg-[#0B1A2B] border border-[#D8E3EE] dark:border-[#263B50]">
          <span className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8] flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B] dark:text-[#22C55E]" /> Acceptance Criteria:
          </span>
          <p className="text-[#52657A] dark:text-[#AFC1D2]">{test.acceptanceCriteria}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F0F8FD] dark:bg-[#0B1A2B] border border-[#B9DDED] dark:border-[#263B50]">
          <span className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8] flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8]" /> Sampling & Frequency:
          </span>
          <p className="text-[#52657A] dark:text-[#AFC1D2]">
            {test.samplingRequirements} ({test.testingFrequency})
          </p>
        </div>
      </div>

      {/* Required Equipment */}
      {test.requiredEquipment.length > 0 && (
        <div className="pt-2 border-t border-[#D8E3EE] dark:border-[#263B50] text-xs text-[#7A8CA0] dark:text-[#8299AD]">
          <span className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8]">Key Test Equipment: </span>
          <span>{test.requiredEquipment.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
