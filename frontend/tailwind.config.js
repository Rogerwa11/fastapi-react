/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          foreground: '#e0e7ff',
        },
      },
      boxShadow: {
        glow: '0 20px 45px -20px rgba(99,102,241,0.45)',
      },
    },
  },
  plugins: [],
}

