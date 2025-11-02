/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.html",
    "./controllers/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'gold': {
          400: '#F4D03F',
          500: '#D4AF37',
          600: '#B7950B'
        },
        'navy': {
          700: '#1B4F72',
          600: '#2E86AB'
        }
      }
    }
  },
  plugins: []
}
