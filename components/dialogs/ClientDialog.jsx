import { useSnackbarContext } from "@components/context/SnackbarContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createComment, updatePost } from "@utils/apiHelpers";
import { useRouter } from "next/router";

const ClientDialog = ({
  open,
  handleClose,
  contentType,
  className,
  result,
  mutate,
  closeForm,
  post_id,
  name,
}) => {
  const router = useRouter();
  const { snackbar, setSnackbar } = useSnackbarContext();
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
        ...snackbar,
        open: true,
        severity: "success",
        message: "Comment submitted successfully",
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
      count: result.count,
      voters: [...result.voters, name],
    };
    const updateResponse = await updatePost(submission, "dashboard");

    if (updateResponse.ok) {
      handleClose();
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: `${contentType} submit successfully`,
      });
      mutate();
    }

    if (!updateResponse.ok) {
      setSnackbar({
        ...snackbar,
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
      <DialogTitle id="update" color="textPrimary" align="center">
        {contentType}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="update" color="textPrimary">
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
