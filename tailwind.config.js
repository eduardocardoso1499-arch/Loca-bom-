/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf3",
          100: "#d6f7e1",
          500: "#16a34a",
          600: "#15803d",
          700: "#166534",
        },
      },
    },
  },
  plugins: [],
};
