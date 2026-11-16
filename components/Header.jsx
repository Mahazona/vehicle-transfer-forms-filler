'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Globe,
  ChevronDown
} from 'lucide-react';

export default function Header({ 
  onLoadSriSample, 
  onLoadModernSample, 
  onClear, 
  onPrint, 
  onDownload, 
  isGenerating,
  currentLang = 'en',
  onLanguageChange,
  theme = 'light',
  onThemeToggle,
  t
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          
          {/* Logo & Civic Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl border border-blue-400/30 text-white shadow-sm flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  {t?.nav?.title || "Sri Lanka Vehicle Transfer Forms Filler"}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" aria-hidden="true" /> 
                  {t?.nav?.badge || "MTA 6 & 8 Ready"}
                </span>
              </div>
              <p className="text-xs text-slate-300/90 mt-0.5">
                {t?.nav?.subtitle || "Official DMT Transfer Forms MTA 6A, 6B & MTA 8 | Clean 10-Page Export"}
              </p>
            </div>
          </div>

          {/* Action Bar & Controls */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            
            {/* Try Sample Data Dropdown with full explanatory options */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Try Sample Data Presets"
                className="inline-flex items-center min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" aria-hidden="true" />
                <span>{t?.nav?.samplesMenu || "Try Sample Data"}</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {/* Explanatory Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  role="menu"
                  className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Sample Presets (Demo Data)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pre-fills form with sample values to test official layouts
                    </p>
                  </div>

                  {/* Sample 1: Vintage Sri Number */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onLoadSriSample();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                        {t?.nav?.demoSri || "Vintage Sri (5 Sri 2525)"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Classic 'Sri' 3-box format with transfer date & owner details
                      </p>
                    </div>
                  </button>

                  {/* Sample 2: Modern Plate with Open Papers */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onLoadModernSample();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="p-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 mt-0.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-sky-300 group-hover:text-sky-200">
                        {t?.nav?.demoModern || "Modern Plate (WP CAA-4589)"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Modern plate with Open Papers (transfer date left blank)
                      </p>
                    </div>
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  {/* Reset to Blank */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onClear();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span className="text-xs font-medium">{t?.nav?.clear || "Clear All Fields"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <label htmlFor="languageSelect" className="sr-only">Select Language</label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-750 transition-colors">
                <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" aria-hidden="true" />
                <select
                  id="languageSelect"
                  value={currentLang}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  aria-label="Change language (English, Sinhala, Tamil)"
                  className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                  <option value="si" className="bg-slate-900 text-white">සිංහල (SI)</option>
                  <option value="ta" className="bg-slate-900 text-white">தமிழ் (TA)</option>
                </select>
              </div>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={theme === 'dark' ? (t?.nav?.lightMode || "Light Mode") : (t?.nav?.darkMode || "Dark Mode")}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors shadow-xs cursor-pointer"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-blue-300" aria-hidden="true" />
              )}
            </button>

            {/* Print Forms Button */}
            <button
              type="button"
              onClick={onPrint}
              disabled={isGenerating}
              aria-label="Print form directly to connected device printer"
              className="inline-flex items-center min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all shadow-xs hover:shadow disabled:opacity-50 cursor-pointer"
              title="Print directly to your connected device printer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              {t?.nav?.printNow || "Print Forms"}
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={onDownload}
              disabled={isGenerating}
              aria-label="Download clean 10-page filled PDF"
              className="inline-flex items-center min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all shadow-xs hover:shadow disabled:opacity-50 cursor-pointer"
              title="Download print-ready PDF"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              {t?.nav?.downloadPdf || "Download PDF"}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
