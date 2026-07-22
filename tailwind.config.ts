import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f5f5f5",
        paper: "#0a0a0a",
        cloud: "#141414",
        line: "#262626",
        muted: "#737373",
        accent: "#c5a880",
        accentLight: "#d4bc9a",
        accentDark: "#a08060",
        danger: "#ef4444",
        success: "#22c55e",
        surface: "#111111",
        "surface-2": "#1a1a1a",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "slide-right": "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(197, 168, 128, 0.15)",
        "glow-lg": "0 0 40px rgba(197, 168, 128, 0.2)",
        card: "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
