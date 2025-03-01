import themePresets from "./themePresets";

export const setTheme = (themeName) => {
  if (!themePresets[themeName]) {
    console.warn(`Theme "${themeName}" not found. Falling back to "Cardes".`);
    themeName = "Cardes"; // ✅ Default theme
  }

  const theme = themePresets[themeName];

  // Apply theme colors as CSS variables
  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--secondary", theme.secondary);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--darkAccent", theme.darkAccent);

  // ✅ Save the selected theme to localStorage
  localStorage.setItem("selectedTheme", themeName);
};

// ✅ Load the saved theme or set default
export const loadTheme = () => {
  const savedTheme = localStorage.getItem("selectedTheme") || "Cardes";
  setTheme(savedTheme);
};
