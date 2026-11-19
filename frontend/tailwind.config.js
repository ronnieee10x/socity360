/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A',
          dark: '#1E293B',
          emerald: '#10B981',
          emeraldDark: '#059669',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        }
      }
    },
  },
  plugins: [],
}
