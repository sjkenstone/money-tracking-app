/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        expense: '#ef4444', // red-500
        income: '#22c55e', // green-500
        primary: '#3b82f6', // blue-500
      },
    },
  },
  plugins: [],
}
