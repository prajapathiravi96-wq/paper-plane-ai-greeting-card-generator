/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#f5f3ff", // Lavender light background
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          500: "#a855f7", // Purple-500
          600: "#9333ea", // Purple-600
          700: "#7e22ce", // Purple-700
          800: "#6b21a8", // Purple-800
          900: "#581c87", // Purple-900
        },
        accent: {
          indigo: "#6366f1", // Indigo
          deep: "#4f46e5",
          dark: "#3730a3"
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
