import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const SureVote = ({
  open,
  handleClose,

  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  value,
  postID,
  resultID,

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
    if (res.ok) {
      setSnackbar(true);
    }
    // setOpen(false);
    // reload page after deletion
    // router.reload();
  };

  const handleSubmit = async (value, post_id, comment_ref) => {
    // if (action == "comment") {
    //convert comment values to key value pairs
    // const textObject = {
    //   text: value,
    // };

    // const idObject = {
    //   post_id: post_id,
    // };

    // const refObject = {
    //   comment_ref: comment_ref,
    // };

    // const dateObject = {
    //   date: new Date().toUTCString(),
    // };

    // const updateObject = {
    //   updated: false,
    // };
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
    if (res.ok) {
      setSnackbar(true);
    }

    // router.reload();
    // }
    // else {
    //   const ecoObject = {
    //     ecoregions: clickInfo,
    //   };
    //   // combine form value and editor value into one object to pass to api.
    //   const post = Object.assign(postValue, details, ecoObject);
    //   console.log(post);

    //   switch (pathName) {
    //     case "/dashboard/drafts/[_id]":
    //       // create post
    //       const res1 = await fetch("/api/createPost", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(post),
    //       });

    //       if (res1.ok) {
    //         // delete draft once published
    //         const res2 = await fetch("/api/deleteDraft", {
    //           method: "DELETE",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify(post._id),
    //         });
    //       }

    //       break;
    //     case "/dashboard/posts/[_id]":
    //       const res2 = await fetch("/api/updatePost", {
    //         method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(post),
    //       });
    //       break;
    //     case "editor":
    //       // send value to createPost api
    //       const res3 = await fetch("/api/createPost", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(post),
    //       });
    //       break;

    //     default:
    //       break;
    //   }
    // }
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

export default SureVote;