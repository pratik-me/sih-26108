import React from 'react';
import { PDISchedule, PDITestItem } from '@bis/shared-types';
import { ClipboardCheck, CheckCircle2, Shield, Eye, Flame } from 'lucide-react';

interface PDIScheduleCardProps {
  schedule: PDISchedule;
}

export const PDIScheduleCard: React.FC<PDIScheduleCardProps> = ({ schedule }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
              {schedule.standardNumber}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pre-Dispatch Inspection (PDI) Schedule
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {schedule.productName}
          </h3>
        </div>

        <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono">
          Sampling Standard: <span className="font-bold text-navy-900 dark:text-blue-400">{schedule.samplingStandard}</span>
        </div>
      </div>

      {/* Lot Inspection Criteria & Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Lot Formation & Criteria
          </div>
          <p className="text-slate-600 dark:text-slate-300">{schedule.lotInspectionCriteria}</p>

          {schedule.recommendedTPIAs && schedule.recommendedTPIAs.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Empanelled TPIAs: </span>
              <span className="text-slate-600 dark:text-slate-400">{schedule.recommendedTPIAs.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" /> Pre-Dispatch Stage Checklist
          </div>
          <ul className="space-y-1">
            {schedule.preDispatchChecklist.slice(0, 4).map((check, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Test Items Table */}
      <div>
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
          Mandatory Acceptance & Routine Test Parameters
        </div>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="p-2.5">Parameter</th>
                <th className="p-2.5">Clause / Method</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Sampling Plan</th>
                <th className="p-2.5">Acceptance Criteria</th>
                <th className="p-2.5">Witness Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedule.testItems.map((item: PDITestItem, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-1.5">
                      {item.isDestructive ? (
                        <span title="Destructive Test"><Flame className="w-3.5 h-3.5 text-red-500" /></span>
                      ) : (
                        <span title="Non-Destructive Test"><Eye className="w-3.5 h-3.5 text-blue-500" /></span>
                      )}
                      {item.parameter}
                    </div>
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {item.standardClause}
                  </td>
                  <td className="p-2.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.testType === 'ROUTINE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'}`}>
                      {item.testType}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">
                    {item.samplingPlan}
                  </td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300 font-medium">
                    {item.acceptanceCriteria}
                  </td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.witnessAgency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
