# Sri Lanka Vehicle Transfer Forms Filler (MTA 6A, 6B & MTA 8)

A **Next.js** application built for filling official Sri Lankan Department of Motor Traffic (DMT / RMV) vehicle transfer forms with pixel-perfect box alignment, long name overflow protection, Sri number support, open paper dealer handling, and instant print-ready PDF export. Ready for **Vercel** deployment.

---

## 🚀 Live Local Application

The Next.js application is running locally:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ Key Fixes & Features

### 1. Safe Long Name Overflow Guard (Fix for Bug 1)
- When Sri Lankan names exceed the standard 35 character boxes, characters continue printing outside the box grid as required by DMT submission practices.
- **Printable Area Guard:** Text is automatically scaled and condensed so that it **never exceeds the 588 pt printable page margin**, eliminating physical printer cutoff.

### 2. Full Sri & Vintage Number Support (Fix for Bug 2)
- Added dedicated parsing for Sri numbers (e.g. `5 Sri 2525`, `19 Sri 1234`, `301 Sri 5555`).
- On **MTA 6 Forms (A, A1, B, B1)**:
  - **Set 1 (3 boxes):** Prefix number (e.g. `5`)
  - **Set 2 (3 boxes):** `SRI`
  - **Set 3 (4 boxes):** 4 digits (e.g. `2525`)
- On **MTA 8 Forms (C, C1)**:
  - Formatted into the 10 continuous boxes (e.g. `[5] [ ] [S][R][I] [ ] [2][5][2][5]`).
- Supports modern formats (`WP CAA-2525`) and vintage dash formats (`64-1234`).

### 3. Exact Witness Line Alignment (Fix for Bug 3)
- Witness 1 (Transferor's witness) and Witness 2 (Transferee's witness) now print directly on their allocated dotted baselines (`Name`, `Address`, `NIC`).
- **Signature lines are strictly left 100% BLANK** for hand signing in ink.

### 4. "Open Papers" Dealer Support (Fix for Bug 4)
- Added an **"Open Papers (Leave Blank)"** toggle for car sales and dealership transfers.
- When enabled, all date boxes across MTA 6, MTA 8, and reverse pages remain completely blank, preventing the 14-day DMT penalty from triggering before actual resale.

### 5. Complete One-Day Transfer Filling (Fix for Bug 5)
- All 3 language declaration lines (Sinhala, Tamil, and English) are filled with the vehicle registration number.
- Transferor Name & Date line is bounded within the designated line (`x=340` to `575`) with dynamic font sizing so it never spills past the page border.
- Signature line remains strictly blank for manual signing.

### 6. Clean 10-Page Export (Blank Pages Removed)
- In the original template, pages 2, 4, and 13 were blank spacer pages.
- The app automatically strips all blank pages, delivering a clean 10-page document where every page contains actual forms and instructions.

### 7. Full Tri-Lingual Localization (Sinhala, English & Tamil)
- Complete UI localization with language switcher:
  - **English (EN)**
  - **සිංහල (Sinhala - SI)**
  - **தமிழ் (Tamil - TA)**
- As per Sri Lanka Department of Motor Traffic regulations, official physical forms are completed in English block capital letters; all labels, descriptions, warnings, and formatting guidelines adapt dynamically to the user's chosen language.

### 8. Accessible Dark Mode & OLED Optimization
- High-contrast accessible dark theme conforming to `ui-ux-pro-max` guidelines.
- Persistent user preference in `localStorage` with automatic system theme detection (`prefers-color-scheme`).
- Contrast ratio $\ge 7:1$ in dark mode and $\ge 4.5:1$ in light mode.

### 9. Top-Tier SEO & Civic Discoverability
- **Next.js Metadata API:** OpenGraph, Twitter Cards, localized titles, and multi-lingual keywords (`en`, `si`, `ta`).
- **Structured Data:** JSON-LD schema (`WebApplication` & `GovernmentService`) with full feature list and zero-cost pricing.
- **Dynamic SEO Endpoints:**
  - `/robots.txt` ([app/robots.js](file:///c:/Users/asus/OneDrive/Documents/vehicle%20transfer%20forms%20filler/vehicle-transfer-forms-filler-1/app/robots.js))
  - `/sitemap.xml` ([app/sitemap.js](file:///c:/Users/asus/OneDrive/Documents/vehicle%20transfer%20forms%20filler/vehicle-transfer-forms-filler-1/app/sitemap.js))
  - `/manifest.webmanifest` ([app/manifest.js](file:///c:/Users/asus/OneDrive/Documents/vehicle%20transfer%20forms%20filler/vehicle-transfer-forms-filler-1/app/manifest.js))
- Hreflang alternates (`en-LK`, `si-LK`, `ta-LK`).

---

## ☁️ Deploying to Vercel

This repository is structured for **zero-config Vercel deployment**:

1. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Next.js migration with Sri Lanka vehicle transfer fixes"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New Project"** and select this repository.
4. Framework Preset will be automatically detected as **Next.js**.
5. Click **"Deploy"**.

---

## 🐍 Standalone Python CLI Utility

You can also run batch form filling via Python:

```bash
python fill_forms.py
```
This generates `Filled_Sri_Sample.pdf` with sample data.
