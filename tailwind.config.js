/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.4s ease-out',
        'breathe': 'breathe 19s ease-in-out infinite',
        'breathe-inhale': 'breatheInhale 4s ease-in-out infinite',
        'breathe-hold': 'breatheHold 7s ease-in-out infinite',
        'breathe-exhale': 'breatheExhale 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '21%': { transform: 'scale(1.3)', opacity: '1' },
          '58%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.8' },
        },
        breatheInhale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.3)' },
        },
        breatheHold: {
          '0%, 100%': { transform: 'scale(1.3)' },
        },
        breatheExhale: {
          '0%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
