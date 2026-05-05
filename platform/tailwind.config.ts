import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Paleta oficial — Brand Book 2026 (Belisa Design)
      colors: {
        "brand-orange": "#EB7231",      // Fluxo — CTA primária
        "brand-dark-orange": "#D75227", // Fundamento — hover forte
        "brand-dark": "#3E3E3E",        // Autoridade — texto principal
        "brand-gray": "#979797",        // Urbano — texto secundário
        "brand-light": "#E2E2E2",       // Horizonte — fundos suaves
        "brand-white": "#FFFFFF",       // Ascensão — base clara
        // aliases usados na landing (manter compatibilidade)
        "brand-yellow": "#EB7231",
      },
      fontFamily: {
        // Playfair Display — headings (font-display)
        display: ["Playfair Display", "Georgia", "serif"],
        // Manrope — body copy (font-body / font-sans)
        body: ["Manrope", "system-ui", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-dark": "radial-gradient(circle, #4a4a4a 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
