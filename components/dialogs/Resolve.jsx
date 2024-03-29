import { useSnackbarContext } from "@components/context/SnackbarContext";
import TextBox from "@components/inputFields/TextBox";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Portal,
} from "@mui/material";
import { createNotification, updateFlag } from "@utils/apiHelpers";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const Resolve = ({ open, handleClose, name, ID, mutate, route }) => {
  const { snackbar, setSnackbar } = useSnackbarContext();

  const router = useRouter();

  const [addInfo, setAddInfo] = useState("");

  const [showForm, setShowForm] = useState(false);

  const container = useRef(null);

  const handleInfoChange = (event) => {
    setAddInfo(event.target.value);
  };

  const handleSubmit = async () => {
    const flag = {
      id: ID,
      status: "resolved",
    };

    const flagResponse = await updateFlag(flag);
    handleClose();

    if (flagResponse.ok) {
      if (addInfo !== "") {
        const notify = {
          name: name,
          reason: "flag",
          text: `a flag you submitted was resolved`,
          add_info: addInfo,
          ref: ID,
        };

        const notifyResponse = await createNotification(notify, "admin");

        if (notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "success",
            message: `Flag resolved successfully`,
          });
          if (route === "flag") {
            mutate("/api/admin/flags");
          } else {
            router.push("/admin/flags");
          }
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            vertical: "bottom",
            horizontal: "left",
            severity: "error",
            message: `There was a problem resolving flag. Please try again later`,
          });
        }
      } else {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: `Flag resolved successfully`,
        });
        if (route === "flag") {
          mutate("/api/admin/flags");
        } else {
          router.push("/admin/flags");
        }
      }
    }
    if (!flagResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem resolving flag. Please try again later`,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      // aria-labelledby="update"
      // aria-describedby="update"
    >
      <DialogTitle id="resolve-title" color="textPrimary" align="center">
        Resolve
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="resolve-text" color="textPrimary">
          Are you sure you want to resolve flag?
        </DialogContentText>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: "18px" }}
          onClick={() => setShowForm(!showForm)}
          endIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Add Info
        </Button>
        <div style={{ display: "block" }} disablegutters="true">
          {showForm ? (
            <Portal container={container.current}>
              <FormControl sx={{ flexGrow: 1, marginTop: "10px" }}>
                <InputLabel shrink htmlFor="resolve"></InputLabel>
                <TextBox
                  id="resolve"
                  handleChange={handleInfoChange}
                  defaultValue=""
                  placeHolder="additional comment on notification"
                  autoFocus={false}
                  inputProps={{ type: "text", maxLength: 200 }}
                />
              </FormControl>
            </Portal>
          ) : null}

          <div
            ref={container}
            style={{ display: "flex", alignItems: "center" }}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color="secondary"
          variant="outlined"
        >
          Resolve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Resolve;
