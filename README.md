# Dump Trailer Rental — Landing Page

Modern, responsive, conversion-focused landing page for a dump trailer
rental service. Built with **React + Vite** and **TailwindCSS**.

## Features

- Fully responsive (mobile, tablet, desktop)
- Hero with strong CTA + dual buttons
- Benefits, How It Works, Trailer cards (7×14×4 and 7×16×4)
- Clear rental rules + pricing example
- Booking form with `useState`, lightweight validation and a live booking
  summary sidebar
- Simulated form submission (no backend) with success state
- Simulated payment CTA section
- FAQ accordion
- Final CTA + footer
- Construction-themed palette (black, dark gray, construction yellow/orange,
  white) with hazard stripe accents

## Stack

- React 18+
- Vite
- TailwindCSS 3
- Pure SVG illustrations (no external image dependencies)

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start dev server (default http://localhost:5173)
npm run build   # production build into ./dist
npm run preview # preview the production build locally
```

## Project structure

```
src/
├── App.jsx                  # Composes the page
├── main.jsx                 # React entry point
├── index.css                # Tailwind layers + global styles
├── data/
│   └── trailers.js          # Trailer catalog (7×14×4, 7×16×4)
└── components/
    ├── Header.jsx           # Sticky nav with mobile drawer
    ├── Hero.jsx             # Above-the-fold + SVG illustration
    ├── Benefits.jsx         # Value-prop cards
    ├── HowItWorks.jsx       # 6-step process
    ├── Trailers.jsx         # Trailer cards section
    ├── TrailerCard.jsx      # Reusable trailer card
    ├── Rules.jsx            # Rental rules + pricing example
    ├── BookingForm.jsx      # Form + validation + summary
    ├── Payment.jsx          # Simulated payment section
    ├── FAQ.jsx              # Accordion
    ├── FinalCTA.jsx         # Pre-footer CTA
    └── Footer.jsx
```

## Pricing rules implemented

- First trailer: **$350**
- Second trailer (same job site / same project): **50% off → $175**
- Disposal / dump fees are **not** included
- Reservation confirmed only after prepayment

## Notes

The form does not submit anywhere — it shows a success message after a
short artificial delay so the page is ready for paid traffic without
requiring a backend.
