/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'splash': "url('/assets/splash-bg.jpg')",
      },
      animation: {
        'fade-out': "fadeOut 1s ease-out forwards",
        'glow': "glow 1.5s ease-in-out infinite alternate",
      },
      fontFamily: {
        title: ["Spectral SC", "serif"], // Font for "MYTHOS"
        subtitle: ["Spectral SC", "serif"], // Font for "Forge Your Legend"
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        glow: {
          "0%": { textShadow: "0px 0px 10px rgba(255,255,255,0.5)" },
          "100%": { textShadow: "0px 0px 20px rgba(255,255,255,1)" },
        },
      },
    },
  },
  plugins: [],
};