module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Original 4
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        darkAccent: "var(--darkAccent)",
        
        // 4 new ones
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      scale: {
        100: "1.006", // Custom `scale-100` for normal size
      },
    },
  },
  plugins: [],
};
