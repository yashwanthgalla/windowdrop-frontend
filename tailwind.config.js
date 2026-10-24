/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apple: {
          bg: {
            DEFAULT: "#F5F5F7",
            dark: "#000000",
          },
          surface: {
            DEFAULT: "#FFFFFF",
            dark: "#1C1C1E",
          },
          elevated: {
            DEFAULT: "#F0F0F2",
            dark: "#2C2C2E",
          },
          text: {
            DEFAULT: "#1D1D1F",
            dark: "#F5F5F7",
          },
          secondary: {
            DEFAULT: "#6E6E73",
            dark: "#98989D",
          },
          border: {
            DEFAULT: "rgba(0, 0, 0, 0.08)",
            dark: "rgba(255, 255, 255, 0.12)",
          },
          accent: {
            DEFAULT: "#0071E3",
            hover: "#0077ED",
            dark: "#0A84FF",
            darkHover: "#0071E3",
          },
          success: "#34C759",
          error: "#FF3B30",
          warning: "#FF9F0A",
        },
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Inter"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          "ui-monospace",
          "Menlo",
          "Monaco",
          "monospace",
        ],
      },
      borderRadius: {
        "apple-card": "24px",
        "apple-btn": "14px",
      },
      boxShadow: {
        "apple-subtle": "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "apple-card": "0 10px 30px -4px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "apple-floating": "0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)",
        "apple-dark": "0 10px 30px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        shimmer: "shimmer 1.8s infinite linear",
        pulseFast: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
}
