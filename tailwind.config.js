/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#00142b',
          900: '#001c3b',
          850: '#00244a',
          800: '#0b1c30',
          700: '#1a3a63',
          600: '#294771',
          500: '#425f8a',
          400: '#6480b0',
        },
        emerald: {
          950: '#002113',
          900: '#005236',
          800: '#006c49',
          700: '#00714d',
          500: '#10b981',
          400: '#4edea3',
          100: '#d1fae5',
          50: '#ecfdf5',
        },
        slate: {
          850: '#172033',
        }
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'sans-serif'],
        serif: ['"Source Serif 4"', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'academic': '0 4px 20px -2px rgba(0, 28, 59, 0.08)',
        'academic-lg': '0 10px 30px -5px rgba(0, 28, 59, 0.12)',
      }
    },
  },
  plugins: [],
}
