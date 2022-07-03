/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/view/**/*.ejs',
    './src/public/javascript/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ],
}