/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/view/**/*.ejs'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ],
}