import { useSnackbarContext } from "@components/SnackbarContext";
import TextBox from "@components/TextBox";
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
import { createNotification, updateFlag } from "@utils/api-helpers";
import { useRef, useState } from "react";

const Resolve = ({ open, handleClose, name, ID, className, mutate }) => {
  const { snackbar, setSnackbar } = useSnackbarContext();

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
          date: new Date().toUTCString(),
          viewed: false,
        };

        const notifyResponse = await createNotification(notify);

        if (notifyResponse.ok) {
          if (mutate) {
            mutate();
          }

          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message: `Flag resolved successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message: `There was a problem resolving flag. Please try again later`,
          });
        }
      } else {
        if (mutate) {
          mutate();
        }

        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: `Flag resolved successfully`,
        });
      }
    }
    if (!flagResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: `There was a problem resolving flag. Please try again later`,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="update"
      aria-describedby="update"
    >
      <DialogTitle id="update" color="textPrimary" align="center">
        Resolve
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="update" color="textPrimary">
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
              <FormControl sx={{ flexGrow: 1 }}>
                <InputLabel shrink htmlFor="commentform"></InputLabel>
                <TextBox
                  id="info"
                  handleChange={handleInfoChange}
                  defaultValue=""
                  placeHolder="additional comment on notification"
                  rows={1}
                  autoFocus={false}
                  name="info"
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
