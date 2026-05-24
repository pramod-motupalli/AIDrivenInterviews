// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        geminiBlue: "#4285f4",
        geminiViolet: "#9b72cb",
        geminiCoral: "#d96570",
        geminiSky: "#00c6ff",
      },
      backgroundImage: {
        "gemini-gradient": "linear-gradient(45deg, #4285f4, #9b72cb, #d96570, #00c6ff)",
      },
    },
  },
  plugins: [],
};
