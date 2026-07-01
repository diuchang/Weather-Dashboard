/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: 'rgb(var(--navy-950) / <alpha-value>)',
          900: 'rgb(var(--navy-900) / <alpha-value>)',
          800: 'rgb(var(--navy-800) / <alpha-value>)',
          700: 'rgb(var(--navy-700) / <alpha-value>)',
          600: 'rgb(var(--navy-600) / <alpha-value>)',
        },
        panel: {
          800: 'rgb(var(--panel-800) / <alpha-value>)',
          700: 'rgb(var(--panel-700) / <alpha-value>)',
          600: 'rgb(var(--panel-600) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};

