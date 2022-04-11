import { createTheme } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      // #fafafa
      main: "#001e3c",
      light: "#132f4c",
      dark: "#0a1929",
    },
    secondary: {
      main: "#94c9ff",
      light: "#c8fcff",
      dark: "#0071e4",
    },
    // "#1e4976"
    divider: "#94c9ff",
    background: {
      default: "#0a1929",
      paper: "#001e3c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#000000",
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
  overrides: {
    MuiContainer: {
      root: {
        minHeight: "60vh",
      },
    },
  },
});

export default theme;
