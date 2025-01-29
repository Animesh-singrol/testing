/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#01807F", // Custom color
        secondary: "#FFC107",
        accent: "#FF5722",
        background: "#f9fafb",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        heading: ['"Poppins"', "sans-serif"],
      },
      spacing: {
        128: "32rem", // Custom spacing value
        144: "36rem",
      },
    },
  },
  plugins: [],
  darkMode: "media",
};
