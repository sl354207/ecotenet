import { alpha, createTheme } from "@mui/material/styles";

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
    error: {
      main: "#e57373",
      light: "#e57373",
      dark: "#d32f2f",
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // backgroundColor: "#F9FAFE",
          "&.Mui-focused": {
            backgroundColor: "transparent",
          },
          "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94c9ff",
          },
          "& fieldset": {
            borderColor: alpha("#94c9ff", 0.8),
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#94c9ff", 0.3),
          },
          "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#94c9ff", 0.3),
          },
          "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e57373",
          },
          ":hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#94c9ff", 0.8),
          },
          "&.Mui-focused fieldset": {
            borderWidth: "1px",
          },
        },
      },
    },
  },
});

export default theme;
