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
import {
  createNotification,
  deleteComment,
  deletePost,
  deleteUser,
  updateComment,
  updatePost,
  updateUser,
} from "@utils/api-helpers";
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

  let item;
  let submission;
  let deletion;

  switch (contentType) {
    case "Post":
      item = "post";
      submission = {
        _id: result._id,
        approved: action == "Deny" ? "false" : "true",
        feature: "false",
      };
      deletion = {
        _id: result._id,
      };
      break;
    case "Comment":
      item = "comment";
      submission = {
        id: result._id,
        approved: action == "Deny" ? "false" : "true",
      };
      deletion = {
        id: result._id,
      };
      break;
    case "Person":
      item = "profile item";
      submission = {
        name: result.name,
        email: result.email,
        denials: action == "Deny" ? result.denials + 1 : result.denials,
        approved: action == "Approve" ? "true" : "false",
      };
      deletion = result.name;

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

  const deleteItem = async () => {
    switch (contentType) {
      case "Post":
        const postResponse = await deletePost(deletion, "admin");

        return postResponse;
      case "Comment":
        const commentResponse = await deleteComment(deletion, "admin");

        return commentResponse;
      case "Person":
        const userResponse = await deleteUser(deletion, "admin");

        return userResponse;

      default:
        break;
    }
  };

  const updateItem = async () => {
    switch (contentType) {
      case "Post":
        const postResponse = await updatePost(submission, "admin");

        return postResponse;
      case "Comment":
        const commentResponse = await updateComment(submission, "admin");

        return commentResponse;
      case "Person":
        const userResponse = await updateUser(submission, "admin");

        return userResponse;

      default:
        break;
    }
  };

  const handleSubmit = async () => {
    if (action == "Delete") {
      const deleteResponse = await deleteItem();

      if (deleteResponse.ok && contentType !== "Person") {
        const notify = {
          name: result.name,
          reason: reason,
          text: `a ${item} of yours was deleted for a ${reason} violation`,
          add_info: addInfo,
          ref: result._id,
          date: new Date().toUTCString(),
          viewed: false,
        };

        const notifyResponse = await createNotification(notify);

        if (notifyResponse.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${contentType} deleted successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem deleting ${item}. Please try again later`,
          });
        }
      }
      if (!deleteResponse.ok) {
        setSnackbar({
          open: true,
          severity: "error",
          message: `There was a problem deleting ${item}. Please try again later`,
        });
      }
    } else {
      const updateResponse = await updateItem();
      if (action == "Deny") {
        if (updateResponse.ok) {
          const notify = {
            name: result.name,
            reason: reason,
            text: `a ${item} of yours was denied for a ${reason} violation`,
            add_info: addInfo,
            ref: result._id,
            date: new Date().toUTCString(),
            viewed: false,
          };

          const notifyResponse = await createNotification(notify);

          if (notifyResponse.ok) {
            if (mutate) {
              mutate();
            }

            handleClose();
            setSnackbar({
              open: true,
              severity: "success",
              message: `${contentType} denied successfully`,
            });
          }
          if (!notifyResponse.ok) {
            setSnackbar({
              open: true,
              severity: "error",
              message: `There was a problem denying ${item}. Please try again later`,
            });
          }
        }
        if (!updateResponse.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem denying ${item}. Please try again later`,
          });
        }
      } else {
        if (updateResponse.ok) {
          if (mutate) {
            mutate();
          }
          handleClose();
          setSnackbar({
            open: true,
            severity: "success",
            message: `${contentType} approved successfully`,
          });
        }
        if (!updateResponse.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: `There was a problem approving ${item}. Please try again later`,
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
            Are you sure you want to approve {item}?
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
