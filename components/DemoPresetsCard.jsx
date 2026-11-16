import React from 'react';
import { Sparkles, RotateCcw, HelpCircle, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function DemoPresetsCard({ onLoadSriSample, onLoadModernSample, onClear, t }) {
  const s = t?.samples || {};

  return (
    <section 
      aria-labelledby="demo-presets-heading"
      className="mb-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-800/80 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4.5 sm:p-5 transition-all duration-200"
    >
      {/* Header section with explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-4 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="demo-presets-heading" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>{s.heading || "Quick Fill Sample Demos / Test Templates"}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {s.badgeRecommended || "Interactive Samples"}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {s.subheading || "Select a pre-filled sample below to understand how vintage Sri numbers and modern open papers format on official DMT documents:"}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
        
        {/* Sample 1: Vintage Sri Plate (5 Sri 2525) */}
        <div className="group relative flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-amber-200/70 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-500/80 hover:shadow-md transition-all duration-200">
          <div>
            {/* Top row with license plate badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900">
                Vintage Sri Format
              </span>
              {/* Realistic Sri Lankan Vintage Plate Visual */}
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-black text-white font-mono text-[11px] font-bold tracking-wider border border-slate-700 shadow-xs">
                5 <span className="text-amber-400 mx-1 text-[10px]">SRI</span> 2525
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {s.sriCardTitle || "Vintage Sri Plate Format"}
            </h3>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
              {s.sriCardSubtitle || "5 Sri 2525 • With Transfer Date"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {s.sriCardDesc || "Demonstrates classic 3-cluster Sri plate numbering, standard transfer date, and long name overflow protection."}
            </p>
          </div>

          <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onLoadSriSample}
              className="w-full inline-flex items-center justify-center min-h-[38px] px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs transition-colors cursor-pointer group-hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-slate-950" aria-hidden="true" />
              {s.sriCardBtn || "Load Sri Sample (5 Sri 2525)"}
            </button>
          </div>
        </div>

        {/* Sample 2: Modern Provincial Plate + Open Papers (WP CAA-4589) */}
        <div className="group relative flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-sky-200/70 dark:border-sky-900/40 hover:border-sky-400 dark:hover:border-sky-500/80 hover:shadow-md transition-all duration-200">
          <div>
            {/* Top row with license plate badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-900">
                Modern + Open Papers
              </span>
              {/* Realistic Sri Lankan Modern Plate Visual */}
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-white text-slate-900 font-mono text-[11px] font-bold tracking-wider border border-slate-400 shadow-xs">
                <span className="bg-sky-700 text-white px-1 py-0.2 rounded-xs text-[9px] mr-1">WP</span> CAA-4589
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {s.modernCardTitle || "Modern Plate + Open Papers"}
            </h3>
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mt-0.5">
              {s.modernCardSubtitle || "WP CAA-4589 • Date Kept Blank"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {s.modernCardDesc || "Demonstrates modern 2-letter provincial plate with 'Open Papers' (transfer date left 100% blank for car sales)."}
            </p>
          </div>

          <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onLoadModernSample}
              className="w-full inline-flex items-center justify-center min-h-[38px] px-3 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-xs transition-colors cursor-pointer group-hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-white" aria-hidden="true" />
              {s.modernCardBtn || "Load Modern Sample (WP CAA-4589)"}
            </button>
          </div>
        </div>

        {/* Action 3: Fresh Empty Form / Clear */}
        <div className="group relative flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Start From Scratch
              </span>
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[11px] border border-slate-300 dark:border-slate-700">
                Empty Inputs
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {s.clearCardTitle || "Fresh Empty Form"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {s.clearCardSubtitle || "Reset All Form Fields"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {s.clearCardDesc || "Clears all inputs so you can enter your vehicle and ownership details from a clean slate."}
            </p>
          </div>

          <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClear}
              className="w-full inline-flex items-center justify-center min-h-[38px] px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 shadow-xs transition-colors cursor-pointer group-hover:shadow"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              {s.clearCardBtn || "Clear All Fields"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
