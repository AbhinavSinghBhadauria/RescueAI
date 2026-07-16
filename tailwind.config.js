/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral graphite, not saturated indigo-black — reads as an
        // instrument panel, not a "dark mode app template".
        base: "#0B0C0E",
        emergency: "#D6472C",  // hazard-placard vermilion, not candy red
        medical: "#4A8C8C",    // clinical teal — scrub-green adjacent
        success: "#4C9A6A",
        warning: "#C4903D",
        purple: "#7A7699",     // muted violet — used only for AI/model cues
        subtext: "#8C8D91",
        ink: "#EDEAE3",        // warm off-white, not pure #fff
      },
      fontFamily: {
        // Condensed signage face for headers — evokes hazard/exit signage,
        // which is the actual visual vernacular of emergency equipment.
        display: ["'Oswald'", "sans-serif"],
        body: ["'Public Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "14px",
        xl3: "18px",
      },
      boxShadow: {
        glow: "0 0 30px -12px rgba(214,71,44,0.5)",
        glowBlue: "0 0 30px -12px rgba(74,140,140,0.4)",
        glowPurple: "0 0 30px -12px rgba(122,118,153,0.35)",
        glass: "0 8px 28px 0 rgba(0,0,0,0.4)",
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
          "0%,100%": { opacity: 0.5, transform: "scale(1)" },
          "50%": { opacity: 0.9, transform: "scale(1.04)" },
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
          "50%": { transform: "translate(20px,-20px) scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        radarSweep: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        spinSlow: "spinSlow 14s linear infinite",
        spinSlowReverse: "spinSlowReverse 18s linear infinite",
        blobMove: "blobMove 22s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        radarSweep: "radarSweep 4s linear infinite",
      },
    },
  },
  plugins: [],
}
