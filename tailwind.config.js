/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: 'var(--brand-color)',
        'brand-hover': 'var(--brand-color-hover)',
        dark: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          tertiary: '#9CA3AF',
        },
      },
      backgroundColor: {
        'dark-primary': '#1A1B1F',
        'dark-secondary': '#27282C',
        'dark-tertiary': '#2A2B2F',
      },
      textColor: {
        'dark-primary': '#FFFFFF',
        'dark-secondary': '#A1A1AA',
        'dark-tertiary': '#9CA3AF',
      },
      borderColor: {
        'dark-border': '#27282C',
      },
      transitionProperty: {
        'none': 'none',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
