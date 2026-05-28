/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ibm: {
          blue:   "#1a56db",
          purple: "#7e3af2",
          green:  "#0e9f6e",
          amber:  "#e3a008",
          dark:   "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "bounce-dot": "bounce 1s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "ibm": "0 8px 24px rgba(26, 86, 219, 0.25)",
        "card": "0 1px 3px rgba(0,0,0,0.06)",
        "card-hover": "0 12px 32px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "xl2": "20px",
      },
    },
  },
  plugins: [],
};
