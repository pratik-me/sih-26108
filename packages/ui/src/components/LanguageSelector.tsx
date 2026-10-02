"use client";

import React, { useState, useRef, useEffect } from "react";
import { IndianLanguage } from "@bis/shared-types";
import { Globe, Check, ChevronDown, Search } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: IndianLanguage;
  onLanguageChange: (lang: IndianLanguage) => void;
  onDashboard?: boolean;
  className?: string;
  searchPlaceholder?: string;
  noLanguageFound?: string;
}

export const INDIAN_LANGUAGES_LIST = [
  { code: IndianLanguage.EN,  label: "English",  nativeName: "English"  },
  { code: IndianLanguage.HI,  label: "हिन्दी",    nativeName: "हिन्दी"    },
  { code: IndianLanguage.BN,  label: "বাংলা",     nativeName: "বাংলা"     },
  { code: IndianLanguage.TA,  label: "தமிழ்",     nativeName: "தமிழ்"     },
  { code: IndianLanguage.KN,  label: "ಕನ್ನಡ",     nativeName: "ಕನ್ನಡ"     },
  { code: IndianLanguage.UR,  label: "اردو",      nativeName: "اردو"      },
  { code: IndianLanguage.MR,  label: "मराठी",    nativeName: "मराठी"    },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = "",
  searchPlaceholder = "Search language...",
  noLanguageFound = "No language found",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeItem =
    INDIAN_LANGUAGES_LIST.find((l) => l.code === selectedLanguage) ||
    INDIAN_LANGUAGES_LIST[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchFilter("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchFilter("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredLanguages = INDIAN_LANGUAGES_LIST.filter(
    (lang) =>
      lang.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const handleSelect = (code: IndianLanguage) => {
    onLanguageChange(code);
    setIsOpen(false);
    setSearchFilter("");
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
      suppressHydrationWarning
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#263B53] dark:text-[#EAF2F8] hover:text-[#0057A8] dark:hover:text-[#16A9D8] bg-[#FFFFFF] dark:bg-[#10243A] hover:bg-[#F1F7FC] dark:hover:bg-[#172F47] transition-all border border-[#D8E3EE] dark:border-[#263B50] shadow-2xs cursor-pointer"
      >
        <Globe className={`w-3.5 h-3.5 transition-colors shrink-0 ${
          isOpen ? "text-[#0057A8] dark:text-[#16A9D8]" : "text-[#526B83] dark:text-[#AFC1D2]"
        }`} />
        <span className="truncate max-w-[95px] sm:max-w-[130px]">
          {activeItem.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#0057A8] dark:text-[#16A9D8]" : "text-[#526B83] dark:text-[#AFC1D2]"
          }`}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-64 rounded-xl border border-[#D8E3EE] dark:border-[#263B50] bg-[#FFFFFF] dark:bg-[#10243A] shadow-[0_12px_30px_rgba(11,31,58,0.12)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.30)] p-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Search box inside dropdown */}
          <div className="p-1 mb-1 border-b border-[#D8E3EE] dark:border-[#263B50]">
            <div className="relative flex items-center bg-[#F7FAFC] dark:bg-[#0B1A2B] rounded-lg px-2 py-1 border border-[#D8E3EE] dark:border-[#263B50] focus-within:border-[#0E9FCE] dark:focus-within:border-[#16A9D8]">
              <Search className="w-3 h-3 text-[#526B83] dark:text-[#AFC1D2] mr-1.5 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-xs text-[#263B53] dark:text-[#EAF2F8] bg-transparent focus:outline-none placeholder:text-[#7A8CA0] dark:placeholder:text-[#8299AD]"
              />
            </div>
          </div>

          {/* Languages list */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
            {filteredLanguages.length === 0 ? (
              <div className="py-3 text-center text-xs text-[#7A8CA0] dark:text-[#8299AD]">
                {noLanguageFound}
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === selectedLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#EAF4FB] text-[#0057A8] font-semibold dark:bg-[#163B59] dark:text-[#16A9D8]"
                        : "text-[#263B53] dark:text-[#EAF2F8] hover:bg-[#F1F7FC] hover:text-[#0057A8] dark:hover:bg-[#172F47] dark:hover:text-[#FFFFFF]"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#0057A8] dark:text-[#16A9D8] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
