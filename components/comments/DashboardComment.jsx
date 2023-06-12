import TextBox from "@components/inputFields/TextBox";
import Link from "@components/layouts/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { updateComment } from "@utils/apiHelpers";
import { useToxicity } from "@utils/textMod";
import theme from "@utils/theme";
import { useState } from "react";

const DashboardComment = ({
  result,
  handleOpenDialog,
  mutate,
  snackbar,
  setSnackbar,
  name,
  error,
  setError,
  model,
  modelLoading,
  setModelLoading,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  result.date = new Date(result.date);

  const [commentValue, setCommentValue] = useState("");

  // update text input field
  const handleCommentChange = (event) => {
    setCommentValue(event.target.value);
  };

  // handle comment submission to database through api
  const handleCommentUpdate = async (commentValue) => {
    let toxicComment = false;
    let modelError = false;
    setModelLoading(true);
    try {
      // Get toxicity of message
      toxicComment = await useToxicity(model, commentValue);

      setTimeout(() => setModelLoading(false), 1000);
    } catch (error) {
      console.log(error);
      modelError = true;
      setModelLoading(false);
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: "There was a problem saving comment. Please try again later",
      });
    }
    setError({
      bio: error.bio,
      website: error.website,
      socials: error.socials,
      comment: toxicComment,
    });
    if (!toxicComment && !modelError) {
      setError({
        bio: error.bio,
        website: error.website,
        socials: error.socials,
        comment: false,
      });
      //combine all objects and send to api
      const comment = {
        id: result._id,
        name: name,
        text: commentValue,
      };

      const updateResponse = await updateComment(comment, "dashboard");
      if (updateResponse.ok) {
        mutate(`/api/dashboard/comments?name=${name}`);
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: "Success! Comment will be visible upon approval",
        });
        setCommentValue("");
      }
      if (!updateResponse.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: "There was a problem saving comment. Please try again later",
        });
      }
    }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      {isMobile ? result.date.toLocaleDateString() : result.date.toDateString()}{" "}
      Approved: {result.approved}
      <div style={{ display: "flex", flexGrow: 1 }}>
        <FormControl
          sx={{ flexGrow: 1, marginTop: "5px" }}
          error={error.comment}
        >
          <InputLabel shrink htmlFor="dashboard-comment"></InputLabel>
          <TextBox
            defaultValue={result.text}
            placeHolder={null}
            id="dashboard-comment"
            handleChange={handleCommentChange}
            autoFocus={false}
            multiline={true}
            inputProps={{ type: "text", maxLength: 5000 }}
            error={error.comment}
          />
          <FormHelperText sx={{ color: theme.palette.text.primary }}>
            {error.comment ? "Inappropriate language" : <></>}
          </FormHelperText>
        </FormControl>
        {isMobile ? (
          <div style={{ display: "grid", margin: "auto 0px auto 8px" }}>
            <Link
              href={`/posts/${result.post_id}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              style={{ marginLeft: "9px" }}
            >
              View
            </Link>

            <Button
              variant="contained"
              color="secondary"
              sx={{
                margin: "4px 0px",
                minWidth: "56px",
                justifyContent: "center",
              }}
              size="small"
              onClick={() => handleCommentUpdate(commentValue)}
              disabled={
                commentValue.trim().length === 0 ||
                commentValue === result.text ||
                modelLoading
              }
            >
              {modelLoading ? <CircularProgress size={19} /> : <>Save</>}
            </Button>

            <IconButton
              edge="start"
              color="inherit"
              aria-label="filter"
              size="small"
              onClick={() => handleOpenDialog("delete", "Comment", result)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <div style={{ display: "grid", margin: "auto 0px auto 20px" }}>
            <Link
              href={`/posts/${result.post_id}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              style={{ marginLeft: "19px" }}
            >
              View Post
            </Link>

            <Button
              variant="contained"
              color="secondary"
              sx={{
                margin: "4px 0px",
                minWidth: "111px",
                justifyContent: "center",
              }}
              size="small"
              onClick={() => handleCommentUpdate(commentValue)}
              disabled={
                commentValue.trim().length === 0 ||
                commentValue === result.text ||
                modelLoading
              }
            >
              {modelLoading ? (
                <CircularProgress size={19} />
              ) : (
                <>Save Changes</>
              )}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              sx={{
                margin: "4px 0px",
                minWidth: "fit-content",
                justifyContent: "start",
              }}
              startIcon={<DeleteIcon />}
              size="small"
              onClick={() => handleOpenDialog("delete", "Comment", result)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComment;
