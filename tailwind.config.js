/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f5f3ff', // purple-50
          dark: '#1f2937',   // gray-800
        },
        surface: {
          light: '#e0e7ff', // indigo-100
          dark: '#111827',  // gray-900
        },
        text: {
          light: '#1f2937', // gray-800
          dark: '#f9fafb',  // white
        },
        accent: {
          light: '#6b46c1', // purple-600
          dark: '#a78bfa',  // violet-400
        },
        silverish: '#c0c0c0',
      },
      animation: {
        'bg-shift': 'bgShift 10s ease-in-out infinite',
      },
      keyframes: {
        bgShift: {
          '0%, 100%': { backgroundColor: 'var(--tw-bg-opacity-light)' },
          '50%': { backgroundColor: 'var(--tw-bg-opacity-dark)' },
        },
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
