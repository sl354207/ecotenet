import TextBox from "@components/TextBox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Portal,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { createNotification } from "@utils/api-helpers";
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

const AdminDialog = ({
  open,
  handleClose,
  contentType,
  action,
  className,
  result,
  setSnackbar,
  mutate,
}) => {
  const classes = useStyles();

  let endpoint;
  let item;
  let submission;

  switch (contentType) {
    case "post":
      endpoint = "Post";
      item = "post";
      submission = {
        _id: result._id,
        approved: action == "Deny" ? "false" : "true",
        feature: "false",
      };
      break;
    case "comment":
      endpoint = "Comment";
      item = "comment";
      submission = {
        _id: result._id,
        approved: action == "Deny" ? "false" : "true",
      };
      break;
    case "person":
      endpoint = "Person";
      item = "profile item";
      submission = {
        name: result.name,
        denials: action == "Deny" ? result.denials + 1 : result.denials,
        approved: action == "Approve" ? "true" : "false",
      };
      break;
    default:
      break;
  }

  const [reason, setReason] = useState("language");

  const [addInfo, setAddInfo] = useState("");

  const [showForm, setShowForm] = useState(false);

  const container = useRef(null);

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleInfoChange = (event) => {
    setAddInfo(event.target.value);
  };

  const handleSubmit = async () => {
    if (action == "Delete") {
      const res = await fetch(`/api/delete${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          contentType == "person"
            ? JSON.stringify(result.name)
            : JSON.stringify(result._id),
      });

      if (res.ok && contentType !== "person") {
        const notify = {
          name: result.name,
          reason: reason,
          text: `a ${item} of yours was deleted for a ${reason} violation`,
          add_info: addInfo,
          ref: result._id,
          date: new Date().toUTCString(),
          viewed: false,
        };

        // const res1 = await fetch("/api/createNotification", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(notify),
        // });
        const notifyRepsonse = await createNotification(notify);

        if (notifyRepsonse.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} deleted successfully`,
          });
        }
        if (!notifyRepsonse.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem deleting ${endpoint}. Please try again later`,
          });
        }
      }
      if (!res.ok) {
        setSnackbar({
          open: true,
          severity: "error",
          message: `There was a problem deleting ${endpoint}. Please try again later`,
        });
      }
    } else {
      const res = await fetch(`/api/update${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });
      if (action == "Deny") {
        if (res.ok) {
          const notify = {
            name: result.name,
            reason: reason,
            text: `a ${item} of yours was denied for a ${reason} violation`,
            add_info: addInfo,
            ref: result._id,
            date: new Date().toUTCString(),
            viewed: false,
          };

          const notifyRepsonse = await createNotification(notify);

          if (notifyRepsonse.ok) {
            if (mutate) {
              mutate();
            }

            handleClose();
            setSnackbar({
              open: true,
              severity: "success",
              message: `${endpoint} denied successfully`,
            });
          }
          if (!notifyRepsonse.ok) {
            setSnackbar({
              open: true,
              severity: "error",
              message: `There was a problem denying ${endpoint}. Please try again later`,
            });
          }
        }
        if (!res.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem denying ${endpoint}. Please try again later`,
          });
        }
      } else {
        if (res.ok) {
          if (mutate) {
            mutate();
          }
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${endpoint} approved successfully`,
          });
        }
        if (!res.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem approving ${endpoint}. Please try again later`,
          });
        }
      }
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
        {action}
      </DialogTitle>
      {action == "Approve" ? (
        <DialogContent className={className}>
          <DialogContentText id="update" color="textPrimary">
            Are you sure you want to approve {endpoint}?
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent className={className}>
          <FormControl component="fieldset">
            <FormLabel component="legend" color="secondary" focused={true}>
              Reason
            </FormLabel>
            <RadioGroup
              aria-label="reason"
              name="reason"
              value={reason}
              onChange={handleReasonChange}
              row
            >
              <FormControlLabel
                value="language"
                control={<Radio />}
                label="Language"
              />
              <FormControlLabel value="link" control={<Radio />} label="Link" />
              <FormControlLabel
                value="citation"
                control={<Radio />}
                label="Citation"
              />
            </RadioGroup>
          </FormControl>
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
      )}

      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color="secondary"
          variant="outlined"
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDialog;
