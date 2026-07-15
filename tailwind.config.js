/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#050816",
        emergency: "#FF4D4D",
        medical: "#4FC3F7",
        success: "#22C55E",
        warning: "#F59E0B",
        purple: "#8B5CF6",
        subtext: "#A1A1AA",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "22px",
        xl3: "28px",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255,77,77,0.45)",
        glowBlue: "0 0 40px -10px rgba(79,195,247,0.45)",
        glowPurple: "0 0 40px -10px rgba(139,92,246,0.45)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.55, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.06)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        spinSlowReverse: {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        blobMove: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-40px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        spinSlow: "spinSlow 14s linear infinite",
        spinSlowReverse: "spinSlowReverse 18s linear infinite",
        blobMove: "blobMove 18s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
}
