# 🛡️ United Beverages — Safety Induction Assessment

> A fully branded, interactive safety assessment web app built for United Beverages Share Company by **TPM United**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tpmunited/ub-safety-app)

---

## 🌐 Live App
Deployed on Vercel — accessible from any device, anywhere.

---

## ✨ Features

- **24 questions** across 7 safety sections (Golden Safety Rules)
- **Instant feedback** with explanations after each answer
- **20-minute countdown timer**
- **75% pass mark** with clear pass/fail verdict
- **🏆 Printable certificate** on passing
- **🔒 Supervisor PIN** to unlock full breakdown & question review
- **📊 Google Sheets integration** — results auto-saved in real time for HR
- **100% offline capable** — assessment works without internet
- Fully branded with **United Beverages + TPM United** logos

---

## 🗂️ Safety Sections Covered

| # | Section | Questions |
|---|---------|-----------|
| 1 | 🦺 Personal Protective Equipment (PPE) | 5 |
| 2 | 🚦 Traffic Safety | 3 |
| 3 | ⚠️ Alcohol & Drug-Free Workplace | 3 |
| 4 | ⚗️ Hazardous Chemicals | 4 |
| 5 | ⚙️ Machine Safety & Lockout/Tagout | 3 |
| 6 | 📋 Permit to Work | 3 |
| 7 | 🚨 Emergency Procedures | 3 |

---

## 🚀 Getting Started (Development)

```bash
npm install
npm start
```

## 🏗️ Build for Production

```bash
npm run build
```

---

## ⚙️ Configuration

Edit `src/data.js` to update:
- `SHEETS_URL` — your Google Apps Script web app URL
- `SUPERVISOR_PIN` — change the default PIN (`1234`)
- `PASS_MARK` — adjust pass percentage (default `75`)
- `TOTAL_SECONDS` — adjust time limit (default `1200` = 20 min)

---

## 📋 Google Sheets Setup

1. Create a Google Sheet
2. Go to **Extensions → Apps Script**
3. Paste the webhook script and deploy as a Web App
4. Copy the URL into `SHEETS_URL` in `src/data.js`

Each assessment attempt logs: timestamp, name, score, pass/fail, time taken, and per-section scores.

---

## 🏢 About

**United Beverages Share Company** — Leading beverage manufacturer committed to safety, quality, and operational excellence.

**TPM United** — *Driving Excellence* | Safety & Digital Innovation Division
