import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const Sure = ({
  open,
  handleClose,
  setOpen,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  value,
  postID,
  resultID,

  deleteFetch,
}) => {
  const router = useRouter();

  // function to delete post by id
  const deletePost = async (resultID, deleteFetch) => {
    const res = await fetch(`/api/${deleteFetch}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultID),
    });
    // setOpen(false);
    // reload page after deletion
    router.reload();
  };

  const handleSubmit = async (value, post_id, comment_ref) => {
    //convert comment values to key value pairs
    const textObject = {
      text: value,
    };

    const idObject = {
      post_id: post_id,
    };

    const refObject = {
      comment_ref: comment_ref,
    };

    const dateObject = {
      date: new Date().toUTCString(),
    };

    const updateObject = {
      updated: false,
    };
    //combine all objects and send to api
    const comment = Object.assign(
      idObject,
      refObject,
      dateObject,
      textObject,
      updateObject
    );

    const res = await fetch("/api/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    router.reload();
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
              : () => deletePost(resultID, deleteFetch)
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

export default Sure;
