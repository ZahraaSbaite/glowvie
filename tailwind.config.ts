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
        plum: {
          DEFAULT: "#2A1621",
          light: "#4A2A3A",
        },
        rose: "#E39A9C",
        peach: "#F4C3A8",
        lilac: "#CDB6E6",
      },
      fontFamily: {
        display: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(17,17,17,0.12)",
        card: "0 6px 24px -8px rgba(217,190,190,0.35)",
        glow: "0 18px 50px -14px rgba(227,154,156,0.65)",
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
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "glow-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, -8%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-5%, 6%, 0) scale(0.95)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        sparkle: "sparkle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "glow-flow": "glow-flow 8s linear infinite",
        drift: "drift 18s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
