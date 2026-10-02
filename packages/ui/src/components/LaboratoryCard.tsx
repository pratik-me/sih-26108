import React from 'react';
import { Laboratory } from '@bis/shared-types';
import { Building2, MapPin, Mail, Phone, CheckCircle2, ShieldAlert, ExternalLink } from 'lucide-react';

interface LaboratoryCardProps {
  laboratory: Laboratory;
  className?: string;
}

export const LaboratoryCard: React.FC<LaboratoryCardProps> = ({ laboratory, className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-[#10243A] border border-[#D8E3EE] dark:border-[#263B50] shadow-[0_4px_16px_rgba(11,31,58,0.06)] hover:shadow-[0_8px_24px_rgba(11,31,58,0.10)] space-y-4 hover:border-[#B9DDED] dark:hover:border-[#16A9D8] transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#EAF6FC] dark:bg-[#0B1A2B] text-[#0057A8] dark:text-[#16A9D8] mt-0.5">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A] dark:text-[#EAF2F8]">
              {laboratory.name}
            </h3>
            <p className="text-xs text-[#7A8CA0] dark:text-[#8299AD]">
              Lab Code: <span className="font-mono font-semibold text-[#52657A] dark:text-[#AFC1D2]">{laboratory.labCode}</span>
            </p>
          </div>
        </div>

        {laboratory.recognitionStatus === 'RECOGNIZED' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-[#22C55E] dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B] dark:text-[#22C55E]" /> BIS Recognized
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <ShieldAlert className="w-3.5 h-3.5 text-[#C58A16] dark:text-amber-400" /> {laboratory.recognitionStatus}
          </span>
        )}
      </div>

      {/* Address & Contact */}
      <div className="space-y-1.5 text-xs text-[#52657A] dark:text-[#AFC1D2]">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#7A8CA0] dark:text-[#7F91A5] mt-0.5 shrink-0" />
          <span>{laboratory.address}, {laboratory.city}, {laboratory.state} - {laboratory.pincode}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          {laboratory.contactEmail && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#7A8CA0] dark:text-[#7F91A5]" />
              <a href={`mailto:${laboratory.contactEmail}`} className="hover:text-[#0057A8] dark:hover:text-[#16A9D8] transition-colors">
                {laboratory.contactEmail}
              </a>
            </div>
          )}
          {laboratory.contactPhone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#7A8CA0] dark:text-[#7F91A5]" />
              <a href={`tel:${laboratory.contactPhone}`} className="hover:text-[#0057A8] dark:hover:text-[#16A9D8] transition-colors">
                {laboratory.contactPhone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Recognized Standards & Capabilities */}
      <div className="space-y-2 pt-2 border-t border-[#D8E3EE] dark:border-[#263B50] text-xs">
        <div>
          <span className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8]">Recognized for Indian Standards: </span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {laboratory.recognizedStandards.map((std, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-[#EAF6FC] dark:bg-[#0B1A2B] text-[#0057A8] dark:text-[#16A9D8] border border-[#B9DDED] dark:border-[#263B50] font-mono font-medium text-[11px]"
              >
                {std}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-semibold text-[#0B1F3A] dark:text-[#EAF2F8]">Testing Capabilities: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {laboratory.testingCapabilities.map((cap, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-[#F1F7FC] dark:bg-[#0B1A2B] text-[#52657A] dark:text-[#AFC1D2] border border-[#D8E3EE] dark:border-[#263B50] text-[11px]"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 flex items-center justify-between text-xs text-[#7A8CA0] dark:text-[#8299AD] border-t border-[#D8E3EE] dark:border-[#263B50]">
        <span>Accreditation: {laboratory.accreditationBody} (Valid up to {laboratory.validUpTo})</span>
        <a
          href={laboratory.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#0057A8] dark:text-[#16A9D8] hover:text-[#004783] dark:hover:underline font-semibold"
        >
          <span>Official RSL Scope</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
