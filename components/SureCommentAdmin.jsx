import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const SureCommentAdmin = ({
  open,
  handleClose,
  comment,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  setSnackbar,
  mutate,
}) => {
  const router = useRouter();

  // function to delete post by id
  const deleteComment = async (ID) => {
    const res = await fetch("/api/deleteComment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ID),
    });
    handleClose();
    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Comment deleted successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem deleting comment. Please try again later",
      });
    }
  };

  // ADD ERROR SNACKBAR
  const handleSubmit = async (comment, action) => {
    //combine all objects and send to api
    const submission = {
      _id: comment._id,
      date: comment.date,
      text: comment.text,
      approved: action == "Approve" ? "true" : "false",
      updated: comment.updated,
    };

    const res = await fetch("/api/updateComment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });
    handleClose();

    if (res.ok) {
      mutate();
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
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabeledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogContent className={className}>
        <DialogContentText id={id} color="textPrimary">
          {sure} {action}?
        </DialogContentText>
      </DialogContent>
      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={
            action == "Approve" || action == "Deny"
              ? () => handleSubmit(comment, action)
              : () => deleteComment(comment._id)
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

export default SureCommentAdmin;
