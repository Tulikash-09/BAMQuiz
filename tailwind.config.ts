import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      colors: {
        paper: "#FAFAF7",
        ink: "#1A1A2E",
        "sq-red": "#E8272A",
        "sq-green": "#5CBF2A",
        "sq-yellow": "#F5C842",
        surface: "#EEEEEA",
        card: "#FFFFFF",
        muted: "#666666",
      },
      fontFamily: {
        hand: ["var(--font-hand)", "cursive"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
      },
      boxShadow: {
        sketch: "3px 3px 0px #1A1A2E",
        "sketch-sm": "2px 2px 0px #1A1A2E",
        "sketch-hover": "4px 4px 0px #1A1A2E",
        "sketch-green": "3px 3px 0px #5CBF2A",
        "sketch-red": "3px 3px 0px #E8272A",
        "sketch-yellow": "3px 3px 0px #d4a800",
      },
    },
  },
  plugins: [],
};
export default config;
