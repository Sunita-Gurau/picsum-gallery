/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          1: '#A5A3AE4D',
          2: '#F3F4F8',
          3: '#23272E',
          4: '#8B909A',
          5: '#DBDADE',
        },
      },
    },
  },
  plugins: [],
}
