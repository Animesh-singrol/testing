/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#01807F", // Custom color
        secondary: "#FFC107",
        accent: "#FF5722",
        background: "#f9fafb",
        primaryColor: "#008181",
        primaryColorHover: "#006c6c",
        inputBackgroundColor: "#b5b5b5",
        sidebarTextColor: "white",
        doctorCountBox: "#D8BFD8",
        patientCountBox: "#FFF5EE",
        NumberOfReports: "#FBCEB1",
        blackColor: "#1a202c",
        date: "#F0E68C",
        darkPrimaryColor: "#006c6c", // Dark mode primary color
        darkSidebarTextColor: "#B5B5B5", // Lighter text color for dark mode
        darkBackground: "#1a202c", // Dark background color
        darkTextColor: "#e2e8f0",
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
