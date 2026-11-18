/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: { ink: '#172033' },
      boxShadow: { card: '0 10px 30px -15px rgba(15, 23, 42, 0.2)' },
    },
  },
  plugins: [],
}
