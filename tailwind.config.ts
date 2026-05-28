import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["var(--font-cursive)", "cursive"],
      },
      colors: {
        ink: "#2d3142",
        paper: "#f0f5f3",
        muted: "#a0aaa8",
        line: "#c8deda",
        teal: {
          DEFAULT: "#6b9f9a",
          dark: "#528c88",
          light: "#c8e6e0",
        },
        lavender: {
          DEFAULT: "#9b8bb4",
          light: "#ddd5ef",
        },
      },
    },
  },
  plugins: [],
};
export default config;
