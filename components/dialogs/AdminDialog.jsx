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
  FormControlLabel,
  FormLabel,
  InputLabel,
  Portal,
  Radio,
  RadioGroup,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import {
  createNotification,
  deleteComment,
  deletePost,
  deletePostMedia,
  deleteUser,
  deleteUserMedia,
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
  mutate,
}) => {
  const classes = useStyles();
  const { snackbar, setSnackbar } = useSnackbarContext();

  let item;

  switch (contentType) {
    case "Post":
      item = "post";

      break;
    case "Comment":
      item = "comment";

      break;
    case "Person":
      item = "profile item";

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

  const handleNotify = async (type, action) => {
    const notify = {
      name: result.name,
      reason: reason,
      text: `a ${type} of yours was ${action} for a ${reason} violation`,
      add_info: addInfo,
      ref: result._id,
      date: new Date().toUTCString(),
      viewed: false,
    };

    const notifyResponse = await createNotification(notify);

    return notifyResponse;
  };

  const handleDeletePost = async () => {
    const deletion = {
      _id: result._id,
    };

    const mediaResponse = await deletePostMedia(
      result.name,
      result._id,
      "admin"
    );
    if (mediaResponse.ok) {
      const postResponse = await deletePost(deletion, "admin");

      if (postResponse.ok) {
        const notifyResponse = await handleNotify("post", "deleted");
        if (notifyResponse.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message: `Post deleted successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message: `There was a problem creating notification but post was deleted`,
          });
        }
      }
      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem deleting post. Please try again later`,
        });
      }
    }
    if (!mediaResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: `There was a problem deleting post. Please try again later`,
      });
    }
  };

  const handleDeleteComment = async () => {
    const deletion = {
      id: result._id,
    };

    const commentResponse = await deleteComment(deletion, "admin");

    if (commentResponse.ok) {
      const notifyResponse = await handleNotify("comment", "deleted");

      if (notifyResponse.ok) {
        if (mutate) {
          mutate();
        }

        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: `Comment deleted successfully`,
        });
      }
      if (!notifyResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem creating notification but comment was deleted`,
        });
      }
    }
    if (!commentResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: `There was a problem deleting comment. Please try again later`,
      });
    }
  };
  const handleDeletePerson = async () => {
    const deletion = result.name;

    const mediaResponse = await deleteUserMedia(deletion, "admin");

    if (mediaResponse.ok) {
      const userResponse = await deleteUser(deletion, "admin");

      if (userResponse.ok) {
        if (mutate) {
          mutate();
        }

        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: `Person deleted successfully`,
        });
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem deleting person. Please try again later`,
        });
      }
    }
    if (!mediaResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: `There was a problem deleting person. Please try again later`,
      });
    }
  };

  const handleUpdatePost = async () => {
    const submission = {
      _id: result._id,
      approved: action == "Deny" ? "false" : "true",
      feature: "false",
    };

    const postResponse = await updatePost(submission, "admin");

    if (action == "Deny") {
      if (postResponse.ok) {
        const notifyResponse = await handleNotify("post", "denied");

        if (notifyResponse.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message: `Post denied successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message: `There was a problem creating notification but post was denied`,
          });
        }
      }
      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem denying post. Please try again later`,
        });
      }
    } else {
      if (postResponse.ok) {
        if (mutate) {
          mutate();
        }
        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: `Post approved successfully`,
        });
      }
      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem approving post. Please try again later`,
        });
      }
    }
  };
  const handleUpdateComment = async () => {
    const submission = {
      id: result._id,
      approved: action == "Deny" ? "false" : "true",
    };

    const commentResponse = await updateComment(submission, "admin");

    if (action == "Deny") {
      if (commentResponse.ok) {
        const notifyResponse = await handleNotify("comment", "denied");

        if (notifyResponse.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message: `Comment denied successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message: `There was a problem creating notification but comment was denied`,
          });
        }
      }
      if (!commentResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem denying comment. Please try again later`,
        });
      }
    } else {
      if (commentResponse.ok) {
        if (mutate) {
          mutate();
        }
        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: `Comment approved successfully`,
        });
      }
      if (!commentResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem approving comment. Please try again later`,
        });
      }
    }
  };
  const handleUpdatePerson = async () => {
    const submission = {
      name: result.name,
      email: result.email,
      denials: action == "Deny" ? result.denials + 1 : result.denials,
      approved: action == "Approve" ? "true" : "false",
    };

    const userResponse = await updateUser(submission, "admin");

    if (action == "Deny") {
      if (userResponse.ok) {
        const notifyResponse = await handleNotify("profile item", "denied");

        if (notifyResponse.ok) {
          if (mutate) {
            mutate();
          }

          handleClose();
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message: `Profile denied successfully`,
          });
        }
        if (!notifyResponse.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message: `There was a problem creating notification but profile was denied`,
          });
        }
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem denying profile. Please try again later`,
        });
      }
    } else {
      if (userResponse.ok) {
        if (mutate) {
          mutate();
        }
        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: `Profile approved successfully`,
        });
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: `There was a problem approving profile. Please try again later`,
        });
      }
    }
  };

  const handleUpdateItem = async () => {
    switch (contentType) {
      case "Post":
        await handleUpdatePost();

        break;
      case "Comment":
        await handleUpdateComment();

        break;
      case "Person":
        await handleUpdatePerson();

        break;

      default:
        break;
    }
  };

  const handleDeleteItem = async () => {
    switch (contentType) {
      case "Post":
        await handleDeletePost();

        break;
      case "Comment":
        await handleDeleteComment();

        break;
      case "Person":
        await handleDeletePerson();

        break;

      default:
        break;
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
          onClick={
            action == "Delete"
              ? () => handleDeleteItem()
              : () => handleUpdateItem()
          }
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
