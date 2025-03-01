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
    },
  },
  plugins: [],
};
