import { createTheme } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    // primary: {
    //   // #fafafa
    //   main: grey[50],
    //   light: "#ffffff",
    //   dark: "#c7c7c7",
    // },
    // secondary: {
    //   main: "#212121",
    //   light: "#484848",
    //   dark: "#000000",
    // },
    primary: {
      main: "#000000",
    },

    // divider: black[700],
    background: {
      default: "#000000",
      paper: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#000000",
    },
  },
});

export default theme;
