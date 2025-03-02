import themePresets from "./themePresets";

const ALL_KEYS = [
  "primary",
  "secondary",
  "accent",
  "darkAccent",
  "success",
  "warning",
  "danger",
  "info",
  // ... add any additional keys if needed
];

export const setTheme = (themeName) => {
  if (!themePresets[themeName]) {
    console.warn(`Theme "${themeName}" not found. Falling back to "Cardes".`);
    themeName = "Cardes"; // ✅ Default theme
  }

  const theme = themePresets[themeName];

  // Apply the theme's colors as CSS variables
  ALL_KEYS.forEach((key) => {
    // Only set the CSS variable if the theme actually has this key
    if (theme[key]) {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    }
  });

  // ✅ Save the selected theme to localStorage
  localStorage.setItem("selectedTheme", themeName);
};

// ✅ Load the saved theme or set default
export const loadTheme = () => {
  const savedTheme = localStorage.getItem("selectedTheme") || "Cardes";
  setTheme(savedTheme);
};
