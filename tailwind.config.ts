import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Using CSS variables for colors
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"], // Adding DM Sans to the font family
      },
      animation: {
        // "slide-in": "slideIn 0.5s ease-out", // Custom slide-in animation
        // "slide-out": "slideOut 0.5s ease-in", // Adding slide-out animation
      },
      keyframes: {
        // slideIn: {
        //   "0%": { transform: "translateX(100%)", opacity: "0" },
        //   "100%": { transform: "translateX(0)", opacity: "1" },
        // },
        // slideOut: {
        //   "0%": { transform: "translateX(0)", opacity: "1" },
        //   "100%": { transform: "translateX(100%)", opacity: "0" },
        // },
      },
    },
  },
  plugins: [],
};

export default config;
