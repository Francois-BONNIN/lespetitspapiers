/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        brand: {
          50: '#eef3ff',
          100: '#e0e8ff',
          200: '#c6d4ff',
          300: '#a3b6fd',
          400: '#7f91f9',
          500: '#616cf1',
          600: '#4a4ce5',
          700: '#3e3cc9',
          800: '#3434a2',
          900: '#303380',
          950: '#1d1d4b',
        },
        ink: {
          50: '#f8f8f7',
          100: '#f1f0ee',
          200: '#e3e1dd',
          300: '#cdc9c2',
          400: '#a8a29a',
          500: '#87817a',
          600: '#6d6862',
          700: '#5a5551',
          800: '#443f3c',
          900: '#2c2926',
          950: '#191715',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(25 23 21 / 0.04), 0 4px 16px -4px rgb(25 23 21 / 0.08)',
        'card-hover':
          '0 2px 4px 0 rgb(25 23 21 / 0.05), 0 12px 32px -8px rgb(25 23 21 / 0.14)',
        glow: '0 0 0 1px rgb(74 76 229 / 0.15), 0 8px 28px -6px rgb(74 76 229 / 0.35)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'item-in': {
          '0%': { opacity: '0', transform: 'translateY(-14px) scale(.94)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'draw-in': {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(.94)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'flash-ring': {
          '0%': { opacity: '0' },
          '18%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(.8)' },
          '45%': { transform: 'scale(1.28)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        'fade-up': 'fade-up .35s cubic-bezier(.16,1,.3,1) both',
        'scale-in': 'scale-in .2s cubic-bezier(.16,1,.3,1) both',
        'slide-in-right': 'slide-in-right .3s cubic-bezier(.16,1,.3,1) both',
        float: 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.4s linear infinite',
        'item-in': 'item-in .45s cubic-bezier(.16,1,.3,1) both',
        'draw-in': 'draw-in .5s cubic-bezier(.16,1,.3,1) both',
        'flash-ring': 'flash-ring .85s ease-out both',
        pop: 'pop .5s cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
};
