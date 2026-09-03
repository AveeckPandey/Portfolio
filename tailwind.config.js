/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        swyellow: "#ffe81f",
        swyellowdim: "#c9b41e",
        swhoover: "#d4af37",
        swgreen: "#9bbc0f",
        cream: "#F5F1E8",
        neon: "#C8FF32",
        navy: "#6F4AA8",
      },
      fontFamily: {
        display: ["var(--font-audiowide)", "sans-serif"],
        title: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-sharetech)", "monospace"],
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      textColor: {
        DEFAULT: "var(--fg)",
      },
      backgroundColor: {
        DEFAULT: "var(--bg)",
      },
    },
  },
  plugins: [],
};
