/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // FAGU - HOME SERVICES brand palette (Brand Book 2026)
        // Names below match the official palette in the brand book.
        fagu: {
          authority: "#3E3E3E", // Autoridade — main dark / text
          urban: "#979797",     // Urbano — secondary text
          horizon: "#E2E2E2",   // Horizonte — soft backgrounds / dividers
          flow: "#EB7231",      // Fluxo — primary accent / CTA
          ascension: "#FFFFFF", // Ascensão — white
          foundation: "#D75227", // Fundamento — hover / strong accent
        },
        // Backward-compatible "brand" tokens used across all components.
        // They now point to the FAGU palette so existing classes keep working.
        brand: {
          // Old "yellow" CTA -> Fluxo (primary orange)
          yellow: "#EB7231",
          // Old "orange" accent -> Fundamento (deeper orange)
          orange: "#D75227",
          // Old industrial near-black -> Autoridade
          dark: "#3E3E3E",
          // Strict palette mapping (official colors only)
          gray: "#979797", // Urbano
          gray2: "#E2E2E2", // Horizonte
          light: "#E2E2E2", // Horizonte
        },
      },
      fontFamily: {
        // ZALANDO substitute for body/text — Manrope is the closest free
        // alternative to Zalando Sans (modern, clean, geometric grotesque).
        sans: ["Manrope", "Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        // ALTA substitute for titles — Playfair Display gives the same
        // refined, premium, "líder/confiável" feel of the brand book.
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      backgroundImage: {
        // Subtle FAGU-themed diagonal accent (replaces the construction
        // hazard yellow/black stripes from the previous brand).
        "hazard-stripes":
          "repeating-linear-gradient(45deg, #EB7231 0 14px, #3E3E3E 14px 28px)",
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(235, 114, 49, 0.45)",
      },
    },
  },
  plugins: [],
};
