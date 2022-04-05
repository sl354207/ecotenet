import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const SureComment = ({
  open,
  handleClose,
  closeForm,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  value,
  postID,
  resultID,
  setSnackbar,
  mutate,
  pathName,
}) => {
  const router = useRouter();

  // function to delete post by id
  const deleteComment = async (resultID) => {
    const res = await fetch("/api/deleteComment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultID),
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
  const handleSubmit = async (value, post_id, comment_ref) => {
    //combine all objects and send to api
    const comment = {
      name: "Muskrat",
      post_id: post_id,
      comment_ref: comment_ref,
      date: new Date().toUTCString(),
      text: value,
      approved: "pending",
      updated: false,
    };

    const res = await fetch("/api/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    handleClose();

    if (res.ok) {
      closeForm();
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
          {sure}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={
            action == "submit"
              ? () => handleSubmit(value, postID, resultID)
              : () => deleteComment(resultID)
          }
          color="secondary"
          variant="outlined"
        >
          {action == "submit" ? "Submit" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SureComment;
