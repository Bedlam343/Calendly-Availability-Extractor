/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        revealLeft: {
          '0%': {
            clipPath: 'inset(0 100% 0 0)',
            opacity: '0',
          },
          '100%': {
            clipPath: 'inset(0 0 0 0)',
            opacity: '1',
          },
        },
      },
      animation: {
        'reveal-left': 'revealLeft 2.5s ease forwards',
      },
    },
  },
  plugins: [],
};
