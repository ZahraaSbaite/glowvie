import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-soft": "rgb(var(--color-bg-soft) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        brand: {
          DEFAULT: "#D9BEBE",
          dark: "#C29E9E",
          light: "#EAD9D9",
        },
        gold: {
          DEFAULT: "#C9A66B",
          dark: "#B08D4F",
          light: "#E4D2AC",
        },
      },
      fontFamily: {
        display: ["var(--font-heading)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(17,17,17,0.12)",
        card: "0 6px 24px -8px rgba(217,190,190,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.1) rotate(15deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        sparkle: "sparkle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
