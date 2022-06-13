import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { createComment, updatePost } from "@utils/api-helpers";

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
  name,
}) => {
  let item;

  switch (contentType) {
    case "Vote":
      item = "vote";

      break;
    case "Comment":
      item = "comment";

      break;

    default:
      break;
  }

  const handleCommentSubmit = async () => {
    const submission = {
      name: name,
      post_id: post_id,
      comment_ref: result.comment_ref,
      date: new Date().toUTCString(),
      text: result.text,
      approved: "pending",
      updated: false,
    };

    const createResponse = await createComment(submission);
    handleClose("reply");

    if (createResponse.ok) {
      if (closeForm) {
        closeForm();
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: "Comment submitted successfully",
      });
    }
    if (!createResponse.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "There was a problem submitting comment. Please try again later",
      });
    }
  };

  const handleVoteSubmit = async () => {
    const submission = {
      _id: post_id,
      name: name,
      count: result,
    };
    const updateResponse = await updatePost(submission, "dashboard");

    if (updateResponse.ok) {
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
    if (!updateResponse.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `There was a problem submitting ${item}. Please try again later`,
      });
    }
    // }
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
          onClick={() => handleClose(result.comment_ref)}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={
            contentType == "Vote"
              ? () => handleVoteSubmit()
              : () => handleCommentSubmit()
          }
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
