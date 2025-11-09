const typo = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {},
  },

  future: {
    disableColorCorrectness: true,
  },
  corePlugins: {
    textColor: false,
    backgroundColor: false,
    borderColor: false,
    divideColor: false,
    placeholderColor: false,
    accentColor: false,
  },

  plugins: [typo],
};
