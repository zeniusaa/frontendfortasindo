/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#56D52C',
          teal: '#0AAE9A',
          cyan: '#0878C9',
          cobalt: '#063EB8',
          white: '#FFFFFF',
          ink: '#101828',
        },
        // Mengganti aksen cyan/blue lama tanpa mengubah warna status kesehatan.
        cyan: {
          400: '#0AAE9A',
          500: '#0878C9',
          600: '#063EB8',
          700: '#063EB8',
          950: '#101828',
        },
        blue: {
          500: '#0878C9',
          600: '#063EB8',
        },
      },
    },
  },
  plugins: [],
}
