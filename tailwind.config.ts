import type { Config } from "tailwindcss";

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
      colors: {
        "dark-background": "#121212",
        "dark-foreground": "#FFFFFF",
        "dark-secondary": "#282828",
        border: "#424242",
        input: "#303030",
        ring: "hsl(var(--ring))", //keep ring
        background: "hsl(var(--background))", //keep background
        foreground: "hsl(var(--foreground))",//keep foreground
        primary: {
          DEFAULT: "#64B5F6",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#424242",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", //keep destructive
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#616161",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#80CBC4",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#212121",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#212121",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;