/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
      },
      width: {
        '1/10': '10%',
      },
      boxShadow: {
        'pixel': 'inset 2px 2px 0 #8b7157, inset -2px -2px 0 #f4e3c2, 2px 2px 0 #8b7157, -2px -2px 0 #f4e3c2',
      },
      colors: {
        beige: '#d9c4a0',
        'beige-dark': '#bda087',
      },
    },
  },
  plugins: [],
}