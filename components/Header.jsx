import React from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Globe 
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
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          
          {/* Logo & Civic Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  {t?.nav?.title || "Sri Lanka Vehicle Transfer Forms Filler"}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" /> {t?.nav?.badge || "MTA 6 & 8 Ready"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t?.nav?.subtitle || "Official DMT Transfer Forms MTA 6A, 6B & MTA 8 | Clean 10-Page Export"}
              </p>
            </div>
          </div>

          {/* Action Bar & Controls */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <label htmlFor="languageSelect" className="sr-only">Select Language</label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200">
                <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-400" aria-hidden="true" />
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

            {/* Sample Preset: Sri Number */}
            <button
              type="button"
              onClick={onLoadSriSample}
              aria-label="Load demo with Sri vehicle number 5 Sri 2525"
              className="inline-flex items-center min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors shadow-xs cursor-pointer"
              title="Load demo with Sri number (e.g. 5 Sri 2525)"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" aria-hidden="true" />
              {t?.nav?.demoSri || "5 Sri 2525"}
            </button>

            {/* Sample Preset: Modern Number */}
            <button
              type="button"
              onClick={onLoadModernSample}
              aria-label="Load demo with modern vehicle number WP CAA-4589"
              className="inline-flex items-center min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors shadow-xs cursor-pointer"
              title="Load demo with modern number (e.g. WP CAA-4589)"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-400" aria-hidden="true" />
              {t?.nav?.demoModern || "WP CAA-4589"}
            </button>

            {/* Clear Button */}
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear all form fields"
              className="inline-flex items-center min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors shadow-xs cursor-pointer"
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" aria-hidden="true" />
              {t?.nav?.clear || "Clear"}
            </button>

            {/* Print Now Button */}
            <button
              type="button"
              onClick={onPrint}
              disabled={isGenerating}
              aria-label="Print form directly to connected device printer"
              className="inline-flex items-center min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              title="Print directly to your connected device printer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              {t?.nav?.printNow || "Print Now"}
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={onDownload}
              disabled={isGenerating}
              aria-label="Download clean 10-page filled PDF"
              className="inline-flex items-center min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
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
