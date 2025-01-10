/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          100: "#F8FAFC",
          200: "#F5F7FC",
          300: "#EBF3FF",
          400: "#191919",
          500: "#0F0F0F",
        },
        border: {
          100: "#D6D6D6",
          200: "#353535",
        },
        primary: "#2167F2",
        secondary: "#1B55C7",
        gray: "#969699",
        red: "#ff3b30",
        green: "#34c759",
        orange: "#ff9500",
      },
      screens: {
        "3xl": "1600px",
      },
    },
  },
  plugins: [],
};
