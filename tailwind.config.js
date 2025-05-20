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
      fontSize: {
        h1: ['28px', { lineHeight: '36px' }],
        'h1-lg': ['36px', { lineHeight: '44px' }],
        h2: ['22px', { lineHeight: '30px' }],
        'h2-lg': ['28px', { lineHeight: '36px' }],
        body: ['16px', { lineHeight: '24px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        caption: ['13px', { lineHeight: '20px' }],
        'caption-lg': ['14px', { lineHeight: '20px' }],
        button: ['15px', { lineHeight: '22px' }],
        'button-lg': ['16px', { lineHeight: '24px' }],
      },
      maxWidth: {
        '5.5xl': '68rem', // Custom width between 5xl (64rem) and 6xl (72rem)
      },
    },
  },
  plugins: [],
};
