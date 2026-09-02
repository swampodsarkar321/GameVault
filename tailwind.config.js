/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: "#070A12",
          card: "#0F1424",
          cardHover: "#141B31",
          border: "#1E2947",
          muted: "#8B9BB4",
          accent: "#6C5CFF",
          accentHover: "#5A4AE6",
          accent2: "#00E5CC",
          accent3: "#FF3B82",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        fadeIn: "fadeIn 0.3s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
