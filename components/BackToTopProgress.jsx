'use client';

import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopProgress({ scrollProgress = 0, isVisible = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circle calculations
  const size = 48;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2; // radius ~ 20.5
  const circumference = 2 * Math.PI * radius; // ~ 128.8
  const clampedProgress = Math.min(100, Math.max(0, scrollProgress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
    >
      <div className="relative group flex items-center justify-center">
        {/* Hover Tooltip showing percentage */}
        <div
          role="tooltip"
          className="absolute -top-10 right-0 px-2.5 py-1 rounded-lg bg-slate-900/90 dark:bg-slate-800/95 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-md border border-slate-700/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none flex items-center gap-1.5 backdrop-blur-xs"
        >
          <span>Back to Top</span>
          <span className="text-blue-400 font-mono font-bold">
            {Math.round(clampedProgress)}%
          </span>
        </div>

        {/* Circular Progress & Back to Top Trigger Button */}
        <button
          type="button"
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`Scroll back to top (${Math.round(clampedProgress)}% page progress)`}
          title="Scroll back to top"
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 shadow-lg hover:shadow-xl dark:shadow-slate-950/60 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-950 transition-all duration-200 cursor-pointer group-hover:scale-105 active:scale-95"
        >
          {/* Radial SVG Progress Meter */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
          >
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-200/80 dark:text-slate-800"
            />
            {/* Progress Stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-blue-600 dark:text-blue-400 transition-[stroke-dashoffset] duration-150 ease-out"
            />
          </svg>

          {/* Central Arrow Icon */}
          <ArrowUp
            className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-y-0.5 transition-all duration-200"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
