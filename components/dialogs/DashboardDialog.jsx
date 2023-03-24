import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  createPost,
  deleteComment,
  deletePost,
  deletePostMedia,
  deleteUser,
  deleteUserMedia,
  updatePost,
} from "@utils/apiHelpers";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const DashboardDialog = ({
  open,
  handleClose,
  contentType,
  action,
  result,
  name,
  snackbar,
  setSnackbar,
  mutate,
  fetchApi,
}) => {
  const router = useRouter();

  // used to display proper text in dialog
  let item;

  switch (contentType) {
    case "Post":
      item = "post";

      break;
    case "Comment":
      item = "comment";

      break;

    case "Person":
      item = "account";

      break;
    default:
      break;
  }

  const handleDeletePost = async () => {
    const deletion = {
      _id: result._id,
      name: name,
    };

    const mediaResponse = await deletePostMedia(
      deletion.name,
      deletion._id,
      "dashboard"
    );

    if (mediaResponse.ok) {
      const postResponse = await deletePost(deletion, "dashboard");

      if (postResponse.ok) {
        if (mutate) {
          mutate(fetchApi);
        }

        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: `Post deleted successfully`,
        });
      }

      if (!postResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem deleting post. Please try again later`,
        });
      }
    }
    if (!mediaResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem deleting post media. Please try again later`,
      });
    }
  };
  const handleDeleteComment = async () => {
    const deletion = {
      id: result._id,
      name: name,
    };

    const commentResponse = await deleteComment(deletion, "dashboard");

    if (commentResponse.ok) {
      if (mutate) {
        mutate(fetchApi);
      }

      handleClose();
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: `Comment deleted successfully`,
      });
    }

    if (!commentResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem deleting comment. Please try again later`,
      });
    }
  };

  // UPDATE
  const handleDeletePerson = async () => {
    const deletion = result.name;

    const mediaResponse = await deleteUserMedia(deletion, "dashboard");

    if (mediaResponse.ok) {
      const userResponse = await deleteUser(deletion, "dashboard");

      if (userResponse.ok) {
        handleClose();
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: "Account deleted successfully",
        });
        signOut({ callbackUrl: "/" });
      }
      if (!userResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: `There was a problem deleting your account. Please try again later`,
        });
      }
    }
    if (!mediaResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem deleting your account. Please try again later`,
      });
    }
  };

  const handleUpdatePublishedPost = async () => {
    const submission = {
      name: name,
      title: result.title,
      description: result.description,
      category: result.category,
      tags: result.tags,
      ecoregions: result.ecoregions,
      _id: result._id,
      id: result.id,
      version: result.version,
      rows: result.rows,
      status: "published",
      updated: true,
      featured: result.featured,
    };

    const postResponse = await updatePost(submission, "dashboard");

    if (postResponse.ok) {
      handleClose();
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: "Success! Post will be made public upon approval",
      });
      router.reload();
    }

    if (!postResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem submitting post. Please try again later`,
      });
    }
  };
  const handlePublishSavedDraft = async () => {
    const submission = {
      name: name,
      title: result.title,
      description: result.description,
      category: result.category,
      tags: result.tags,
      ecoregions: result.ecoregions,
      _id: result._id,
      id: result.id,
      version: result.version,
      rows: result.rows,
      status: "published",
      updated: false,
      featured: false,
    };

    const postResponse = await updatePost(submission, "dashboard");

    if (postResponse.ok) {
      handleClose();
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: "Success! Post will be made public upon approval",
      });
      router.reload();
    }
    if (!postResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem submitting post. Please try again later`,
      });
    }
  };
  const handlePublishNewDraft = async () => {
    const submission = {
      title: result.title,
      name: name,
      description: result.description,
      category: result.category,
      tags: result.tags,
      ecoregions: result.ecoregions,
      id: result.id,
      version: result.version,
      rows: result.rows,
      status: "published",
    };

    const postResponse = await createPost(submission);

    if (postResponse.ok) {
      handleClose();
      const ID = await postResponse.json();
      router.push(`/dashboard/posts/${ID.insertedId}`);
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: "Success! Post will be made public upon approval",
      });
    }
    if (!postResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `There was a problem submitting post. Please try again later`,
      });
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
  const handleSubmitItem = async () => {
    switch (action) {
      case "update":
        await handleUpdatePublishedPost();

        break;
      case "publish":
        await handlePublishSavedDraft();

        break;
      case "create":
        await handlePublishNewDraft();

        break;

      default:
        break;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      // aria-labelledby="update"
      // aria-describedby="update"
    >
      <DialogTitle
        id="dashboard-dialog-title"
        color="textPrimary"
        align="center"
      >
        {action === "delete" ? "Delete" : "Submit"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="dashboard-dialog-text" color="textPrimary">
          Are you sure you want to {action} {item}?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={
            action === "delete"
              ? () => handleDeleteItem()
              : () => handleSubmitItem()
          }
          color="secondary"
          variant="outlined"
        >
          {action === "delete" ? "delete" : "submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardDialog;
