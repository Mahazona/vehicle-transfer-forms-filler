'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import NoticeCard from '../components/NoticeCard';
import VehicleForm from '../components/VehicleForm';
import PdfPreview from '../components/PdfPreview';
import { sriSampleData, modernSampleData, blankFormData } from '../data/sampleData';
import { translations } from '../data/translations';
import { generateFilledVehicleTransferPDF, printPdfBlobDirectly, downloadPdfBlob } from '../utils/pdfFiller';
import { Edit3, Eye } from 'lucide-react';

export default function HomePage() {
  const [formData, setFormData] = useState(sriSampleData);
  const [pageSelection, setPageSelection] = useState('all');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPdfBlob, setCurrentPdfBlob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileTab, setMobileTab] = useState('form');

  // Tri-lingual state (en, si, ta)
  const [currentLang, setCurrentLang] = useState('en');
  // Dark mode state ('light' | 'dark')
  const [theme, setTheme] = useState('light');

  const debounceTimerRef = useRef(null);

  // Initialize language and theme on client mount
  useEffect(() => {
    // 1. Language detection (URL param -> localStorage -> default 'en')
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      const storedLang = localStorage.getItem('lang');
      if (urlLang && ['en', 'si', 'ta'].includes(urlLang)) {
        setCurrentLang(urlLang);
      } else if (storedLang && ['en', 'si', 'ta'].includes(storedLang)) {
        setCurrentLang(storedLang);
      }
    } catch (e) {
      console.error('Error reading language preference:', e);
    }

    // 2. Dark mode detection
    try {
      const storedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error reading theme preference:', e);
    }
  }, []);

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
    try {
      localStorage.setItem('lang', newLang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url);
    } catch (e) {
      console.error('Error saving language preference:', e);
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error toggling theme:', e);
    }
  };

  const t = translations[currentLang] || translations.en;

  const renderPdf = async (dataToUse = formData, selection = pageSelection) => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateFilledVehicleTransferPDF(dataToUse, {
        pdfUrl: '/6A_6B_MAT8.pdf',
        pageSelection: selection,
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setCurrentPdfBlob(blob);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newUrl = URL.createObjectURL(blob);
      setPreviewUrl(newUrl);
    } catch (err) {
      console.error('Error rendering PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    renderPdf();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const handleFormChange = (newData) => {
    setFormData(newData);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      renderPdf(newData, pageSelection);
    }, 550);
  };

  const handlePageSelectionChange = (newSelection) => {
    setPageSelection(newSelection);
    renderPdf(formData, newSelection);
  };

  const handleLoadSriSample = () => {
    setFormData(sriSampleData);
    renderPdf(sriSampleData, pageSelection);
  };

  const handleLoadModernSample = () => {
    setFormData(modernSampleData);
    renderPdf(modernSampleData, pageSelection);
  };

  const handleClear = () => {
    setFormData(blankFormData);
    renderPdf(blankFormData, pageSelection);
  };

  const handlePrint = () => {
    if (currentPdfBlob) {
      printPdfBlobDirectly(currentPdfBlob);
    } else {
      renderPdf().then(() => {
        if (currentPdfBlob) printPdfBlobDirectly(currentPdfBlob);
      });
    }
  };

  const handleDownload = () => {
    if (!currentPdfBlob) return;
    const cleanVeh = (formData.vehicleNumber || 'Vehicle').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `DMT_Transfer_${cleanVeh}_${pageSelection.toUpperCase()}.pdf`;
    downloadPdfBlob(currentPdfBlob, filename);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 transition-colors duration-200">

      {/* Skip to Main Content Link for Keyboard / Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Header with Navigation, Demo Presets, Language Selector, and Dark Mode Toggle */}
      <Header
        onLoadSriSample={handleLoadSriSample}
        onLoadModernSample={handleLoadModernSample}
        onClear={handleClear}
        onPrint={handlePrint}
        onDownload={handleDownload}
        isGenerating={isGenerating}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        t={t}
      />

      {/* Mobile Tab Switcher */}
      <div
        role="tablist"
        aria-label="Form and Preview Views"
        className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 sticky top-[69px] z-40 flex gap-2 transition-colors"
      >
        <button
          role="tab"
          aria-selected={mobileTab === 'form'}
          onClick={() => setMobileTab('form')}
          className={`flex-1 min-h-[40px] py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${mobileTab === 'form'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
          {t?.mobile?.editForm || "Edit Form"}
        </button>
        <button
          role="tab"
          aria-selected={mobileTab === 'preview'}
          onClick={() => setMobileTab('preview')}
          className={`flex-1 min-h-[40px] py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${mobileTab === 'preview'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          {t?.mobile?.previewPrint || "Preview & Print"}
        </button>
      </div>

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full focus:outline-none" tabIndex={-1}>
        <NoticeCard t={t} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className={`lg:col-span-7 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
            <VehicleForm
              formData={formData}
              onChange={handleFormChange}
              t={t}
            />
          </div>

          {/* PDF Preview & Print Column */}
          <div className={`lg:col-span-5 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <PdfPreview
              previewUrl={previewUrl}
              pageSelection={pageSelection}
              onPageSelectionChange={handlePageSelectionChange}
              onPrint={handlePrint}
              onDownload={handleDownload}
              isGenerating={isGenerating}
              onRefresh={() => renderPdf(formData, pageSelection)}
              t={t}
            />
          </div>
        </div>
      </main>

      {/* Accessible Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 text-xs py-7 border-t border-slate-800 dark:border-slate-800/80 mt-12 text-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-200 dark:text-slate-200 text-sm">
            {t?.footer?.title || "Sri Lanka Department of Motor Traffic (DMT / RMV) Vehicle Transfer Forms Filler"}
          </p>
          <p className="text-slate-400 dark:text-slate-400 text-xs">
            {t?.footer?.subtitle || "Official Forms MTA 6A, MTA 6B & MTA 8 (Form C & C1) | Clean 10-Page Output"}
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-[11px] max-w-2xl mx-auto pt-1 leading-normal">
            {t?.footer?.disclaimer || "Civic tool built for Sri Lankan vehicle buyers, sellers, and auto dealers. All official forms must be submitted to DMT / RMV district offices."}
          </p>
        </div>
      </footer>
    </div>
  );
}
