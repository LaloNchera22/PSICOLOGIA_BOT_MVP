import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["var(--font-cursive)", "cursive"],
      },
      colors: {
        ink: "#0a0a0a",
        paper: "#ffffff",
        muted: "#888888",
        accent: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          light: "#A78BFA",
        },
        accent2: "#00DDB3",
      },
    },
  },
  plugins: [],
};
export default config;
