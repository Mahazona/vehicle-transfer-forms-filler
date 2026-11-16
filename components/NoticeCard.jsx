import React from 'react';
import { Info, PenTool, CheckCircle, ShieldCheck } from 'lucide-react';

export default function NoticeCard({ t }) {
  const n = t?.notice || {};

  return (
    <aside 
      aria-label={n.title || "Form Filling Guidelines Notice"}
      className="bg-blue-50/80 dark:bg-slate-900/80 border border-blue-200 dark:border-slate-800 rounded-xl p-4.5 shadow-xs mb-6 text-slate-800 dark:text-slate-200 transition-colors"
    >
      <div className="flex items-start space-x-3.5">
        <div className="p-2 bg-blue-100/90 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-lg shrink-0 mt-0.5">
          <Info className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
              {n.title || "Official Sri Lanka DMT Transfer Guidelines & Formatting Rules"}
            </h2>
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <PenTool className="w-3 h-3 text-emerald-700 dark:text-emerald-400" aria-hidden="true" /> 
              {n.badgeSignatures || "Signatures Kept 100% Blank"}
            </span>
            <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
              {n.badgeClean || "Clean 10-Page Set (No Blanks)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              • <strong className="text-slate-900 dark:text-white">{n.ruleSignaturesTitle || "Signatures Left Blank:"}</strong> {n.ruleSignaturesDesc || "In strict accordance with DMT requirements, all signature spaces are intentionally skipped for physical pen signature."}
            </p>
            <p>
              • <strong className="text-slate-900 dark:text-white">{n.ruleLongNamesTitle || "Long Names Safe Overflow:"}</strong> {n.ruleLongNamesDesc || "If names exceed the printed 35 character boxes, text continues outside the boxes without ever overflowing the printable paper margin."}
            </p>
            <p>
              • <strong className="text-slate-900 dark:text-white">{n.ruleSriTitle || "Sri & Modern Numbers:"}</strong> {n.ruleSriDesc || "Automatically parsed into Prefix, 'SRI', and number sets for MTA 6's 3 box clusters and MTA 8's 10-cell grid."}
            </p>
            <p>
              • <strong className="text-slate-900 dark:text-white">{n.ruleOpenPapersTitle || "Open Papers (Car Sales):"}</strong> {n.ruleOpenPapersDesc || "Enable 'Open Papers' to leave transfer dates blank for car dealership transactions."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
