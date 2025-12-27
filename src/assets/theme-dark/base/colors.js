const colors = {
  background: {
    default: "#1a2035",
    sidenav: "#1f283e",
    card: "#202940",
  },

  text: {
    main: "#ffffffcc",
    focus: "#ffffff", // Blanco puro para resaltar
  },

  transparent: {
    main: "transparent",
  },

  white: {
    main: "#ffffff",
    focus: "#ffffff",
  },

  black: {
    light: "#000000",
    main: "#000000",
    focus: "#000000",
  },

  // ADAPTADO AL LOGO: Amarillo Ringo
  primary: {
    main: "#ffcc33",
    focus: "#e6b82d",
  },

  secondary: {
    main: "#7b809a",
    focus: "#8f93a9",
  },

  info: {
    main: "#009fc7",
    focus: "#0181a1",
  },

  success: {
    main: "#4CAF50",
    focus: "#67bb6a",
  },

  warning: {
    main: "#fb8c00",
    focus: "#fc9d26",
  },

  error: {
    main: "#f44336",
    focus: "#d32f2f",
  },

  light: {
    main: "#f0f2f566",
    focus: "#f0f2f566",
  },

  dark: {
    main: "#344767",
    focus: "#2c3c58",
  },

  grey: {
    100: "#f8f9fa",
    200: "#f0f2f5",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },

  gradients: {
    // Gradiente basado en el logo (Amarillo a Naranja Girasol)
    primary: {
      main: "#ffcc33",
      state: "#ffb300",
    },

    secondary: {
      main: "#747b8a",
      state: "#495361",
    },

    info: {
      main: "#009fc7",
      state: "#0181a1",
    },

    success: {
      main: "#66BB6A",
      state: "#43A047",
    },

    warning: {
      main: "#FFA726",
      state: "#FB8C00",
    },

    error: {
      main: "#f44335",
      state: "#e53935",
    },

    light: {
      main: "#EBEFF4",
      state: "#CED4DA",
    },

    dark: {
      main: "#323a54",
      state: "#1a2035",
    },
  },

  socialMediaColors: {
    facebook: { main: "#3b5998", dark: "#344e86" },
    twitter: { main: "#55acee", dark: "#3ea1ec" },
    instagram: { main: "#125688", dark: "#0e456d" },
    linkedin: { main: "#0077b5", dark: "#00669c" },
    pinterest: { main: "#cc2127", dark: "#b21d22" },
    youtube: { main: "#e52d27", dark: "#d41f1a" },
    slack: { main: "#3aaf85", dark: "#329874" },
    github: { main: "#24292e", dark: "#171a1d" },
  },

  badgeColors: {
    primary: {
      background: "#ffcc3333", // Amarillo con transparencia para badges
      text: "#ffcc33",
    },
    secondary: { background: "#d7d9e1", text: "#6c757d" },
    info: { background: "#aecef7", text: "#095bc6" },
    success: { background: "#bce2be", text: "#339537" },
    warning: { background: "#ffd59f", text: "#c87000" },
    error: { background: "#fcd3d0", text: "#f61200" },
    light: { background: "#ffffff", text: "#c7d3de" },
    dark: { background: "#8097bf", text: "#1e2e4a" },
  },

  coloredShadows: {
    primary: "#ffcc33",
    secondary: "#110e0e",
    info: "#009fc7",
    success: "#4caf4f",
    warning: "#ff9900",
    error: "#f44336",
    light: "#adb5bd",
    dark: "#404040",
  },

  inputBorderColor: "#4f5b7d", // Color más acorde al fondo oscuro del card

  tabs: {
    indicator: { boxShadow: "#ffcc33" },
  },
};

export default colors;