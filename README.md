# MindPrint

**A Daily Life Almanac Generator by the Mindroot Foundation**

Each morning, MindPrint generates a single personalized page — your schedule, a virtue to practice, challenges to attempt, and space to reflect in the evening — and delivers it to your printer and inbox before you wake up.

No screen required. Paper is the product.

## Overview

MindPrint is built around a 52-week virtue practice inspired by Benjamin Franklin's original system, expanded into a complete annual cycle organized by four seasonal arcs: Foundation (Winter), Growth (Spring), Strength (Summer), and Reflection (Autumn).

### What the daily page includes

- Today's schedule (pulled from Google Calendar)
- Virtue of the week with Latin name, definition, and daily focus prompt
- Daily and weekly challenges with XP tracking
- Quote of the day from classical thinkers
- Evening reflection section with ruled space for handwriting

### How it works

1. **Overnight:** Cloud function generates your personalized PDF
2. **Morning:** PDF is emailed to your printer (HP ePrint) and your inbox simultaneously
3. **Through the day:** Reference the printed page, check off priorities, attempt challenges
4. **Evening:** Open the companion app to journal your reflections

## Tech Stack

- **Frontend:** React (Vite) — companion app for setup, journaling, and virtue browsing
- **Backend:** Supabase — auth, database, user preferences, journal storage
- **PDF Generation:** HTML template → PDF via Puppeteer (Google Cloud Functions)
- **Email Delivery:** SendGrid/Resend for transactional email at scale
- **Calendar:** Google Calendar API (OAuth per user)
- **Payments:** Stripe ($99/year subscription)
- **Hosting:** Firebase Hosting (mindrootfoundation.org)

## Project Structure

```
mindprint/
├── src/
│   ├── components/     # React components
│   ├── data/           # 52-virtue framework + quotes
│   ├── lib/            # Utilities, API clients, helpers
│   └── pages/          # Route-level page components
├── functions/          # Google Cloud Functions (PDF gen, email, cron)
├── public/             # Static assets
├── package.json
├── vite.config.js
└── firebase.json
```

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run build
firebase deploy
```

## License

Copyright 2025 Mindroot Foundation. All rights reserved.

---

*mindrootfoundation.org*
