import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "outline-variant": "#c4c7c7",
        "on-error-container": "#93000a",
        "on-surface": "#1a1c1c",
        "surface": "#f9f9f9",
        "secondary": "#5d5f5f",
        "secondary-fixed-dim": "#c6c6c6",
        "primary-fixed-dim": "#c8c6c5",
        "surface-tint": "#5f5e5e",
        "error-container": "#ffdad6",
        "secondary-fixed": "#e2e2e2",
        "on-tertiary-container": "#5b9300",
        "primary-fixed": "#e5e2e1",
        "on-tertiary": "#ffffff",
        "surface-container-highest": "#e2e2e2",
        "outline": "#747878",
        "tertiary-fixed": "#9ffb06",
        "secondary-container": "#dddddd",
        "on-background": "#1a1c1c",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "inverse-on-surface": "#f1f1f1",
        "inverse-primary": "#c8c6c5",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "on-primary-container": "#858383",
        "surface-container-high": "#e8e8e8",
        "tertiary-container": "#102000",
        "background": "#f9f9f9",
        "on-primary-fixed-variant": "#474646",
        "surface-container": "#eeeeee",
        "on-secondary-fixed-variant": "#454747",
        "primary-container": "#1c1b1b",
        "on-surface-variant": "#444748",
        "on-tertiary-fixed": "#102000",
        "on-primary-fixed": "#1c1b1b",
        "tertiary-fixed-dim": "#8bdc00",
        "on-tertiary-fixed-variant": "#2f4f00",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed": "#1a1c1c",
        "on-secondary-container": "#606161",
        "on-secondary": "#ffffff",
        "inverse-surface": "#2f3131",
        "primary": "#000000",
        "tertiary": "#000000",
        "surface-variant": "#e2e2e2"
      },
      fontFamily: {
        "headline": ["var(--font-manrope)"],
        "body": ["var(--font-inter)"],
        "label": ["var(--font-inter)"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    // Next.js standard features
  ],
};
export default config;
