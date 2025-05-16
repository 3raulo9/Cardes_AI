/* src/theme/themePresets.ts */
const themePresets = {
  /* 〰️ Polished originals (minor tweaks) 〰️ */
  Midnight: {
    /* core brand */
    primary: "#181C34", // slightly deeper, crisper midnight indigo
    secondary: "#53577E", // a hair lighter for contrast against primary

    /* interactive highlights */
    accent: "#D1BCC2", // softer, warm-neutral pink-beige for buttons/cards
    darkAccent: "#8B7A83", // real “dark” mate to accent for hovers/disabled

    /* semantic status */
    success: "#2F8C71", // a bit brighter => passes on both dark & light BG
    warning: "#F4C23A", // warmer yellow for <text-on-dark> contrast
    danger: "#B34257", // richer crimson keeps legibility without neon pop
    info: "#5C8FE2", // clearer blue, 4.8 : 1 on #181C34

    /* neutrals (helpful in UI) */
    surface: "#1E223E", // card backgrounds, input fields
    onSurface: "#E8E9F1", // primary text on dark surfaces
    muted: "#9CA1C9", // secondary text/icons, disabled
  },
  Ocean: {
    primary: "#013A50",
    secondary: "#007C9E",
    accent: "#9FFFCB",
    darkAccent: "#55C2A3",
    success: "#33C17D",
    warning: "#FFC94A",
    danger: "#F85149",
    info: "#4BD0FF",
  },
  Forest: {
    primary: "#264E33",
    secondary: "#7BAF66",
    accent: "#CFE9BC",
    darkAccent: "#ADC99A",
    success: "#47A447",
    warning: "#DDB94F",
    danger: "#8E2D30",
    info: "#659DBD",
  },
  Sunset: {
    primary: "#D93744",
    secondary: "#FA7431",
    accent: "#302B5F",
    darkAccent: "#1B998B",
    success: "#4FBF77",
    warning: "#F5C956",
    danger: "#B8212A",
    info: "#7D80B0",
  },
  Pastel: {
    primary: "#FFB2B2",
    secondary: "#FFD9B4",
    accent: "#FDFFBC",
    darkAccent: "#B9FFCC", // dark-enough mint for readable text
    success: "#9AF57A",
    warning: "#FFF3B0",
    danger: "#FF9AA2",
    info: "#8EEBEB",
  },

  /* 〰️ Trimmed / re-hued originals 〰️ */
  Cyberpunk: {
    primary: "#ff009d",   // magenta ≈ 330°
    secondary: "#00e5ff",   // cyan
    accent: "#ffec00",   // yellow
    darkAccent: "#ff005c",   // deep pink
    success: "#00f993",
    warning: "#fff300",
    danger: "#ff0037",
    info: "#29fff6",
  },
  DarkMode: {
    primary: "#141414",
    secondary: "#202124",
    accent: "#BB86FC",
    darkAccent: "#03DAC6",
    success: "#00B373",
    warning: "#F4B400",
    danger: "#CF6679",
    info: "#4285F4",
  },
  Retro: {
    primary: "#FF7F50",
    secondary: "#FFD700",
    accent: "#ADFF2F",
    darkAccent: "#008080",
    success: "#8FBC8F",
    warning: "#FFF8DC",
    danger: "#CD5C5C",
    info: "#87CEEB",
  },
  Neon: {
    primary: "#00FF7F",
    secondary: "#FF00FF",
    accent: "#FF6600",
    darkAccent: "#00BFFF",
    success: "#39FF14",
    warning: "#FFFF00",
    danger: "#FF1744",
    info: "#46FFFF",
  },

  /* 〰️ NEW palettes 〰️ */
  Nord: {
    primary: "#2E3440",
    secondary: "#3B4252",
    accent: "#88C0D0",
    darkAccent: "#4C566A",
    success: "#A3BE8C",
    warning: "#EBCB8B",
    danger: "#BF616A",
    info: "#81A1C1",
  },
  Solarized: {
    primary: "#002B36",
    secondary: "#073642",
    accent: "#268BD2",
    darkAccent: "#586E75",
    success: "#859900",
    warning: "#B58900",
    danger: "#DC322F",
    info: "#2AA198",
  },
  Sakura: {
    primary: "#2A2A37",
    secondary: "#3D3D52",
    accent: "#FFB3C7",
    darkAccent: "#FF7099",
    success: "#8CCF7E",
    warning: "#FFD966",
    danger: "#F56C7D",
    info: "#9CD2FF",
  },
  Monochrome: {
    primary: "#181818",
    secondary: "#282828",
    accent: "#FFFFFF",
    darkAccent: "#C4C4C4",
    success: "#A8FF8A",
    warning: "#FFD966",
    danger: "#FF6B6B",
    info: "#6EC1FF",
  },
  Aurora: {
    primary: "#001219",
    secondary: "#005F73",
    accent: "#94D2BD",
    darkAccent: "#0A9396",
    success: "#38B000",
    warning: "#E9D758",
    danger: "#EE6C4D",
    info: "#3D5A80",
  },
};

export default themePresets;
