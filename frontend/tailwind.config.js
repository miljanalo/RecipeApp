/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        primary: '#668363',

        primarydark: '#556f53',

        textsiva: '#292524',

        textsvetlosiva: '#4B5563'

      }
    },
  },
  plugins: [],
}

