/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#FFD700", // Light gold
          500: "#DAA520", // Medium gold
        },
      },
    },
  },
  plugins: [],
};