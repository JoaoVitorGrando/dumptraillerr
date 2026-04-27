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
        // Brand palette: construction yellow + heavy industrial dark
        brand: {
          yellow: "#FFB800",
          orange: "#FF7A00",
          dark: "#0E0E10",
          gray: "#1A1A1D",
          gray2: "#2A2A2E",
          light: "#F5F5F7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        display: ["'Barlow Condensed'", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hazard-stripes":
          "repeating-linear-gradient(45deg, #FFB800 0 14px, #0E0E10 14px 28px)",
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(255, 184, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
