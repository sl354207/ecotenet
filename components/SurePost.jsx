import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { useRouter } from "next/router";

const SurePost = ({
  open,
  handleClose,
  ariaLabeledBy,
  ariaDescribedBy,
  className,
  id,
  sure,
  action,
  postValue,
  details,
  clickInfo,
  approved,
  resultID,
  setSnackbar,
  mutate,
  pathName,
}) => {
  const router = useRouter();

  // function to delete post by id
  const deletePost = async (resultID) => {
    const res = await fetch("/api/deletePost", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultID),
    });
    handleClose("post");
    if (res.ok) {
      mutate();
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
        message: "There was a problem deleting comment. Please try again later",
      });
    }
  };

  // UPDATE ONCE AUTHENTICATION IS USED
  // function to create a published post. Takes in form values and editor value
  const publish = async (postValue, details, clickInfo) => {
    const ecoObject = {
      ecoregions: clickInfo,
    };

    const silentObject = {
      _id: resultID,
      name: "Muskrat",
      status: "published",
      approved: "pending",
      updated: approved == "true" ? true : false,
      featured: false,
    };
    // combine form value and editor value into one object to pass to api.
    const value = Object.assign(postValue, details, ecoObject, silentObject);
    // console.log(value);

    switch (pathName) {
      case "/dashboard/drafts/[_id]":
        // create post
        const res1 = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        handleClose("post");

        if (res1.ok) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Draft published successfully",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem publishing draft. Please try again later",
          });
        }

        break;
      case "/dashboard/posts/[_id]":
        const res2 = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        handleClose("post");

        if (res2.ok) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Post published successfully",
          });
        }
        if (!res2.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem publishing post. Please try again later",
          });
        }
        break;
      case "/dashboard/editor":
        break;

      default:
        break;
    }
  };

  const create = async (postValue, details, clickInfo) => {
    const ecoObject = {
      ecoregions: clickInfo,
    };
    const silentObject = {
      name: "Muskrat",
      status: "published",
      approved: "pending",
      updated: false,
      featured: false,
    };
    // combine form value and editor value into one object to pass to api.
    const value = Object.assign(postValue, details, ecoObject, silentObject);
    console.log(value);

    const res = await fetch("/api/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    // console.log(res);
    handleClose("post");

    if (res.ok) {
      const ID = await res.json();
      router.push(`/dashboard/posts/${ID.insertedId}`);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Draft published successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem publishing draft. Please try again later",
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
        {pathName == "editor" ? (
          <Button
            onClick={
              action == "submit"
                ? () => create(postValue, details, clickInfo)
                : () => deletePost(resultID)
            }
            color="secondary"
            variant="outlined"
          >
            {action == "submit" ? "Submit" : "Delete"}
          </Button>
        ) : (
          <Button
            onClick={
              action == "submit"
                ? () => publish(postValue, details, clickInfo)
                : () => deletePost(resultID)
            }
            color="secondary"
            variant="outlined"
          >
            {action == "submit" ? "Submit" : "Delete"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SurePost;
