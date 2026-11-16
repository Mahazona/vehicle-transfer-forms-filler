'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PenTool, 
  CheckCircle2, 
  FileCheck2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  FileText 
} from 'lucide-react';

export default function NoticeCard({ t }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const n = t?.notice || {};

  return (
    <aside 
      aria-label={n.title || "Official Sri Lanka DMT Transfer Guidelines & Formatting Rules"}
      className="mb-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200"
    >
      {/* Notice Card Header Bar */}
      <div className="flex items-center justify-between p-4 sm:px-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-transparent dark:from-slate-800/60 dark:via-slate-800/40 dark:to-transparent border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>{n.title || "Official Sri Lanka DMT Transfer Guidelines & Formatting Rules"}</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Verified against Department of Motor Traffic (DMT / RMV) official submission standards
            </p>
          </div>
        </div>

        {/* Toggle Button to collapse/expand */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isExpanded ? "Collapse guidelines" : "Expand guidelines"}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Bento Grid Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Tile 1: Physical Pen Signatures */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-xs mb-1.5">
                  <PenTool className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{n.ruleSignaturesTitle || "Signatures Kept Blank"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.ruleSignaturesDesc || "In strict accordance with DMT requirements, all signature spaces are intentionally skipped for physical pen signature."}
                </p>
              </div>
            </div>

            {/* Tile 2: Safe Overflow */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-semibold text-xs mb-1.5">
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{n.ruleLongNamesTitle || "Long Names Safe Overflow"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.ruleLongNamesDesc || "If names exceed the printed 35 character boxes, text continues outside the boxes without ever overflowing the printable paper margin."}
                </p>
              </div>
            </div>

            {/* Tile 3: Sri & Modern Numbers */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-semibold text-xs mb-1.5">
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{n.ruleSriTitle || "Sri & Modern Numbers"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.ruleSriDesc || "Automatically parsed into Prefix, 'SRI', and number sets for MTA 6's 3 box clusters and MTA 8's 10-cell grid."}
                </p>
              </div>
            </div>

            {/* Tile 4: Open Papers */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-xs mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{n.ruleOpenPapersTitle || "Open Papers (Car Sales)"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.ruleOpenPapersDesc || "Enable 'Open Papers' to leave transfer dates blank for car dealership transactions."}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
}
