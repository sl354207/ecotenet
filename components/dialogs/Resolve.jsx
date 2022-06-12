import TextBox from "@components/TextBox";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { createNotification, updateFlag } from "@utils/api-helpers";
import { useRef, useState } from "react";

const useStyles = makeStyles(() => ({
  comment: {
    display: "flex",
    alignItems: "center",
  },
  form: {
    flexGrow: 1,
  },
  addition: {
    display: "block",
  },
  info: {
    padding: "5px 0px 10px 0px",
  },
  button: {
    marginTop: 18,
  },
}));

const Resolve = ({
  open,
  handleClose,
  name,
  ID,
  className,
  setSnackbar,
  mutate,
}) => {
  const classes = useStyles();

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
            open: true,
            severity: "success",
            message: `Flag resolved successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
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
          open: true,
          severity: "success",
          message: `Flag resolved successfully`,
        });
      }
    }
    if (!flagResponse.ok) {
      setSnackbar({
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
      <DialogTitle
        id="update"
        className={className}
        color="textPrimary"
        align="center"
      >
        Resolve
      </DialogTitle>

      <DialogContent className={className}>
        <DialogContentText id="update" color="textPrimary">
          Are you sure you want to resolve flag?
        </DialogContentText>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={() => setShowForm(!showForm)}
          endIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Add Info
        </Button>
        <div className={classes.addition} disableGutters>
          {showForm ? (
            <Portal container={container.current}>
              <FormControl className={classes.form}>
                <InputLabel shrink htmlFor="commentform"></InputLabel>
                <TextBox
                  id="info"
                  handleChange={handleInfoChange}
                  defaultValue=""
                  placeHolder="additional comment on notification"
                  rows={1}
                  className={classes.info}
                  autoFocus={false}
                  name="info"
                />
              </FormControl>
            </Portal>
          ) : null}

          <div ref={container} className={classes.comment} />
        </div>
      </DialogContent>

      <DialogActions className={className}>
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
