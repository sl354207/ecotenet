import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const SurePostAdmin = ({
  open,
  handleClose,
  post,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  setSnackbar,
}) => {
  const router = useRouter();

  // function to delete post by id
  const deletePost = async (ID) => {
    const res = await fetch("/api/deletePost", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ID),
    });
    handleClose();
    if (res.ok) {
      setSnackbar({
        open: true,
        severity: "success",
        message: "Post deleted successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem deleting post. Please try again later",
      });
    }
  };

  // ADD ERROR SNACKBAR
  const handleSubmit = async (post, action) => {
    //combine all objects and send to api
    const submission = {
      title: post.title,
      description: post.description,
      category: post.category,
      tags: post.tags,
      ecoregions: post.ecoregions,
      _id: post._id,
      id: post.id,
      version: post.version,
      rows: post.rows,
      status: post.status,
      approved: action == "Approve" ? "true" : "false",
      updated: post.updated,
      featured: post.featured,
      date: post.date,
      feature: post.feature,
    };

    const res = await fetch("/api/updatePost", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });
    handleClose();

    if (res.ok) {
      setSnackbar({
        open: true,
        severity: "success",
        message: "Post submitted successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem submitting post. Please try again later",
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
              ? () => handleSubmit(post, action)
              : () => deletePost(post._id)
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

export default SurePostAdmin;
