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

  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  value,
  postID,
  resultID,
  postValue,
  details,
  clickInfo,
  pathName,
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

  const handleSubmit = async (
    value,
    post_id,
    comment_ref,
    postValue,
    details,
    clickInfo
  ) => {
    if (action == "comment") {
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
    } else {
      const ecoObject = {
        ecoregions: clickInfo,
      };
      // combine form value and editor value into one object to pass to api.
      const post = Object.assign(postValue, details, ecoObject);
      console.log(post);

      switch (pathName) {
        case "/dashboard/drafts/[_id]":
          // create post
          const res1 = await fetch("/api/createPost", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
          });

          if (res1.ok) {
            // delete draft once published
            const res2 = await fetch("/api/deleteDraft", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(post._id),
            });
          }

          break;
        case "/dashboard/posts/[_id]":
          const res2 = await fetch("/api/updatePost", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
          });
          break;
        case "editor":
          // send value to createPost api
          const res3 = await fetch("/api/createPost", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
          });
          break;

        default:
          break;
      }
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
            action == "comment" || action == "publish"
              ? () =>
                  handleSubmit(
                    value,
                    postID,
                    resultID,
                    postValue,
                    details,
                    clickInfo
                  )
              : () => deletePost(resultID, deleteFetch)
          }
          color="secondary"
          variant="outlined"
        >
          {action == "comment" || action == "publish" ? "Submit" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Sure;
