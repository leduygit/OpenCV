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
    },
  },
  plugins: [],
};

export default config;
