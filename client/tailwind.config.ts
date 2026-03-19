import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          accent: "hsl(var(--sidebar-accent))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        traffic: {
          red: "#ef4444",
          yellow: "#eab308",
          green: "#22c55e",
          road: "#374151",
          lane: "#6b7280",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "pulse-traffic": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "traffic-lamp-red": {
          "0%, 30%": {
            opacity: "1",
            filter: "brightness(1.15)",
            boxShadow: "0 0 22px rgba(239, 68, 68, 0.55)",
          },
          "33%, 100%": { opacity: "0.35", filter: "brightness(0.85)", boxShadow: "none" },
        },
        "traffic-lamp-yellow": {
          "0%, 32%": { opacity: "0.35", filter: "brightness(0.85)", boxShadow: "none" },
          "33%, 63%": {
            opacity: "1",
            filter: "brightness(1.1)",
            boxShadow: "0 0 22px rgba(234, 179, 8, 0.5)",
          },
          "66%, 100%": { opacity: "0.35", filter: "brightness(0.85)", boxShadow: "none" },
        },
        "traffic-lamp-green": {
          "0%, 65%": { opacity: "0.35", filter: "brightness(0.85)", boxShadow: "none" },
          "66%, 96%": {
            opacity: "1",
            filter: "brightness(1.1)",
            boxShadow: "0 0 22px rgba(34, 197, 94, 0.5)",
          },
          "100%": { opacity: "0.35", filter: "brightness(0.85)", boxShadow: "none" },
        },
      },
      animation: {
        "pulse-traffic": "pulse-traffic 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "traffic-red": "traffic-lamp-red 4.8s ease-in-out infinite",
        "traffic-yellow": "traffic-lamp-yellow 4.8s ease-in-out infinite",
        "traffic-green": "traffic-lamp-green 4.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
