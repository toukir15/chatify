/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('https://st2.depositphotos.com/1040356/5430/v/950/depositphotos_54309431-stock-illustration-seamless-line-pattern.jpg')", // Adjust the path as necessary
      }
    },
  },
  plugins: [],
}

