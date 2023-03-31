import { Alert, Snackbar } from "@mui/material";
import theme from "@utils/theme";
import { createContext, useContext, useState } from "react";

export const SnackbarContext = createContext();

export const useSnackbarContext = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
    vertical: "bottom",
    horizontal: "left",
    class: false,
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({
        ...snackbar,
        open: false,
      });
    }

    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
      {children}
      <Snackbar
        sx={
          snackbar.class
            ? {
                "& .MuiSnackbar-anchorOriginTopCenter": {
                  marginTop: "400px",
                  [theme.breakpoints.up("sm")]: {
                    marginTop: "300px",
                  },
                },
              }
            : {}
        }
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
