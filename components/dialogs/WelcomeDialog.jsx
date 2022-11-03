import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

const WelcomeDialog = () => {
  const [welcome, setWelcome] = useState(true);

  const handleCloseSearch = () => {
    setWelcome(false);
  };

  return (
    <Dialog
      open={welcome}
      onClose={handleCloseSearch}
      fullWidth
      maxWidth="md"
      //   scroll="paper"
      //   disableScrollLock
      // hideBackdrop
      sx={{
        "&.MuiModal-root": {
          top: "20%",
          bottom: "auto",
        },
        "&.MuiDialog-root": {
          top: "20%",
          // bottom: 0,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <DialogTitle
          color="textPrimary"
          align="center"
          sx={{ paddingBottom: "20px", position: "fixed", marginBlock: "20px" }}
          variant="h4"
        >
          Welcome to Ecotenet!
        </DialogTitle>
        <IconButton
          sx={{ marginLeft: "auto" }}
          color="secondary"
          onClick={handleCloseSearch}
        >
          <CloseIcon />
        </IconButton>
      </div>
      {/* <Divider /> */}

      <DialogContent sx={{ marginTop: { xs: "20px", sm: "0px" } }}>
        <Typography variant="h6" align="center">
          Explore the world through ecoregions by learning about all of the
          different species and how we as people interact with the environment
          around us
        </Typography>
        <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
          Sign up to create posts and share your knowledge of the environment,
          or simply to comment and vote on other posts
        </Typography>
        {/* <Typography variant="body1">
          Explore the world through ecoregions!{" "}
        </Typography> */}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
