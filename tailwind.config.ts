import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["var(--font-cursive)", "cursive"],
      },
      colors: {
        ink: "#1a1a1a",
        paper: "#fafaf7",
        muted: "#8a8a85",
        line: "#e8e6df",
      },
    },
  },
  plugins: [],
};
export default config;
