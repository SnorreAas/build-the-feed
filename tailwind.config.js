/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#242424",
        default: "#000000",
        "brand-blue": "#2F3AB1",
      },
      backgroundColor: {
        "light-blue": "#EBECFC",
        "primary-blue": "#3B49DF",
        "page-light": "#F5F5F5",
        "page-dark": "#000",
        "container-light": "#ffffff",
        "container-dark": "#171717",
      },
      outline: {
        "brand-blue": "solid 1px #2F3AB1",
      },
      boxShadow: {
        outline: "0 0 0 1px rgb(23 23 23 / 10%)",
      },
    },
  },
  plugins: [],
};
