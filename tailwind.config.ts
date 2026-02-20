import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3b3b8a",
          foreground: "#ffffff",
          50: "#eaeaf4",
          100: "#d5d5e9",
          200: "#ababcf",
          300: "#8181b5",
          400: "#57579b",
          500: "#3b3b8a",
          600: "#2f2f6e",
          700: "#232352",
          800: "#181836",
          900: "#0c0c1a",
        },
        secondary: {
          DEFAULT: "#d4a574",
          foreground: "#000000",
          50: "#fbf6f0",
          100: "#f7ede1",
          200: "#efdbc3",
          300: "#e7c9a5",
          400: "#dfb787",
          500: "#d4a574",
          600: "#c18e5c",
          700: "#9e724a",
          800: "#7b5738",
          900: "#583c26",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config