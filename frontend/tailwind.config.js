// const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#e8f1fa",
          100: "#e8f1fa",
          200: "#c7ddf2",
          300: "#c7ddf2",
          400: "#8ebae5",
          500: "#8ebae5",
          600: "#407fb7",
          700: "#407fb7",
          800: "#00549f",
          900: "#00549f",
        },
      },
    },
  },
  plugins: [],
};
