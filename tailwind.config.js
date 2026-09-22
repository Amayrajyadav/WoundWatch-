/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6effe',
          100: '#cddffe',
          200: '#9bbffd',
          300: '#699ffc',
          400: '#377ffb',
          500: '#055ffa',
          600: '#044cc8',
          700: '#033996',
          800: '#022664',
          900: '#011332',
          950: '#010919',
        },
        surface: {
          light: '#ffffff',
          soft: '#f5f8ff',
          blue: '#eef4ff',
          border: '#dce7ff',
          dark: '#00091a',
          darkSoft: '#001233',
          darkBorder: '#002466',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(5, 95, 250, 0.08)',
        'glow': '0 0 25px -5px rgba(5, 95, 250, 0.3)',
      }
    },
  },
  plugins: [],
};
