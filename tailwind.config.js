module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        glass: {
          'dark': 'rgba(50, 50, 75, 0.64)',
          'light': 'rgba(255, 255, 255, 0.64)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
