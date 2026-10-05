"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0B1F3A] text-[#B8C7D6] text-xs border-t border-[#163358] dark:border-[#263B50] shadow-[0_-4px_20px_rgba(11,31,58,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-sm">
              <Image
                src={"/BIS-LOGO.png"}
                alt="BIS-LOGO"
                height={26}
                width={26}
                unoptimized
              />
              <span>Manak Setu AI</span>
            </div>
            <p className="text-xs text-[#B8C7D6] leading-relaxed">
              AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Public Procurement Specifications & GFR 144(i) Compliance (SIH 26108).
            </p>
            <div className="flex items-center gap-1.5 text-[#0E9FCE] font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                Empowering GeM Buyers, PSUs & Tender Drafting Committees
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Official Procurement Portals
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://gem.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D9E8F5] hover:text-[#0E9FCE] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Government e-Marketplace (GeM)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://eprocure.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D9E8F5] hover:text-[#0E9FCE] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Central Public Procurement (CPPP)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D9E8F5] hover:text-[#0E9FCE] inline-flex items-center gap-1 transition-colors"
                >
                  <span>e-BIS Portal (Standards)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://nabl-india.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D9E8F5] hover:text-[#0E9FCE] inline-flex items-center gap-1 transition-colors"
                >
                  <span>NABL Testing Lab Directory</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Core Procurement Modules
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/procure" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
                  Tender & BOQ Analyzer
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
                  GFR 144(i) Bias Auditor
                </Link>
              </li>
              <li>
                <Link href="/standards" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
                  Standards & QCO Directory
                </Link>
              </li>
              <li>
                <Link href="/testing" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
                  PDI Inspection Schedules
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
                  Compliance Dossiers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Statutory & Governance
            </h4>
            <p className="text-[11px] text-[#B8C7D6] leading-relaxed">
              Synthesized strictly per General Financial Rules (GFR 2017 Rule 144(i)), Bureau of Indian Standards Act 2016, and DPIIT Quality Control Orders (QCOs).
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-[11px] text-[#0E9FCE] font-semibold hover:underline"
              >
                Admin & Evaluation Console →
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#163358] dark:border-[#263B50] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#B8C7D6]">
          <div>
            © {new Date().getFullYear()} Manak Setu AI
          </div>
          <div className="flex items-center gap-4">
            <Link href="/chat" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
              3-Panel AI Workspace
            </Link>
            <span>•</span>
            <Link href="/procure" className="text-[#D9E8F5] hover:text-[#0E9FCE] transition-colors">
              Live BOQ Analyzer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
