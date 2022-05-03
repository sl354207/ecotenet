import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";

const ClientDialog = ({
  open,
  handleClose,
  contentType,
  className,
  result,
  setSnackbar,
  mutate,
  closeForm,
  post_id,
}) => {
  let endpoint;
  let item;
  let submission;

  switch (contentType) {
    case "Vote":
      endpoint = "Count";
      item = "vote";
      submission = {
        _id: post_id,
        count: result,
      };
      break;
    case "Comment":
      endpoint = "Comment";
      item = "comment";
      submission = {
        name: "Muskrat",
        post_id: post_id,
        comment_ref: result.comment_ref,
        date: new Date().toUTCString(),
        text: result.text,
        approved: "pending",
        updated: false,
      };
      break;

    default:
      break;
  }

  const handleSubmit = async () => {
    if (contentType == "Comment") {
      const res = await fetch("/api/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });
      handleClose("reply");

      if (res.ok) {
        if (closeForm) {
          closeForm();
        }

        setSnackbar({
          open: true,
          severity: "success",
          message: "Comment submitted successfully",
        });
      }
      if (!res.ok) {
        setSnackbar({
          open: true,
          severity: "error",
          message:
            "There was a problem submitting comment. Please try again later",
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

      if (res.ok) {
        if (mutate) {
          mutate();
        }
        handleClose();
        setSnackbar({
          open: true,
          severity: "success",
          message: `${contentType} submit successfully`,
        });
      }
      if (!res.ok) {
        setSnackbar({
          open: true,
          severity: "error",
          message: `There was a problem submitting ${item}. Please try again later`,
        });
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
        {contentType}
      </DialogTitle>

      <DialogContent className={className}>
        <DialogContentText id="update" color="textPrimary">
          Are you sure you want to submit {item}?
        </DialogContentText>
      </DialogContent>

      <DialogActions className={className}>
        <Button
          onClick={() => handleClose(submission.comment_ref)}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color="secondary"
          variant="outlined"
        >
          {contentType}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDialog;
