import { useSnackbarContext } from "@components/context/SnackbarContext";
import {
  Button,
  CircularProgress,
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
  setVote,
  setLimit,
  modelLoading,
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

  // const [toxic, setToxic] = useState(false);
  // const [spinner, setSpinner] = useState(true);

  // useEffect(() => {
  //   if (result.text) {
  //     const getToxic = async () => {
  //       setModelLoading(true);
  //       // console.log(model);
  //       try {
  //         // Get toxicity of message
  //         const classification = await useToxicity(model, result.text);
  //         // Save toxicity into state
  //         setToxic(classification);
  //         setModelError(false);
  //         setTimeout(() => {
  //           setModelLoading(false);
  //           setSpinner(false);
  //         }, 1000);
  //       } catch (error) {
  //         console.log(error);
  //         setModelError(true);
  //         setModelLoading(false);
  //         setSpinner(false);
  //       }
  //     };
  //     getToxic();
  //   }

  //   // console.log("test");
  // }, [result]);

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
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: "Success! Comment will be visible upon approval",
      });
    }
    if (!createResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
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
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: `${contentType} submitted successfully`,
      });
      mutate(`/api/votes/${post_id}`);
      setVote(0);
      setLimit(0);
    } else if (updateResponse.status === 406) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: `You have already voted on this post.`,
      });
    } else {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
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
          {contentType === "Vote" ? (
            <>Are you sure you want to submit {item}?</>
          ) : (
            <>
              {modelLoading ? (
                // || spinner
                <CircularProgress
                  color="secondary"
                  size={40}
                  disableShrink={true}
                  sx={{
                    margin: "0px 140px 0px 140px",
                    // margin: { xs: "auto", md: "0px 150px 0px 160px" },
                    display: "flex",
                    justifySelf: "center",
                  }}
                />
              ) : (
                // <>
                //   {modelError ? (
                //     <>Sorry there was an error please try again later</>
                //   ) : (
                // <>
                //   {toxic ? (
                //     <>Sorry this comment was found to be inappropriate</>
                //   ) : (
                <>Are you sure you want to submit {item}?</>
                //       )}
                //     </>
                //   )}
                // </>
              )}
            </>
          )}
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
            contentType === "Vote"
              ? () => handleVoteSubmit()
              : () => handleCommentSubmit()
          }
          color="secondary"
          variant="outlined"
          disabled={
            contentType === "Comment" &&
            // toxic ||
            modelLoading
            // || modelError
          }
        >
          {contentType}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDialog;
