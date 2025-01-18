/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#F6F1FB",
        "yellow": "#FFE184",
        "green": "#82C3B8",
        "main": "#B3B4DC",
        "sub": "#7C8BBE",
        "bold": "#313866"
      },
      fontFamily: {
        "gmarket-bold": ["GmarketSans", "sans-serif"],
        "scdream4": ["SCDream4", "sans-serif"],
        "scdream6": ["SCDream6", "sans-serif"]
      },
      fontSize: {
        "page-title": ["30px", { lineHeight: "1.5" }],
        "button": ["24px", { lineHeight: "1.5" }],
        "label": ["24px", { lineHeight: "1.5" }],
        "placeholder": ["24px", { lineHeight: "1.5" }],
        "regular": ["20px", { lineHeight: "1.5" }],
      }
    },
  },
  plugins: [],
}