/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,jsx,mjs,ts,tsx}',
    './layouts/**/*.{vue,js,jsx,mjs,ts,tsx}',
    './pages/**/*.{vue,js,jsx,mjs,ts,tsx}',
    './plugins/**/*.{js,ts,mjs}',
    './composables/**/*.{js,ts,mjs}',
    './utils/**/*.{js,ts,mjs}',
    './{A,a}pp.{vue,js,jsx,mjs,ts,tsx}',
    './{E,e}rror.{vue,js,jsx,mjs,ts,tsx}',
    './app.config.{js,ts,mjs}'
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif']
      }
    }
  },
  plugins: []
}
