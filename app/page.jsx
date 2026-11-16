'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import DemoPresetsCard from '../components/DemoPresetsCard';
import NoticeCard from '../components/NoticeCard';
import VehicleForm from '../components/VehicleForm';
import PdfPreview from '../components/PdfPreview';
import InstructionsGuide from '../components/InstructionsGuide';
import BackToTopProgress from '../components/BackToTopProgress';
import { sriSampleData, modernSampleData, blankFormData } from '../data/sampleData';
import { translations } from '../data/translations';
import { generateFilledVehicleTransferPDF, printPdfBlobDirectly, downloadPdfBlob } from '../utils/pdfFiller';
import { Edit3, Eye, FileText, ShieldCheck, Printer, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [formData, setFormData] = useState(blankFormData);
  const [pageSelection, setPageSelection] = useState('all');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPdfBlob, setCurrentPdfBlob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileTab, setMobileTab] = useState('form');

  // Tri-lingual state (en, si, ta)
  const [currentLang, setCurrentLang] = useState('en');
  // Dark mode state ('light' | 'dark')
  const [theme, setTheme] = useState('light');

  // Smart Auto-Hiding Header and Back to Top Progress state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollYRef = useRef(0);

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

    // 2. Theme initialization (Default to light / white mode on first loading)
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
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

  // Track scroll direction for smart auto-hiding header and calculate scroll progress
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

          // Calculate radial scroll progress (0 to 100%)
          if (maxScroll > 0) {
            const progress = Math.min(100, Math.max(0, (currentScrollY / maxScroll) * 100));
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }

          // Show floating Back to Top button when scrolled past 220px
          setShowBackToTop(currentScrollY > 220);

          // Smart Header Auto-Hide:
          // 1. Always keep header visible when near the top (<= 60px)
          if (currentScrollY <= 60) {
            setIsHeaderVisible(true);
          } else {
            const delta = currentScrollY - lastScrollYRef.current;
            // 2. Hide when scrolling down past threshold
            if (delta > 8) {
              setIsHeaderVisible(false);
            }
            // 3. Show when scrolling up past threshold
            else if (delta < -8) {
              setIsHeaderVisible(true);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="min-h-screen flex flex-col bg-slate-100/90 dark:bg-slate-950 transition-colors duration-200">

      {/* Skip to Main Content Link for Keyboard / Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Header with Navigation, Explanatory Sample Presets, Language Selector, and Dark Mode Toggle */}
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
        isVisible={isHeaderVisible}
        t={t}
      />

      {/* Mobile Tab Switcher */}
      <div
        role="tablist"
        aria-label="Form and Preview Views"
        className={`lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2 sticky z-40 flex gap-2 transition-all duration-300 shadow-xs ${
          isHeaderVisible ? 'top-[69px]' : 'top-0'
        }`}
      >
        <button
          role="tab"
          aria-selected={mobileTab === 'form'}
          onClick={() => setMobileTab('form')}
          className={`flex-1 min-h-[42px] py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'form'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Edit3 className="w-4 h-4" aria-hidden="true" />
          {t?.mobile?.editForm || "Edit Form"}
        </button>
        <button
          role="tab"
          aria-selected={mobileTab === 'preview'}
          onClick={() => setMobileTab('preview')}
          className={`flex-1 min-h-[42px] py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          {t?.mobile?.previewPrint || "Preview & Print"}
        </button>
      </div>

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex-1 w-full focus:outline-none" tabIndex={-1}>
        
        {/* Civic Hero / Intro Trust Banner */}
        <section className="mb-7 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 shadow-sm border border-blue-800/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
              Department of Motor Traffic (DMT / RMV) Submission Standard
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Official Sri Lanka Vehicle Transfer Forms Auto-Filler
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              Generate pixel-perfect print overlays for Form MTA 6A, MTA 6B, MTA 8, and MTA 6B1. Fill the form, preview the exact alignment live on your screen, and print directly to your physical printer.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-3 border-t border-blue-800/60 text-xs text-blue-200">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                100% Free & Private (Runs in Browser)
              </span>
              <span className="hidden sm:inline text-blue-700">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Printer className="w-4 h-4 text-sky-400" aria-hidden="true" />
                Clean 10-Page Direct Print
              </span>
              <span className="hidden sm:inline text-blue-700">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-4 h-4 text-amber-400" aria-hidden="true" />
                Vintage Sri & Modern Number Support
              </span>
            </div>
          </div>
        </section>

        {/* Dedicated Quick Fill Sample Demos Card with crystal-clear explanations */}
        <DemoPresetsCard
          onLoadSriSample={handleLoadSriSample}
          onLoadModernSample={handleLoadModernSample}
          onClear={handleClear}
          t={t}
        />

        {/* Official DMT Guidelines Notice */}
        <NoticeCard t={t} />

        {/* Main Workstation Grid: Form (Col 7) and PDF Preview (Col 5) */}
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

        {/* Complete Instructions & Required Documents Help Guide */}
        <InstructionsGuide t={t} />
      </main>

      {/* Accessible Civic Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 text-xs py-8 border-t border-slate-800 dark:border-slate-800/80 mt-14 text-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-200 dark:text-slate-200 text-sm">
            {t?.footer?.title || "Sri Lanka Department of Motor Traffic (DMT / RMV) Vehicle Transfer Forms Filler"}
          </p>
          <p className="text-slate-400 dark:text-slate-400 text-xs">
            {t?.footer?.subtitle || "Official Forms MTA 6A, MTA 6B & MTA 8 (Form C & C1) | Clean 10-Page Output"}
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-[11px] max-w-2xl mx-auto pt-1 leading-normal">
            {t?.footer?.disclaimer || "Civic tool built for Sri Lankan vehicle buyers, sellers, and auto dealers. All official forms must be submitted to DMT / RMV district offices."}
          </p>
          <p className="text-slate-600 dark:text-slate-600 text-[10px] pt-1">
            Privacy First: All data entered is processed locally inside your browser memory. No names, NICs, or vehicle numbers are ever stored or uploaded.
          </p>
        </div>
      </footer>

      {/* Floating Back to Top Button with Circular Scroll Progress */}
      <BackToTopProgress scrollProgress={scrollProgress} isVisible={showBackToTop} />
    </div>
  );
}
