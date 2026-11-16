import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vehicle-transfer-forms-filler.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sri Lanka Vehicle Transfer Forms Filler (MTA 6A, 6B & MTA 8) | Official DMT RMV Auto-Filler',
    template: '%s | Sri Lanka Vehicle Transfer Forms Filler',
  },
  description: 'Free online auto-filler for official Sri Lanka Department of Motor Traffic (DMT / RMV) Vehicle Transfer Forms MTA 6A, MTA 6B, and MTA 8 (CMT 8). Supports Sri numbers (e.g. 5 Sri 2525), long name overflow protection, Open Papers for car sales, and direct print-ready clean 10-page PDF generation.',
  keywords: [
    'Sri Lanka vehicle transfer form',
    'MTA 6A form download',
    'MTA 6B form Sri Lanka',
    'MTA 8 form pdf',
    'CMT 8 form Sri Lanka',
    'RMV vehicle transfer form',
    'DMT Sri Lanka vehicle transfer',
    'Sri Lanka motor traffic transfer paper',
    '5 Sri vehicle number transfer',
    'open papers vehicle transfer Sri Lanka',
    'one day vehicle transfer Sri Lanka',
    'වාහන පැවරීමේ ආකෘති පත්‍ර',
    'මෝටර් රථ ප්‍රවාහන දෙපාර්තමේන්තුව',
    'MTA 6 පෝරමය',
    'MTA 8 පෝරමය',
    'வாகன உரிமை பரிமாற்ற படிவம்',
    'மோட்டார் போக்குவரத்து திணைக்களம்',
    'MTA 6 படிவம்',
    'MTA 8 படிவம்'
  ],
  authors: [{ name: 'Sri Lanka Civic Tools' }],
  creator: 'Sri Lanka Vehicle Transfer Forms Filler',
  publisher: 'Sri Lanka Vehicle Transfer Forms Filler',
  category: 'Government & Civic Utility',
  applicationName: 'Sri Lanka Vehicle Transfer Forms Filler',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-LK': `${siteUrl}?lang=en`,
      'si-LK': `${siteUrl}?lang=si`,
      'ta-LK': `${siteUrl}?lang=ta`,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    alternateLocale: ['si_LK', 'ta_LK'],
    url: siteUrl,
    siteName: 'Sri Lanka Vehicle Transfer Forms Filler',
    title: 'Sri Lanka Vehicle Transfer Forms Filler (MTA 6A, 6B & MTA 8)',
    description: 'Auto-fill and print official Sri Lanka DMT Vehicle Transfer Forms (MTA 6A, 6B & MTA 8). Full support for Sri numbers, open papers, and safe name overflow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Lanka Vehicle Transfer Forms Filler (MTA 6A, 6B & MTA 8)',
    description: 'Print-ready Sri Lanka vehicle transfer forms auto-filler with Sri numbers, open papers, and clean 10-page output.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'z9IrJpZqu_7a6xs48xP1MY4HRtx8cFuOoA29e_Zf9J8',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sri Lanka Vehicle Transfer Forms Filler',
  alternateName: [
    'ශ්‍රී ලංකා මෝටර් රථ පැවරුම් පත්‍ර පිරවුම් පද්ධතිය',
    'இலங்கை வாகன உரிமை பரிமாற்ற படிவங்கள் நிரப்பி',
    'DMT MTA 6 & MTA 8 Form Filler'
  ],
  url: siteUrl,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires modern web browser with PDF viewing support',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'LKR',
  },
  inLanguage: ['en', 'si', 'ta'],
  description: 'Online auto-filler for official Sri Lanka Department of Motor Traffic (DMT / RMV) Vehicle Transfer Forms MTA 6A, MTA 6B, and MTA 8 (CMT 8) with Sri number support and direct printer output.',
  featureList: [
    'Pixel-perfect alignment on official MTA 6A, 6B, and MTA 8 forms',
    'Full support for vintage Sri numbers (e.g. 5 Sri 2525) and modern numbers',
    'Safe long name overflow guard strictly bounded inside printable margins',
    'Open Papers support for car sales with dates left blank',
    'One-Day Transfer declaration filling across Sinhala, Tamil, and English',
    'Clean 10-page export with zero blank pages',
    'Direct browser printing to device printers',
    'Complete tri-lingual interface (Sinhala, English, Tamil)',
    'Accessible dark and light mode'
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          id="structured-data-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen transition-colors duration-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
