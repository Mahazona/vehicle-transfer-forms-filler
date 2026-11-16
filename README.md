# 🚗 Sri Lanka Vehicle Transfer Forms Filler (MTA 6 & MTA 8)

A free, easy-to-use web tool to auto-fill official **Department of Motor Traffic (DMT / RMV)** vehicle transfer forms in Sri Lanka. It creates a clean, pixel-perfect, 10-page print-ready PDF ready for physical signature and submission.

---

## 🌟 Why Use This Tool?

- **No Handwriting Mistakes:** Type your details once and get perfectly aligned official forms.
- **Supports All Number Plates:** Handles vintage numbers (e.g. `5 Sri 2525`, `19 Sri 1234`) and modern provincial plates (e.g. `WP CAA-4589`).
- **Fits Long Sri Lankan Names:** Long ge-names automatically wrap and abbreviate into official initials + surname without spilling off the paper.
- **"Open Papers" for Car Sales:** Optional toggle to keep dates blank for vehicle dealerships and brokers.
- **100% Private & Secure:** All PDF processing happens inside your browser. No names, NIC numbers, or vehicle details are ever saved or uploaded to any server.
- **Tri-Lingual Support:** Available in **English**, **සිංහල (Sinhala)**, and **தமிழ் (Tamil)** with Dark Mode.

---

## 📋 How To Use (Step-by-Step)

1. **Open the App:** Visit the live website or run it locally.
2. **Enter Details:**
   - Vehicle Registration Number (e.g., `5 Sri 2525` or `WP CAA-4589`).
   - Current Owner (Seller / Transferor) Name, Address, and NIC.
   - New Owner (Buyer / Transferee) Name, Address, and NIC.
   - Two Witnesses (Name, Address, and NIC).
   *(Tip: Click **"Try Sample Data"** in the top bar to test with pre-filled examples!)*
3. **Review the Live Preview:** View your filled forms in real-time on the right side of the screen.
4. **Print or Download:** Click **"Print Forms"** to send directly to your printer, or **"Download PDF"** to save the clean 10-page document.
5. **Sign with Pen:** Sign with blue/black pen on the designated signature lines (kept blank for security) and submit to the DMT office.

---

## 📂 Forms Included in the 10-Page PDF

| Page | Form Name | Purpose |
| :--- | :--- | :--- |
| **Pages 1 & 2** | **Form MTA 6A & A1** | Notice of transfer sent to the Commissioner General of Motor Traffic within 14 days. |
| **Pages 3 to 6** | **Form MTA 6B & B1** | Transferee copies, One-Day Transfer declaration, and official instructions. |
| **Pages 7 to 10** | **Form MTA 8 (C & C1)** | Application for registration on transfer, including reverse page declarations. |

---

## 📑 Required Documents to Take to DMT / RMV

Before visiting the Department of Motor Traffic (Narahenpita or District Secretariat), ensure you have:

- [ ] Printed & signed **MTA 6 Forms (Parts A, A1, B, B1)**
- [ ] Printed & signed **MTA 8 Forms (Form C & C1)**
- [ ] Original **Certificate of Registration (CR / වාහන පොත)** (unlaminated and undamaged)
- [ ] Valid **Revenue License (ආදායම් බලපත්‍රය)** + 1 clear photocopy
- [ ] Certified photocopies of **National Identity Cards (NIC)** of both seller and buyer
- [ ] **Finance / Leasing Clearance Letter (CMT 63)** *(only if vehicle was under lease or bank loan)*
- [ ] **Weight Certificate (CMT 130)** *(only for dual-purpose vans, lorries, trucks, or commercial vehicles)*
- [ ] **One-Day Service Affidavit / Consent Letter** *(only if applying for One-Day service and seller cannot attend in person)*

---

## 💻 How to Run Locally

If you are a developer or want to run this project on your own computer:

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher)

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/Mahazona/vehicle-transfer-forms-filler.git

# 2. Go to the project folder
cd vehicle-transfer-forms-filler

# 3. Install dependencies
npm install

# 4. Start the local server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

---

## ☁️ Deploy to Vercel (Free Hosting)

1. Fork or push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select this repository and click **"Deploy"**. (Next.js is detected automatically with zero configuration).

---

## 📄 License & Disclaimer

- **License:** Open-source under the MIT License. Free for personal, civic, and commercial use.
- **Disclaimer:** This is an independent civic utility built to assist Sri Lankan vehicle owners. All completed forms must be signed and officially submitted to the Department of Motor Traffic (DMT / RMV) in accordance with the Motor Traffic Act.
