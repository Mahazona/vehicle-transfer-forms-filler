'use client';

import React from 'react';
import { 
  Printer, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  AlertCircle, 
  FileCheck2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function PdfPreview({
  previewUrl,
  pageSelection,
  onPageSelectionChange,
  onPrint,
  onDownload,
  isGenerating,
  onRefresh,
  t
}) {
  const p = t?.preview || {};

  return (
    <aside 
      aria-label="PDF Live Preview & Export Panel"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 flex flex-col h-[850px] sticky top-20 transition-all duration-200 overflow-hidden"
    >
      
      {/* Preview Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3.5 bg-gradient-to-b from-slate-50/90 to-white dark:from-slate-900 dark:to-slate-900/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
                {p.title || "Live PDF Preview & Printing"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official DMT Vector Template Overlay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isGenerating}
              aria-label={p.refresh || "Refresh PDF Preview"}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors shadow-xs cursor-pointer"
              title={p.refresh || "Refresh Preview"}
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} aria-hidden="true" />
            </button>

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={p.openTab || "Open PDF in a new browser tab"}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors shadow-xs cursor-pointer"
                title={p.openTab || "Open PDF in new tab"}
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Page / Form Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="pageSelection" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {p.selectLabel || "Select Form to Print / Export:"}
            </label>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shadow-xs">
              <FileCheck2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> 
              {p.cleanBadge || "Clean 10-Page Set"}
            </span>
          </div>
          <select
            id="pageSelection"
            value={pageSelection}
            onChange={(e) => onPageSelectionChange(e.target.value)}
            className="text-xs font-medium px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus:border-blue-600 w-full transition-all shadow-xs cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {p.optAll || "Complete Transfer Set (Clean 10 Pages: MTA 6 + MTA 8)"}
            </option>
            <option value="mta6a" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {p.optMta6a || "Form MTA 6A & A1 (To Commissioner General - 2 Pages)"}
            </option>
            <option value="mta6b" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {p.optMta6b || "Form MTA 6B & B1 (Transferee Copies & Instructions - 4 Pages)"}
            </option>
            <option value="mta8" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {p.optMta8 || "Form MTA 8 / CMT 8 (Registration Application C & C1 - 4 Pages)"}
            </option>
          </select>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onPrint}
            disabled={isGenerating || !previewUrl}
            aria-label="Print selected vehicle transfer form directly"
            className="flex items-center justify-center min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all shadow-xs hover:shadow disabled:opacity-50 cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-1.5" aria-hidden="true" />
            {p.printNow || "Print Forms"}
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={isGenerating || !previewUrl}
            aria-label="Download print-ready PDF file"
            className="flex items-center justify-center min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all shadow-xs hover:shadow disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5" aria-hidden="true" />
            {p.downloadPdf || "Download PDF"}
          </button>
        </div>
      </div>

      {/* PDF View Container */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950/80 relative overflow-hidden flex flex-col">
        {isGenerating ? (
          <div 
            role="status" 
            aria-live="polite" 
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 z-10 backdrop-blur-xs"
          >
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-2" aria-hidden="true" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {p.generating || "Generating print-ready PDF overlay..."}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {p.aligning || "Aligning grids, numbers, and witnesses"}
            </p>
          </div>
        ) : null}

        {previewUrl ? (
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title="Vehicle Transfer Form Live Preview"
            className="w-full flex-1 border-0 bg-white shadow-inner"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
            <AlertCircle className="w-10 h-10 mb-2 text-slate-400 dark:text-slate-600" aria-hidden="true" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {p.noPreview || "No preview generated yet"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {p.fillHint || "Fill the form on the left or select a sample preset above"}
            </p>
          </div>
        )}

        {/* Feature status strip under preview */}
        <div className="py-2 px-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" aria-hidden="true" />
            100% Client-Side
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-500" aria-hidden="true" />
            Vector Alignment
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-indigo-500" aria-hidden="true" />
            DMT Form Match
          </span>
        </div>
      </div>

    </aside>
  );
}
