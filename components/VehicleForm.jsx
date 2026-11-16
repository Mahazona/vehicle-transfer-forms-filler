'use client';

import React from 'react';
import { 
  Car, 
  Calendar, 
  User, 
  UserCheck, 
  Users, 
  Clock, 
  AlertTriangle, 
  FileText, 
  CheckCircle2,
  Info,
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { parseVehicleNumber } from '../utils/vehicleParser.js';

const PROVINCES = [
  'WESTERN',
  'CENTRAL',
  'SOUTHERN',
  'NORTH WESTERN',
  'NORTH CENTRAL',
  'NORTHERN',
  'EASTERN',
  'SABARAGAMUWA',
  'UVA'
];

const DISTRICTS = [
  'COLOMBO', 'GAMPAHA', 'KALUTARA',
  'KANDY', 'MATALE', 'NUWARA ELIYA',
  'GALLE', 'MATARA', 'HAMBANTOTA',
  'JAFFNA', 'KILINOCHCHI', 'MANNAR', 'VAVUNIYA', 'MULLAITIVU',
  'BATTICALOA', 'AMPARA', 'TRINCOMALEE',
  'KURUNEGALA', 'PUTTALAM',
  'ANURADHAPURA', 'POLONNARUWA',
  'BADULLA', 'MONARAGALA',
  'RATNAPURA', 'KEGALLE'
];

export default function VehicleForm({ formData, onChange, t }) {
  const f = t?.form || {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenPapersToggle = (e) => {
    const isOpen = e.target.checked;
    onChange({
      ...formData,
      isOpenPapers: isOpen,
      transferDate: isOpen ? '' : (formData.transferDate || new Date().toISOString().split('T')[0])
    });
  };

  const transferorLen = (formData.transferorName || '').length;
  const transfereeLen = (formData.transfereeName || '').length;
  const parsedVeh = parseVehicleNumber(formData.vehicleNumber);

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-label="Vehicle Transfer Application Form">
      
      {/* 1. Vehicle Details */}
      <section 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-5 md:p-6 transition-all duration-200" 
        aria-labelledby="section-veh-title"
      >
        <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
              01
            </div>
            <div>
              <h2 id="section-veh-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {f.section1Title || "1. Vehicle & Transfer Details"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {f.section1Sub || "වාහනයේ සහ පැවරීමේ විස්තර / வாகன மற்றும் பரிமாற்ற விவரங்கள்"}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="font-medium">MTA 6 & MTA 8</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vehicle Number Input & Realistic License Plate Visualizer */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="vehicleNumber" className="block text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                {f.vehicleNumber || "Vehicle Registration No."} <span className="text-red-500" aria-label="required">*</span>
              </label>
              {parsedVeh.fullFormatted && (
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  {parsedVeh.isSri ? (f.sriNumberBadge || 'Sri Number') : parsedVeh.isModern ? (f.modernNumberBadge || 'Modern No') : (f.detectedBadge || 'Detected')}
                </span>
              )}
            </div>

            <input
              id="vehicleNumber"
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber || ''}
              onChange={handleChange}
              placeholder={f.vehicleNumberPlaceholder || "e.g. 5 Sri 2525, 19 Sri 1234, WP CAA-2525"}
              aria-describedby="vehicleNumber-desc"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono uppercase tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
            />

            {/* Interactive Sri Lankan License Plate Graphic Visualizer */}
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Plate Preview:</span>
              {parsedVeh.isSri ? (
                /* Vintage Sri Plate Badge */
                <div className="inline-flex items-center px-3 py-1 rounded-md bg-slate-950 text-white font-mono text-xs font-bold tracking-widest border border-slate-700 shadow-xs">
                  <span>{parsedVeh.prefix}</span>
                  <span className="text-amber-400 mx-1.5 text-[10px] bg-slate-800 px-1 py-0.2 rounded-xs">SRI</span>
                  <span>{parsedVeh.number}</span>
                </div>
              ) : parsedVeh.isModern ? (
                /* Modern Plate Badge */
                <div className="inline-flex items-center px-3 py-1 rounded-md bg-white text-slate-900 font-mono text-xs font-bold tracking-wider border border-slate-400 shadow-xs">
                  {parsedVeh.province && (
                    <span className="bg-sky-700 text-white px-1.5 py-0.2 rounded-xs text-[10px] mr-1.5 font-sans font-extrabold">
                      {parsedVeh.province}
                    </span>
                  )}
                  <span>{parsedVeh.prefix}-{parsedVeh.number}</span>
                </div>
              ) : formData.vehicleNumber ? (
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">
                  {formData.vehicleNumber.toUpperCase()}
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Enter number to see preview
                </span>
              )}
            </div>

            <p id="vehicleNumber-desc" className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {f.vehicleNumberHint || "Supports Sri numbers (e.g. 5 Sri 2525), modern (WP CAA-2525), or dash (64-1234)."}
            </p>
          </div>

          {/* Date of Transfer / Open Papers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="transferDate" className="block text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                {f.transferDate || "Date of Transfer"}
              </label>
              
              <label htmlFor="isOpenPapers" className="inline-flex items-center text-xs text-amber-700 dark:text-amber-400 font-bold cursor-pointer hover:text-amber-800 dark:hover:text-amber-300 transition-colors">
                <input
                  id="isOpenPapers"
                  type="checkbox"
                  name="isOpenPapers"
                  checked={!!formData.isOpenPapers}
                  onChange={handleOpenPapersToggle}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 dark:border-slate-600 focus-visible:ring-2 focus-visible:ring-amber-500 mr-1.5 cursor-pointer"
                />
                {f.openPapers || "Open Papers (Leave Blank)"}
              </label>
            </div>

            <input
              id="transferDate"
              type="date"
              name="transferDate"
              value={formData.transferDate || ''}
              onChange={handleChange}
              disabled={!!formData.isOpenPapers}
              aria-describedby="transferDate-desc"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 ${
                formData.isOpenPapers 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-75' 
                  : 'bg-slate-50/70 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600'
              }`}
            />

            {/* Explanatory callout for Date / Open Papers */}
            <div className={`p-2.5 rounded-xl border text-xs leading-relaxed transition-all ${
              formData.isOpenPapers
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-900 dark:text-amber-300'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {formData.isOpenPapers ? (
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{f.openPapersHintActive || '⚠️ Open Papers active: Date boxes on all forms are kept completely blank for open papers / car sale transactions.'}</span>
                </div>
              ) : (
                <div className="flex items-start gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{f.openPapersHintInactive || 'Day, Month, and Year are mapped into individual grid boxes on MTA 6 and MTA 8.'}</span>
                </div>
              )}
            </div>
          </div>

          {/* One-Day Service Declaration Consent */}
          <div className="md:col-span-2 pt-1">
            <label htmlFor="isOneDay" className="flex items-start p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-slate-950 dark:to-slate-900/80 border border-blue-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-slate-700 transition-colors">
              <input
                id="isOneDay"
                type="checkbox"
                name="isOneDay"
                checked={!!formData.isOneDay}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus-visible:ring-2 focus-visible:ring-blue-600 mt-0.5 cursor-pointer"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  {f.oneDayConsent || "One-Day Transfer Service Consent (එක් දින සේවය / ஒரு நாள் சேவை)"}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-normal">
                  {f.oneDayConsentDesc || "Fills vehicle registration number into Sinhala, Tamil, and English declaration lines, formatting owner details within safe printable margins."}
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* 2. Registered Owner / Seller (Transferor) */}
      <section 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-5 md:p-6 transition-all duration-200" 
        aria-labelledby="section-seller-title"
      >
        <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs">
              02
            </div>
            <div>
              <h2 id="section-seller-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {f.section2Title || "2. Current Registered Owner (Transferor / පැවරීම්කරු)"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {f.section2Sub || "Seller details matching the current Certificate of Registration (CR)"}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span className="font-medium">Seller Info</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
              <label htmlFor="transferorName" className="block text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                {f.transferorName || "Full Name (in English Block Letters)"} <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{transferorLen} {f.chars || "chars"}</span>
                {transferorLen > 35 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    {f.safeOverflowActive || "Safe Overflow Guard Active"}
                  </span>
                )}
              </div>
            </div>
            <textarea
              id="transferorName"
              name="transferorName"
              rows={2}
              value={formData.transferorName || ''}
              onChange={handleChange}
              placeholder={f.transferorNamePlaceholder || "e.g. WARNAKULASOORIYA MAHAWADUGE KASUN CHAMARA FERNANDO"}
              aria-describedby="transferorName-desc"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase font-mono tracking-wide text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
            />
            <p id="transferorName-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              {transferorLen > 35 
                ? (f.transferorNameOverflowHint || 'ℹ️ Name exceeds the 35 printed grid cells: It will neatly continue outside the boxes, strictly bounded within printable page margins.')
                : (f.transferorNameNormalHint || 'Names up to 35 characters are centered inside individual grid boxes.')}
            </p>
          </div>

          <div>
            <label htmlFor="transferorAddress" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
              {f.transferorAddress || "Permanent Address"} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <textarea
              id="transferorAddress"
              name="transferorAddress"
              rows={2}
              value={formData.transferorAddress || ''}
              onChange={handleChange}
              placeholder={f.transferorAddressPlaceholder || "e.g. NO 45/2, TEMPLE ROAD, NAWALA, RAJAGIRIYA"}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="transferorNic" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.transferorNic || "National Identity Card (NIC) / Passport No."} <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="transferorNic"
                type="text"
                name="transferorNic"
                value={formData.transferorNic || ''}
                onChange={handleChange}
                placeholder={f.transferorNicPlaceholder || "e.g. 198812345678 or 881234567V"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase font-mono tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="transferorPhone" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.transferorPhone || "Contact Phone / Mobile"}
              </label>
              <input
                id="transferorPhone"
                type="tel"
                name="transferorPhone"
                value={formData.transferorPhone || ''}
                onChange={handleChange}
                placeholder={f.transferorPhonePlaceholder || "e.g. 0771234567"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. New Owner / Buyer (Transferee) */}
      <section 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-5 md:p-6 transition-all duration-200" 
        aria-labelledby="section-buyer-title"
      >
        <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
              03
            </div>
            <div>
              <h2 id="section-buyer-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {f.section3Title || "3. New Owner (Transferee / පැවරීම්ලාභියා)"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {f.section3Sub || "Buyer details to be registered as the new owner"}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span className="font-medium">Buyer Info</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
              <label htmlFor="transfereeName" className="block text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                {f.transfereeName || "Full Name (in English Block Letters)"} <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{transfereeLen} {f.chars || "chars"}</span>
                {transfereeLen > 35 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    {f.safeOverflowActive || "Safe Overflow Guard Active"}
                  </span>
                )}
              </div>
            </div>
            <textarea
              id="transfereeName"
              name="transfereeName"
              rows={2}
              value={formData.transfereeName || ''}
              onChange={handleChange}
              placeholder={f.transfereeNamePlaceholder || "e.g. HETTIARACHCHIGE DONA ANURADHA PRIYADARSHANI WIJESEKARA"}
              aria-describedby="transfereeName-desc"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase font-mono tracking-wide text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
            />
            <p id="transfereeName-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              {transfereeLen > 35 
                ? (f.transfereeNameOverflowHint || 'ℹ️ Name exceeds the 35 printed grid cells: It will neatly continue outside the boxes, strictly bounded within printable page margins.')
                : (f.transfereeNameNormalHint || 'Names up to 35 characters are centered inside individual grid boxes.')}
            </p>
          </div>

          <div>
            <label htmlFor="transfereeAddress" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
              {f.transfereeAddress || "Permanent Address"} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <textarea
              id="transfereeAddress"
              name="transfereeAddress"
              rows={2}
              value={formData.transfereeAddress || ''}
              onChange={handleChange}
              placeholder={f.transfereeAddressPlaceholder || "e.g. NO 112/A, GALLE ROAD, DEHIWALA"}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="transfereeNic" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.transfereeNic || "NIC / Passport No."} <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="transfereeNic"
                type="text"
                name="transfereeNic"
                value={formData.transfereeNic || ''}
                onChange={handleChange}
                placeholder={f.transfereeNicPlaceholder || "e.g. 199456789012"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase font-mono tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="transfereeMobile" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.transfereeMobile || "Mobile Number"} <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="transfereeMobile"
                type="tel"
                name="transfereeMobile"
                value={formData.transfereeMobile || ''}
                onChange={handleChange}
                placeholder={f.transfereeMobilePlaceholder || "e.g. 0719876543"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="transfereePostalCode" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.transfereePostalCode || "Postal Code"}
              </label>
              <input
                id="transfereePostalCode"
                type="text"
                inputMode="numeric"
                name="transfereePostalCode"
                value={formData.transfereePostalCode || ''}
                onChange={handleChange}
                maxLength={5}
                placeholder={f.transfereePostalCodePlaceholder || "e.g. 10350"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Regional details for MTA 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="divisionalSecretariat" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.divisionalSecretariat || "Divisional Secretariat"}
              </label>
              <input
                id="divisionalSecretariat"
                type="text"
                name="divisionalSecretariat"
                value={formData.divisionalSecretariat || ''}
                onChange={handleChange}
                placeholder={f.divisionalSecretariatPlaceholder || "e.g. DEHIWALA"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="district" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.district || "District"}
              </label>
              <input
                id="district"
                type="text"
                name="district"
                list="district-list"
                value={formData.district || ''}
                onChange={handleChange}
                placeholder={f.districtPlaceholder || "e.g. COLOMBO"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
              <datalist id="district-list">
                {DISTRICTS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="province" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.province || "Province"}
              </label>
              <input
                id="province"
                type="text"
                name="province"
                list="province-list"
                value={formData.province || ''}
                onChange={handleChange}
                placeholder={f.provincePlaceholder || "e.g. WESTERN"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
              <datalist id="province-list">
                {PROVINCES.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="preferredOffice" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 cursor-pointer">
                {f.preferredOffice || "Preferred District Office for Number Plates"}
              </label>
              <input
                id="preferredOffice"
                type="text"
                name="preferredOffice"
                value={formData.preferredOffice || ''}
                onChange={handleChange}
                placeholder={f.preferredOfficePlaceholder || "e.g. NARAHENPITA or WEWERAHARA"}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Witnesses */}
      <section 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-5 md:p-6 transition-all duration-200" 
        aria-labelledby="section-witness-title"
      >
        <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-xs">
              04
            </div>
            <div>
              <h2 id="section-witness-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {f.section4Title || "4. Witnesses (සාක්ෂිකරුවන් / சாட்சிகள்)"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {f.section4Sub || "Printed on the exact designated dotted lines. Signature lines are intentionally left blank for pen signatures."}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="font-medium">2 Witnesses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Witness 1 (for Seller) */}
          <fieldset className="space-y-3.5 p-4 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <legend className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide px-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {f.witness1Title || "Witness 1 (For Seller / Transferor)"}
            </legend>
            <div>
              <label htmlFor="witness1Name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 cursor-pointer">
                {f.witnessName || "Full Name"}
              </label>
              <input
                id="witness1Name"
                type="text"
                name="witness1Name"
                value={formData.witness1Name || ''}
                onChange={handleChange}
                placeholder={f.witnessNamePlaceholder || "e.g. M. A. SARATH KUMARA"}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label htmlFor="witness1Address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 cursor-pointer">
                {f.witnessAddress || "Address"}
              </label>
              <input
                id="witness1Address"
                type="text"
                name="witness1Address"
                value={formData.witness1Address || ''}
                onChange={handleChange}
                placeholder={f.witnessAddressPlaceholder || "e.g. NO 12, SCHOOL LANE, NAWALA"}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label htmlFor="witness1Nic" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 cursor-pointer">
                {f.witnessNic || "NIC No."}
              </label>
              <input
                id="witness1Nic"
                type="text"
                name="witness1Nic"
                value={formData.witness1Nic || ''}
                onChange={handleChange}
                placeholder={f.witnessNicPlaceholder || "e.g. 197511223344"}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-colors shadow-xs"
              />
            </div>
          </fieldset>

          {/* Witness 2 (for Buyer) */}
          <fieldset className="space-y-3.5 p-4 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <legend className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide px-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {f.witness2Title || "Witness 2 (For Buyer / Transferee)"}
            </legend>
            <div>
              <label htmlFor="witness2Name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 cursor-pointer">
                {f.witnessName || "Full Name"}
              </label>
              <input
                id="witness2Name"
                type="text"
                name="witness2Name"
                value={formData.witness2Name || ''}
                onChange={handleChange}
                placeholder={f.witnessNamePlaceholder || "e.g. K. NIMAL PERERA"}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label htmlFor="witness2Address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 cursor-pointer">
                {f.witnessAddress || "Address"}
              </label>
              <input
                id="witness2Address"
                type="text"
                name="witness2Address"
                value={formData.witness2Address || ''}
                onChange={handleChange}
                placeholder={f.witnessAddressPlaceholder || "e.g. NO 88, STATION ROAD, DEHIWALA"}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label htmlFor="witness2Nic" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 cursor-pointer">
                {f.witnessNic || "NIC No."}
              </label>
              <input
                id="witness2Nic"
                type="text"
                name="witness2Nic"
                value={formData.witness2Nic || ''}
                onChange={handleChange}
                placeholder={f.witnessNicPlaceholder || "e.g. 198299887766"}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs uppercase font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 transition-colors shadow-xs"
              />
            </div>
          </fieldset>
        </div>
      </section>

    </form>
  );
}
