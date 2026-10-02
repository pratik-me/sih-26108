"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "@bis/ui";
import { useTranslation } from "@/lib/i18n";
import {
  Search,
  FlaskConical,
  Building2,
  FileBarChart2,
  Menu,
  X,
  Compass,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  FileCheck2,
  Scale,
  Sparkles,
  Bot,
  Layers,
  AlertOctagon,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { isAuthenticated, clearAuthToken, isAdmin } from "@/lib/auth";

export function Header() {
  const pathname = usePathname();
  const { t, language: selectedLanguage, setLanguage: setSelectedLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [standardsDropdownOpen, setStandardsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const checkAuth = () => {
    setIsLoggedIn(isAuthenticated());
    setIsAdminUser(isAdmin());
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setIsAdminUser(false);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openStandardsMenu = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setStandardsDropdownOpen(true);
  };

  const scheduleCloseStandardsMenu = (delay = 150) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setStandardsDropdownOpen(false);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const isStandardsActive =
    pathname === "/standards" || pathname === "/standards/recommend";

  const navLinks = [
    { href: "/procure", label: "Tender Analyzer", icon: FileCheck2 },
    { href: "/compliance", label: "GFR 144(i) Audit", icon: Scale },
    { href: "/testing", label: "PDI & Testing", icon: FlaskConical },
    { href: "/laboratories", label: "Recognized Labs", icon: Building2 },
    { href: "/chat", label: "AI Workspace", icon: Bot },
    { href: "/reports", label: "Dossiers", icon: FileBarChart2 },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 ${isScrolled
          ? "bg-white/85 dark:bg-[#07111F]/85 border-b border-[#E2EAF1]/80 dark:border-[#263B50]/80 shadow-sm shadow-[#0B1F3A]/5"
          : "bg-white/75 dark:bg-[#07111F]/75 border-b border-[#E2EAF1]/50 dark:border-[#263B50]/50"
        }`}
    >
      {/* Main Nav Bar */}
      <div className="max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group mr-1"
          >
            <div className="flex items-center gap-2">
              <div className="shrink-0 relative">
                <Image
                  src={"/BIS-LOGO.png"}
                  alt="BIS Logo"
                  height={36}
                  width={36}
                  priority
                  className="rounded"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-[#0B1F3A] dark:text-[#F1F5F9] whitespace-nowrap">
                    Manak Setu <span className="text-[#0057A8] dark:text-[#16A9D8] font-extrabold">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-[#EAF4FB] dark:bg-[#163B59] text-[#0057A8] dark:text-[#16A9D8] px-1.5 py-0.2 rounded border border-[#B9DDED] dark:border-[#263B50]">
                    SIH 26108
                  </span>
                </div>
                <p className="text-[10px] text-[#52657A] dark:text-[#8299AD] font-medium leading-none whitespace-nowrap">
                  BIS & GeM Procurement Recommendation Engine
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-nowrap">
            {/* Tender Analyzer */}
            <Link
              href="/procure"
              className={`group inline-flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${pathname === "/procure"
                  ? "bg-[#EAF4FB] text-[#0057A8] font-bold border border-[#B9DDED] dark:bg-[#163B59] dark:text-[#16A9D8] dark:border-[#263B50] shadow-2xs"
                  : "text-[#263B53] dark:text-[#AFC1D2] hover:text-[#0057A8] dark:hover:text-[#FFFFFF] hover:bg-[#F1F7FC] dark:hover:bg-[#172F47]"
                }`}
            >
              <FileCheck2
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${pathname === "/procure"
                    ? "text-[#0057A8] dark:text-[#16A9D8]"
                    : "text-[#526B83] dark:text-[#AFC1D2] group-hover:text-[#0057A8] dark:group-hover:text-[#16A9D8]"
                  }`}
              />
              <span>Tender Analyzer</span>
            </Link>

            {/* Standards Dropdown */}
            <div
              className="relative"
              onMouseEnter={openStandardsMenu}
              onMouseLeave={() => scheduleCloseStandardsMenu()}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={standardsDropdownOpen}
                onClick={() => {
                  if (standardsDropdownOpen) {
                    if (closeTimeout.current) {
                      clearTimeout(closeTimeout.current);
                      closeTimeout.current = null;
                    }
                    setStandardsDropdownOpen(false);
                  } else {
                    openStandardsMenu();
                  }
                }}
                onFocus={openStandardsMenu}
                className={`group inline-flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isStandardsActive
                    ? "bg-[#EAF4FB] text-[#0057A8] font-bold border border-[#B9DDED] dark:bg-[#163B59] dark:text-[#16A9D8] dark:border-[#263B50] shadow-2xs"
                    : "text-[#263B53] dark:text-[#AFC1D2] hover:text-[#0057A8] dark:hover:text-[#FFFFFF] hover:bg-[#F1F7FC] dark:hover:bg-[#172F47]"
                  }`}
              >
                <Search
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${isStandardsActive
                      ? "text-[#0057A8] dark:text-[#16A9D8]"
                      : "text-[#526B83] dark:text-[#AFC1D2] group-hover:text-[#0057A8] dark:group-hover:text-[#16A9D8]"
                    }`}
                />
                <span>Standards & QCO</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${standardsDropdownOpen ? "rotate-180 text-[#0057A8] dark:text-[#16A9D8]" : ""
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {standardsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border border-[#D8E3EE]/80 dark:border-[#263B50]/80 bg-white/95 dark:bg-[#10243A]/95 backdrop-blur-2xl shadow-[0_12px_30px_rgba(11,31,58,0.12)] p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/standards/recommend"
                    onClick={() => setStandardsDropdownOpen(false)}
                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F1F7FC] dark:hover:bg-[#172F47] transition-all"
                  >
                    <span className="p-2 rounded-lg bg-[#EAF6FC] dark:bg-[#153653] text-[#0057A8] dark:text-[#16A9D8]">
                      <Compass className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#0B1F3A] dark:text-[#F1F5F9] group-hover:text-[#0057A8] dark:group-hover:text-[#FFFFFF]">
                        Match Specification to IS
                      </div>
                      <p className="text-[11px] text-[#7A8CA0] dark:text-[#AFC1D2]">
                        Find applicable standards & QCO statutory mandates
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/standards"
                    onClick={() => setStandardsDropdownOpen(false)}
                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F1F7FC] dark:hover:bg-[#172F47] transition-all mt-1"
                  >
                    <span className="p-2 rounded-lg bg-[#EAF6FC] dark:bg-[#153653] text-[#0057A8] dark:text-[#16A9D8]">
                      <Search className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#0B1F3A] dark:text-[#F1F5F9] group-hover:text-[#0057A8] dark:group-hover:text-[#FFFFFF]">
                        Standards & QCO Directory
                      </div>
                      <p className="text-[11px] text-[#7A8CA0] dark:text-[#AFC1D2]">
                        Search full catalogue with superseded standard alerts
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Remaining Links */}
            {navLinks.slice(1).map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group inline-flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                      ? "bg-[#EAF4FB] text-[#0057A8] font-bold border border-[#B9DDED] dark:bg-[#163B59] dark:text-[#16A9D8] dark:border-[#263B50] shadow-2xs"
                      : "text-[#263B53] dark:text-[#AFC1D2] hover:text-[#0057A8] dark:hover:text-[#FFFFFF] hover:bg-[#F1F7FC] dark:hover:bg-[#172F47]"
                    }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive
                        ? "text-[#0057A8] dark:text-[#16A9D8]"
                        : "text-[#526B83] dark:text-[#AFC1D2] group-hover:text-[#0057A8] dark:group-hover:text-[#16A9D8]"
                      }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1">
            <LanguageSelector
              onDashboard={true}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            <ThemeToggle />

            {/* Auth Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-1">
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm transition-all whitespace-nowrap"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0057A8] hover:bg-[#004783] text-white shadow-sm transition-all whitespace-nowrap"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-[#52657A] hover:text-[#C93636] hover:bg-[#F1F7FC] dark:hover:bg-[#172F47] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0057A8] hover:bg-[#004783] dark:bg-[#1268B3] text-white shadow-sm transition-all whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#263B53] dark:text-[#AFC1D2] hover:bg-[#F1F7FC] dark:hover:bg-[#172F47]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07111F] p-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/procure"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            Tender & BOQ Analyzer
          </Link>
          <Link
            href="/compliance"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <Scale className="w-4 h-4 text-amber-600" />
            GFR 144(i) Compliance Audit
          </Link>
          <Link
            href="/standards"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <Search className="w-4 h-4 text-blue-600" />
            Standards & QCO Directory
          </Link>
          <Link
            href="/testing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            PDI Inspection Schedules & Testing
          </Link>
          <Link
            href="/laboratories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            Recognized Testing Laboratories
          </Link>
          <Link
            href="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            Procurement AI Workspace
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-slate-100"
          >
            <FileBarChart2 className="w-4 h-4 text-cyan-600" />
            GeM Compliance Dossiers
          </Link>
        </div>
      )}
    </header>
  );
}
