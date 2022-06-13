import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import {
  createPost,
  deleteComment,
  deletePost,
  deleteUser,
  updatePost,
} from "@utils/api-helpers";
import { useRouter } from "next/router";

const DashboardDialog = ({
  open,
  handleClose,
  contentType,
  action,
  className,
  result,
  name,
  setSnackbar,
  mutate,
}) => {
  const router = useRouter();

  let item;

  switch (contentType) {
    case "Post":
      item = "post";

      break;
    case "Comment":
      item = "comment";

      break;

    case "Person":
      item = "person";

      break;
    default:
      break;
  }

  const handleDeletePost = async () => {
    const deletion = {
      _id: result._id,
      name: name,
    };

    const postResponse = await deletePost(deletion, "dashboard");

    if (postResponse.ok) {
      if (mutate) {
        mutate();
      }

      handleClose();
      setSnackbar({
        open: true,
        severity: "success",
        message: `Post deleted successfully`,
      });
    }

    if (!postResponse.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `There was a problem deleting post. Please try again later`,
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
        mutate();
      }

      handleClose();
      setSnackbar({
        open: true,
        severity: "success",
        message: `Comment deleted successfully`,
      });
    }

    if (!commentResponse.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `There was a problem deleting comment. Please try again later`,
      });
    }
  };

  // UPDATE
  const handleDeletePerson = async () => {
    const deletion = result.name;

    const userResponse = await deleteUser(deletion, "dashboard");

    if (userResponse.ok) {
      if (mutate) {
        mutate();
      }

      handleClose();
      setSnackbar({
        open: true,
        severity: "success",
        message: `Person deleted successfully`,
      });
    }
    if (!userResponse.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `There was a problem deleting person. Please try again later`,
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
      approved: "pending",
      updated: true,
      featured: result.featured,
      date: new Date().toUTCString(),
      feature: "false",
    };

    const postResponse = await updatePost(submission, "dashboard");

    if (postResponse.ok) {
      handleClose();
      setSnackbar({
        open: true,
        severity: "success",
        message: `Post submitted successfully`,
      });
      router.reload();
    }

    if (!postResponse.ok) {
      setSnackbar({
        open: true,
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
      approved: "pending",
      updated: false,
      featured: false,
      date: new Date().toUTCString(),
      feature: "false",
    };

    const postResponse = await updatePost(submission, "dashboard");

    if (postResponse.ok) {
      handleClose();
      setSnackbar({
        open: true,
        severity: "success",
        message: `Post submitted successfully`,
      });
      router.reload();
    }
    if (!postResponse.ok) {
      setSnackbar({
        open: true,
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
      approved: "pending",
      updated: false,
      featured: false,
      date: new Date().toUTCString(),
      feature: "false",
    };

    const postResponse = await createPost(submission);

    if (postResponse.ok) {
      handleClose();
      const ID = await postResponse.json();
      router.push(`/dashboard/posts/${ID.insertedId}`);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Post submitted successfully",
      });
    }
    if (!postResponse.ok) {
      setSnackbar({
        open: true,
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
      aria-labelledby="update"
      aria-describedby="update"
    >
      <DialogTitle
        id="update"
        className={className}
        color="textPrimary"
        align="center"
      >
        {action == "delete" ? "Delete" : "Submit"}
      </DialogTitle>

      <DialogContent className={className}>
        <DialogContentText id="update" color="textPrimary">
          Are you sure you want to {action} {item}?
        </DialogContentText>
      </DialogContent>

      <DialogActions className={className}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={
            action == "delete"
              ? () => handleDeleteItem()
              : () => handleSubmitItem()
          }
          color="secondary"
          variant="outlined"
        >
          {action == "delete" ? "delete" : "submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardDialog;
