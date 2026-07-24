/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        void: "#080808",
        panel: "#0f1326",
        gold: "#f5a623",
        amber: "#ffcf5c",
        mist: "#8b91ab",
        line: "#1c2140",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
