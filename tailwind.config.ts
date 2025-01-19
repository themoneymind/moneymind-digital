import type { Config } from "tailwindcss";
import { flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const colors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(colors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": {
      ...newVars,
      "--white": "#FFFFFF",
      "--black": "#000000",
      "--transparent": "transparent",
      "--blue-300": "#93C5FD",
      "--blue-400": "#60A5FA",
      "--blue-500": "#3B82F6",
      "--indigo-300": "#A5B4FC",
      "--violet-200": "#DDD6FE",
    },
  });
}

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F8FAFC",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
          gradient: {
            from: "#7C3AED",
            to: "#6366F1",
          },
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F3F4F6",
          foreground: "#1F2937",
        },
        transaction: {
          income: "#00AF1E",
          expense: "#FF1122",
          transfer: "#7F3DFF",
        },
      },
      borderRadius: {
        'apple': '1.25rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "wave": {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14.0deg)" },
          "20%": { transform: "rotate(-8.0deg)" },
          "30%": { transform: "rotate(14.0deg)" },
          "40%": { transform: "rotate(-4.0deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        "aurora": {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "wave": "wave 2.5s ease-in-out infinite",
        "aurora": "aurora 60s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config;