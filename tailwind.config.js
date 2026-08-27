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
        },
        brutal: {
          black: '#0f172a',
          yellow: '#1e40af',
          red: '#dc2626',
          blue: '#2563eb',
          green: '#059669',
          pink: '#7c3aed',
          orange: '#d97706',
          cream: '#f8fafc',
          white: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Hanken Grotesk"', 'sans-serif'],
        serif: ['"Source Serif 4"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.5rem',
        '2xl': '0.75rem',
        'brutal': '2px',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #0f172a',
        'brutal-sm': '2px 2px 0px 0px #0f172a',
        'brutal-lg': '6px 6px 0px 0px #0f172a',
        'brutal-xl': '8px 8px 0px 0px #0f172a',
        'brutal-yellow': '4px 4px 0px 0px #1e40af',
        'brutal-red': '4px 4px 0px 0px #dc2626',
        'brutal-blue': '4px 4px 0px 0px #2563eb',
        'brutal-green': '4px 4px 0px 0px #059669',
        'brutal-navy': '4px 4px 0px 0px #0f172a',
        'academic': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
        'academic-lg': '0 10px 30px -5px rgba(15, 23, 42, 0.12)',
        'brutal-inset': 'inset 4px 4px 0px 0px rgba(15,23,42,0.15)',
      },
      animation: {
        'brutal-pulse': 'brutal-pulse 2s ease-in-out infinite',
        'brutal-float': 'brutal-float 3s ease-in-out infinite',
        'brutal-shake': 'brutal-shake 0.5s ease-in-out',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'brutal-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'brutal-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'brutal-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
