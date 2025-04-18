/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'ellipse-spin': 'ellipse-spin 2s ease-in-out forwards',
        'bounce-in': 'bounce-in 1s ease-out forwards',
        'slide-down': 'slide-down 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'spin-slow': 'spin-slow 4s linear infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'ellipse-spin': {
          '0%': { opacity: 0, transform: 'rotate(0deg) scale(0.8)' },
          '50%': { opacity: 0.7 },
          '100%': { opacity: 1, transform: 'rotate(360deg) scale(1)' },
        },
        'bounce-in': {
          '0%': { opacity: 0, transform: 'translateY(-100px) scale(0.5)' },
          '60%': { opacity: 1, transform: 'translateY(20px) scale(1.1)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'slide-down': {
          from: { opacity: 0, transform: 'translateY(-20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};