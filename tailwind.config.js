/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Academic Editorial Palette
        'deep-navy': '#0B1F33',
        'dark-navy': '#132B45',
        'navy-text': '#10243A',
        'ivory': '#FAF8F3',
        'pure-white': '#FFFFFF',

        // Accents
        'academic-gold': '#D9A441',
        'gold-champagne': '#EBCB8B',
        'gold-muted': '#F5E8CD',
        'gold-hover': '#FAF2DF',

        // Secondary
        'slate-gray': '#5F6B7A',
        'light-slate': '#8A94A3',
        'border-gray': '#DDE2E7',
        'light-gray': '#F3F5F7',

        // Compatibility aliases mapped to the academic editorial palette
        brutal: {
          black: '#0B1F33',
          primary: '#0B1F33',
          secondary: '#132B45',
          accent: '#D9A441',
          gold: '#D9A441',
          champagne: '#EBCB8B',
          mutedGold: '#F5E8CD',
          red: '#C53030',
          blue: '#0B1F33',
          green: '#2A7A56',
          pink: '#D9A441',
          orange: '#D9A441',
          cream: '#FAF8F3',
          white: '#ffffff',
          yellow: '#D9A441',
          border: '#DDE2E7',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Hanken Grotesk"', 'sans-serif'],
        serif: ['"Source Serif 4"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        'brutal': '6px',
      },
      borderWidth: {
        '3': '2px',
        '4': '3px',
        '5': '4px',
        '6': '4px',
      },
      boxShadow: {
        'subtle': '0 2px 8px -1px rgba(11, 31, 51, 0.05), 0 1px 3px -1px rgba(11, 31, 51, 0.03)',
        'academic': '0 4px 20px -2px rgba(11, 31, 51, 0.06), 0 2px 6px -1px rgba(11, 31, 51, 0.03)',
        'academic-lg': '0 10px 30px -4px rgba(11, 31, 51, 0.08), 0 4px 10px -2px rgba(11, 31, 51, 0.04)',
        'academic-xl': '0 20px 40px -6px rgba(11, 31, 51, 0.1)',
        'gold-glow': '0 4px 14px 0 rgba(217, 164, 65, 0.25)',
        'brutal': '2px 2px 0px 0px #0B1F33',
        'brutal-sm': '1px 1px 0px 0px #0B1F33',
        'brutal-lg': '4px 4px 0px 0px #0B1F33',
        'brutal-xl': '6px 6px 0px 0px #0B1F33',
        'brutal-yellow': '0 2px 8px -1px rgba(217, 164, 65, 0.2)',
        'brutal-primary': '0 4px 14px 0 rgba(11, 31, 51, 0.15)',
        'brutal-red': '2px 2px 0px 0px #C53030',
        'brutal-blue': '2px 2px 0px 0px #0B1F33',
        'brutal-green': '2px 2px 0px 0px #2A7A56',
        'brutal-navy': '2px 2px 0px 0px #0B1F33',
        'brutal-inset': 'inset 2px 2px 0px 0px rgba(11,31,51,0.08)',
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
