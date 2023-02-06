import TextBox from "@components/inputFields/TextBox";
import Link from "@components/layouts/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { updateComment } from "@utils/apiHelpers";
import theme from "@utils/theme";
import { useState } from "react";

const DashboardComment = ({
  result,
  handleDeleteOpen,
  mutate,
  snackbar,
  setSnackbar,
  name,
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
    //combine all objects and send to api
    const comment = {
      id: result._id,
      name: name,
      text: commentValue,
    };

    const updateResponse = await updateComment(comment, "dashboard");
    if (updateResponse.ok) {
      mutate();
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: "Comment updated successfully",
      });
      setCommentValue("");
    }
    if (!updateResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: "There was a problem saving comment. Please try again later",
      });
    }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      {isMobile ? result.date.toLocaleDateString() : result.date.toDateString()}{" "}
      Approved: {result.approved}
      <div style={{ display: "flex", flexGrow: 1 }}>
        <FormControl sx={{ flexGrow: 1, marginTop: "5px" }}>
          <InputLabel shrink htmlFor="dashboard-comment"></InputLabel>
          <TextBox
            defaultValue={result.text}
            placeHolder={null}
            id="dashboard-comment"
            handleChange={handleCommentChange}
            autoFocus={false}
            multiline={true}
            inputProps={{ type: "text", maxLength: 5000 }}
          />
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
            {commentValue != "" ? (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  margin: "4px 0px",
                  minWidth: "fit-content",
                  justifyContent: "center",
                }}
                size="small"
                onClick={() => handleCommentUpdate(commentValue)}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  margin: "4px 0px",
                  minWidth: "fit-content",
                  justifyContent: "center",
                }}
                size="small"
                disabled
              >
                Save
              </Button>
            )}

            {/* <Button
              variant="contained"
              color="secondary"
              sx={{
                margin: "4px 0px",
                minWidth: "fit-content",
                justifyContent: "start",
              }}
              startIcon={<DeleteIcon />}
              size="small"
              onClick={handleDeleteOpen}
            ></Button> */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="filter"
              size="small"
              onClick={handleDeleteOpen}
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
            {commentValue != "" ? (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  margin: "4px 0px",
                  minWidth: "fit-content",
                  justifyContent: "start",
                }}
                size="small"
                onClick={() => handleCommentUpdate(commentValue)}
              >
                Save Change
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  margin: "4px 0px",
                  minWidth: "fit-content",
                  justifyContent: "start",
                }}
                size="small"
                disabled
              >
                Save Change
              </Button>
            )}

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
              onClick={handleDeleteOpen}
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
