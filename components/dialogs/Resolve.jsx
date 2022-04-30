import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Portal,
  InputLabel,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { alpha, makeStyles } from "@material-ui/core/styles";

import { useRouter } from "next/router";
import { useRef, useState } from "react";
import TextBox from "../TextBox";

const useStyles = makeStyles((theme) => ({
  paper: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
  },
  item: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
  },
  reply: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    marginLeft: 60,
    width: "auto",
    // margin: "10px auto",
  },
  comment: {
    display: "flex",
    // marginTop: 10,
    alignItems: "center",
  },
  description: {
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  content: {
    // display: "flex",
    // flexDirection: "column",
    // maxWidth: 800,
    flexGrow: 1,
    // marginLeft: 20,
  },
  items: {
    // display: "flex",
    flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
  addition: {
    display: "block",
  },
  submit: {
    marginLeft: 10,
  },
  info: {
    // marginLeft: 60,
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
  // console.log(ID);
  const classes = useStyles();

  const [addInfo, setAddInfo] = useState("");

  const [showForm, setShowForm] = useState(false);

  const container = useRef(null);

  const handleInfoChange = (event) => {
    setAddInfo(event.target.value);
  };

  const handleSubmit = async () => {
    const flag = {
      _id: ID,
      status: "resolved",
    };

    const res = await fetch("/api/updateFlag", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flag),
    });
    handleClose();

    if (res.ok) {
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

        const res1 = await fetch("/api/createNotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notify),
        });

        if (res1.ok) {
          if (mutate) {
            mutate();
          }

          // handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `Flag resolved successfully`,
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem resolvng flag. Please try again later`,
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
    if (!res.ok) {
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
              <FormControl className={classes.items}>
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
