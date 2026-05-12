/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./components/**/*.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4CAF50",
          dark: "#2E7D32",
          light: "#66BB6A",
        },

        background: {
          DEFAULT: "#F6FBF7",
          soft: "#edf5ec",
          card: "#FFFFFF",
        },

        text: {
          primary: "#1C1C1C",
          secondary: "#757575",
        },

        border: {
          DEFAULT: "#E0E0E0",
        },

        incoming: "#43A047",
        outgoing: "#42A5F5",
        missed: "#EF5350",

        success: "#43A047",
        warning: "#FFA726",
        danger: "#EF5350",
      },
    },
  },
  plugins: [],
}