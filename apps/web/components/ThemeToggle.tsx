'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer select-none
        ${isDark
          ? 'bg-[#10243A] hover:bg-[#172F47] text-[#AFC1D2] hover:text-[#EAF2F8] border border-[#263B50] shadow-sm'
          : 'bg-[#FFFFFF] hover:bg-[#F1F7FC] text-[#52657A] hover:text-[#0057A8] border border-[#D8E3EE] shadow-2xs'
        } ${className}`}
    >
      <span className="relative w-4 h-4 flex items-center justify-center">
        {mounted ? (
          isDark ? (
            <Sun className="w-3.5 h-3.5 text-[#16A9D8] transition-transform duration-300 rotate-0 scale-100" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#52657A] transition-transform duration-300 rotate-0 scale-100" />
          )
        ) : (
          <span className="w-3.5 h-3.5 rounded-full bg-[#D8E3EE] dark:bg-[#263B50] animate-pulse" />
        )}
      </span>
      {showLabel && (
        <span className="text-[11px] font-medium">
          {mounted ? (isDark ? 'Light' : 'Dark') : 'Theme'}
        </span>
      )}
    </button>
  );
}
