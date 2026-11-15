/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#050B16", 900: "#0A1424", 850: "#0E1A2E", 800: "#13223A", 700: "#1D3150", 600: "#2A4468" },
        cyan: { 300: "#8BE3F7", 400: "#4FD1EE", 500: "#22B8DA" },
        ok: "#3DDC84",
        warn: "#F5B547",
        crit: "#FF5C61",
        sim: "#B79BFF",
      },
      fontFamily: {
        display: ['"Archivo"', '"Arial Narrow"', "Arial", "sans-serif"],
        sans: ['"IBM Plex Sans"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
