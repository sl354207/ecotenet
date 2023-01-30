import { createTheme } from "@mui/material/styles";
import { Roboto } from "@next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#001e3c",
      light: "#132f4c",
      dark: "#0a1929",
    },
    secondary: {
      main: "#94c9ff",
      light: "#c8fcff",
      dark: "#0071e4",
    },
    divider: "#94c9ff",
    background: {
      default: "#0a1929",
      paper: "#001e3c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#000000",
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
    action: {
      active: "#fff",
      hover: "rgba(255, 255, 255, 0.08)",
      hoverOpacity: "0.08",
      selected: "rgba(255, 255, 255, 0.16)",
      selectedOpacity: "0.16",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabledOpacity: "0.38",
      focus: "rgba(255, 255, 255, 0.12)",
      focusOpacity: "0.12",
      activatedOpacity: "0.24",
    },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          minHeight: "60vh",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#c8fcff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          marginTop: 4,
          marginBottom: 4,
          backgroundColor: "#132f4c",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: `#ffffff!important`,
          position: "relative",
          transform: "none",
          "&.Mui-focused": {
            color: "#ffffff!important",
            position: "relative",
            transform: "none",
          },
        },
        formControl: {
          color: `#ffffff!important`,
          position: "relative",
          transform: "none",
        },
      },
    },
  },
});

export default theme;
