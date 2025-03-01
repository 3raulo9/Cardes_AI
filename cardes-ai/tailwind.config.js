module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",  
        secondary: "var(--secondary)", 
        accent: "var(--accent)",   
        darkAccent: "var(--darkAccent)",
      },
      scale: {
        100: "1.006", // Custom `scale-100` for normal size
      },
    },
  },
  plugins: [],
};
