"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function FloatingAskAI() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Do not display the floating button if the user is already on the Ask AI chat workspace
  if (pathname === "/chat") {
    return null;
  }

  return (
    <div
      className="fixed z-[1000] right-4 bottom-[calc(16px+env(safe-area-inset-bottom,0px))] sm:right-6 sm:bottom-6 group print:hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop Tooltip */}
      <div
        role="tooltip"
        className={`hidden sm:block absolute bottom-full right-0 mb-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1"
        } bg-[#0B1F3A] text-white border border-[#263B50]/40 dark:bg-[#10243A] dark:text-[#EAF2F8] dark:border-[#263B50]`}
      >
        <span>{t("hero.ask_ai_tooltip", "Ask BIS Saarthi AI")}</span>
        {/* Subtle arrow pointer */}
        <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-[#0B1F3A] dark:border-t-[#10243A]" />
      </div>

      {/* Floating Ask AI Button */}
      <Link
        href="/chat"
        aria-label="Ask AI"
        className="inline-flex items-center gap-2 h-12 sm:h-13 px-4 sm:px-5 rounded-full bg-[#0057A8] hover:bg-[#004783] dark:bg-[#1268B3] dark:hover:bg-[#1679C7] text-white shadow-[0_8px_24px_rgba(0,87,168,0.25)] hover:shadow-[0_10px_28px_rgba(0,87,168,0.30)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9FCE] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07111F] cursor-pointer"
      >
        <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#0E9FCE] dark:text-[#16A9D8] shrink-0 transition-transform duration-200 group-hover:rotate-12" />
        <span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">
          {t("nav.ask_ai", "Ask AI")}
        </span>
      </Link>
    </div>
  );
}
