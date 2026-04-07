/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0A0F2E",
        },
        korolev: {
          bg: "#0b0421",
          panel: "#1a0b2e",
          wave: "#1a0a2e",
        },
        accent: {
          gold: "#F5B042",
          silver: "#C0C0C0",
          copper: "#F5B042",
          tan: "#b07c57",
          peach: "#d9905b",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
