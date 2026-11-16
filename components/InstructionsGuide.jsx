'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  ArrowUp,
  Layers,
  Calendar,
  CreditCard,
  Building2,
  Car,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';

export default function InstructionsGuide({ t }) {
  const [activeTab, setActiveTab] = useState('all');
  const [checkedDocs, setCheckedDocs] = useState({});

  const g = t?.guide || {};

  const toggleCheck = (id) => {
    setCheckedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const documentsList = [
    {
      id: 'doc1',
      title: g.doc1Title || "MTA 6 Forms (Parts A, A1, B, B1)",
      desc: g.doc1Desc || "Notice of Transfer of Motor Vehicle. Signed by both transferor and transferee with two valid witnesses.",
      tag: g.doc1Tag || "Mandatory",
      type: 'mandatory'
    },
    {
      id: 'doc2',
      title: g.doc2Title || "MTA 8 Forms (Form C & C1)",
      desc: g.doc2Desc || "Application for Registration on Transfer of Ownership. Signed by the transferee (buyer) with selected plate collection office.",
      tag: g.doc2Tag || "Mandatory",
      type: 'mandatory'
    },
    {
      id: 'doc3',
      title: g.doc3Title || "Original Certificate of Registration (CR)",
      desc: g.doc3Desc || "The official vehicle registration book issued by DMT. Must be undamaged and must not be laminated.",
      tag: g.doc3Tag || "Mandatory",
      type: 'mandatory'
    },
    {
      id: 'doc4',
      title: g.doc4Title || "Current Revenue License + 1 Clear Photocopy",
      desc: g.doc4Desc || "Original valid provincial revenue license for the vehicle, plus one clear photocopy.",
      tag: g.doc4Tag || "Mandatory",
      type: 'mandatory'
    },
    {
      id: 'doc5',
      title: g.doc5Title || "Certified Copies of NICs (Both Parties)",
      desc: g.doc5Desc || "Photocopies of the National Identity Cards of both seller and buyer, certified by a Justice of Peace (JP) or authorized officer.",
      tag: g.doc5Tag || "Mandatory",
      type: 'mandatory'
    },
    {
      id: 'doc6',
      title: g.doc6Title || "Finance / Leasing Deletion Letter (CMT 63)",
      desc: g.doc6Desc || "If the vehicle is under absolute ownership, a clearance letter and Form CMT 63 from the finance company or bank.",
      tag: g.doc6Tag || "Conditional",
      type: 'conditional'
    },
    {
      id: 'doc7',
      title: g.doc7Title || "Vehicle Weight Certificate (CMT 130)",
      desc: g.doc7Desc || "Required for dual-purpose vehicles, vans, lorries, trucks, buses, and commercial transport vehicles.",
      tag: g.doc7Tag || "Conditional",
      type: 'conditional'
    },
    {
      id: 'doc8',
      title: g.doc8Title || "One-Day Express Declaration & Consent Affidavit",
      desc: g.doc8Desc || "For One-Day express service at Narahenpita: Both parties must attend in person with original NICs, OR the seller must supply a sworn affidavit certified by a JP.",
      tag: g.doc8Tag || "One-Day Service Only",
      type: 'oneday'
    }
  ];

  const stepsList = [
    {
      num: g.step1Num || "1",
      title: g.step1Title || "Fill & Download Official Forms Online",
      desc: g.step1Desc || "Enter the seller, buyer, vehicle registration number, and witness details in this tool. Download the clean, auto-aligned 10-page PDF containing Forms MTA 6A, MTA 6B, and MTA 8 (Form C & C1). Print on standard A4 paper."
    },
    {
      num: g.step2Num || "2",
      title: g.step2Title || "Sign with Blue/Black Pen & Add 2 Witnesses",
      desc: g.step2Desc || "Transferor (seller) signs MTA 6 Parts A, A1, B, and B1. Transferee (buyer) signs MTA 8 (Form C & C1). Obtain 2 witnesses with their full names, addresses, and NIC numbers. Signatures are intentionally left blank online for your physical security."
    },
    {
      num: g.step3Num || "3",
      title: g.step3Title || "Send Form MTA 6A & A1 to Commissioner General",
      desc: g.step3Desc || "CRITICAL: Within 14 days of the date of transfer, the seller must send Form MTA 6A & A1 by registered post to the Commissioner General of Motor Traffic (P.O. Box 533, Colombo) or hand it over at the DMT office."
    },
    {
      num: g.step4Num || "4",
      title: g.step4Title || "Gather Original Documents & Certified Copies",
      desc: g.step4Desc || "Collect the original Certificate of Registration (CR / 'Vehicle Book'), valid Revenue License with 1 photocopy, certified photocopies of both parties' NICs, and finance clearance (CMT 63) if applicable."
    },
    {
      num: g.step5Num || "5",
      title: g.step5Title || "Submit MTA 8 & MTA 6B at DMT Office & Pay Fees",
      desc: g.step5Desc || "The buyer submits Form MTA 8 along with MTA 6B and supporting documents to DMT Narahenpita (for One-Day Service) or their local District Secretariat (for Normal Service). Pay the transfer fee and receive the updated CR."
    }
  ];

  return (
    <section 
      id="instructions"
      aria-label={g.title || "Vehicle Transfer Instructions & Required Documents Checklist"}
      className="mt-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden scroll-mt-24 transition-colors"
    >
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
            {g.badge || "Department of Motor Traffic (DMT / RMV) Procedure"}
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {g.title || "Vehicle Transfer Instructions & Required Documents Checklist"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            {g.subtitle || "Complete step-by-step guidance, mandatory paperwork, and official DMT guidelines for motor vehicle ownership transfer in Sri Lanka."}
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-blue-800/60">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/40 hover:bg-blue-800/60 text-blue-100'
              }`}
            >
              {g.tabAll || "All Guide"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/40 hover:bg-blue-800/60 text-blue-100'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
              {g.tabDocs || "Required Documents"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('steps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'steps'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/40 hover:bg-blue-800/60 text-blue-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
              {g.tabSteps || "How To Do It (Steps)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/40 hover:bg-blue-800/60 text-blue-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
              {g.tabServices || "Normal vs One-Day"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/40 hover:bg-blue-800/60 text-blue-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
              {g.tabRules || "Deadlines & Penalties"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-10">

        {/* SECTION 1: Required Documents Checklist */}
        {(activeTab === 'all' || activeTab === 'docs') && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>{g.docsTitle || "Mandatory & Conditional Documents Checklist"}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {g.docsSubtitle || "Review this checklist to ensure you have every required document before visiting the DMT / RMV office:"}
                </p>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md self-start sm:self-auto">
                {Object.values(checkedDocs).filter(Boolean).length} / {documentsList.length} Checked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {documentsList.map((doc) => {
                const isChecked = !!checkedDocs[doc.id];
                return (
                  <div
                    key={doc.id}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleCheck(doc.id);
                      }
                    }}
                    onClick={() => toggleCheck(doc.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isChecked 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs' 
                        : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-emerald-900 dark:text-emerald-200 line-through decoration-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                          {doc.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.type === 'mandatory'
                            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                            : doc.type === 'oneday'
                            ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                            : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                        }`}>
                          {doc.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: Step-by-Step Procedure */}
        {(activeTab === 'all' || activeTab === 'steps') && (
          <div>
            <div className="mb-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{g.stepsTitle || "Step-by-Step Vehicle Transfer Procedure"}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {g.stepsSubtitle || "Follow these 5 official steps to complete your vehicle ownership transfer without hassle or unexpected delays:"}
              </p>
            </div>

            <div className="space-y-3.5">
              {stepsList.map((step) => (
                <div 
                  key={step.num}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Normal vs One-Day Service Comparison */}
        {(activeTab === 'all' || activeTab === 'services') && (
          <div>
            <div className="mb-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span>{g.servicesTitle || "Normal Service vs. One-Day Express Service"}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {g.servicesSubtitle || "Choose the service option that fits your urgency and location:"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Normal Service Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      <Calendar className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      {g.normalTime || "2 to 4 Weeks"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Standard Method
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {g.normalTitle || "Normal Transfer Service (සාමාන්‍ය සේවය)"}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {g.normalDesc || "Economical and convenient for vehicle owners outside the Western Province. You can submit documents at your local District Secretariat."}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-4">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" aria-hidden="true" />
                    <span>{g.normalLocation || "Any DMT District Office or Narahenpita Head Office"}</span>
                  </div>

                  <ul className="space-y-2 border-t border-slate-100 dark:border-slate-700/60 pt-3 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{g.normalPt1 || "Standard government transfer fees (approx Rs. 1,500 - Rs. 4,500 depending on vehicle class)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{g.normalPt2 || "New Certificate of Registration posted directly to the buyer's permanent address"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{g.normalPt3 || "Seller does not have to travel to Colombo"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* One-Day Express Service Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:from-slate-800/90 dark:to-purple-950/20 border border-purple-200 dark:border-purple-800/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                      <Sparkles className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      {g.oneDayTime || "Same Day (2 - 4 Hours)"}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400">
                      Fast-Track Priority
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {g.oneDayTitle || "One-Day Transfer Service (එක් දින සේවාව)"}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {g.oneDayDesc || "Fast-track transfer service providing same-day ownership registration and printed CR book on the spot."}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-purple-900 dark:text-purple-200 font-medium mb-4">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" aria-hidden="true" />
                    <span>{g.oneDayLocation || "Exclusively at DMT Head Office, Narahenpita (Colombo)"}</span>
                  </div>

                  <ul className="space-y-2 border-t border-purple-200/60 dark:border-slate-700/60 pt-3 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{g.oneDayPt1 || "Express government fee (standard fee + approx Rs. 1,000 - Rs. 3,000 express surcharge)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{g.oneDayPt2 || "Requires 'One-Day Transfer Service Consent' filled on Form MTA 6 (supported in this tool)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{g.oneDayPt3 || "Both buyer and seller must be present with original NICs, or seller must provide JP-certified affidavit"}</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 4: Important Deadlines & Penalties */}
        {(activeTab === 'all' || activeTab === 'rules') && (
          <div className="rounded-xl p-5 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 dark:border-amber-700/40">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <h3 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200">
                {g.rulesTitle || "Crucial DMT Legal Deadlines & Late Penalties"}
              </h3>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 mb-4">
              {g.rulesSubtitle || "Avoid unnecessary fines and legal complications by keeping these rules in mind:"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {g.rule1Title || "14-Day Submission Rule"}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  {g.rule1Desc || "Under Section 12 of the Motor Traffic Act, Form MTA 6 must be delivered to the DMT within 14 days of the transfer date. Delays attract escalating monthly penalty fines."}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {g.rule2Title || "Open Papers (Car Dealerships & Brokers)"}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  {g.rule2Desc || "If a vehicle is sold to a broker or dealer without an immediate end buyer, the transfer date is often kept blank ('Open Papers'). This prevents the 14-day clock from triggering until the ultimate buyer signs."}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {g.rule3Title || "Ink Signatures & Physical Verification"}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  {g.rule3Desc || "DMT officers reject forms with typed or printed signatures. All copies must be signed with a physical pen. Keep your Certificate of Registration safe and unlaminated."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back to Top / Fill Form CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official regulations per Department of Motor Traffic (Motor Traffic Act Chapter 203)
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-xs"
          >
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Form & Preview</span>
          </button>
        </div>

      </div>
    </section>
  );
}
