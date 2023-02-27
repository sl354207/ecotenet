import { useSnackbarContext } from "@components/context/SnackbarContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createComment, updateVote } from "@utils/apiHelpers";

const ClientDialog = ({
  open,
  handleClose,
  contentType,
  result,
  mutate,
  closeForm,
  post_id,
  name,
}) => {
  const { snackbar, setSnackbar } = useSnackbarContext();

  // used to display proper text in dialog
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
      text: result.text,
    };

    const createResponse = await createComment(submission);
    handleClose("reply");

    if (createResponse.ok) {
      if (closeForm) {
        closeForm();
      }

      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: "Success! Comment will be visible upon approval",
      });
    }
    if (!createResponse.ok) {
      setSnackbar({
        ...snackbar,
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
      vote: result.vote,
    };
    const updateResponse = await updateVote(submission);

    if (updateResponse.ok) {
      handleClose();
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: `${contentType} submitted successfully`,
      });
      mutate(`/api/votes/${post_id}`);
    } else if (updateResponse.status == 406) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: `You have already voted on this post.`,
      });
    } else {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: `There was a problem submitting ${item}. Please try again later`,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      // aria-labelledby="update"
      // aria-describedby="update"
    >
      <DialogTitle id="client-dialog-title" color="textPrimary" align="center">
        {contentType}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="client-dialog-text" color="textPrimary">
          Are you sure you want to submit {item}?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
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
