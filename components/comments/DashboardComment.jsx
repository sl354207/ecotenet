import Link from "@components/Link";
import TextBox from "@components/TextBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, FormControl, InputLabel } from "@mui/material";
import { updateComment } from "@utils/api-helpers";
import { useState } from "react";

// const useStyles = makeStyles(() => ({
//   // buttonGroup: {
//   //   display: "grid",
//   //   margin: "auto 0px auto 20px",
//   // },
//   // buttonEdit: {
//   //   margin: "4px 0px",
//   //   minWidth: "fit-content",
//   //   justifyContent: "start",
//   // },
//   // form: {
//   //   flexGrow: 1,
//   // },
//   // text: {
//   //   display: "flex",
//   //   flexGrow: 1,
//   // },
//   // comment: {
//   //   flexGrow: 1,
//   // },
// }));

const DashboardComment = ({
  result,
  handleDeleteOpen,
  mutate,
  snackbar,
  setSnackbar,
  name,
}) => {
  // const classes = useStyles();

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
      date: new Date().toUTCString(),
      text: commentValue,
      approved: "pending",
      updated: true,
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
    <div
      // className={classes.comment}
      style={{ flexGrow: 1 }}
    >
      <Link href={`/posts/${result.post_id}`} underline="hover">
        View Post
      </Link>{" "}
      {result.date} Approved: {result.approved}
      <div
        // className={classes.text}
        style={{ display: "flex", flexGrow: 1 }}
      >
        <FormControl
          // className={classes.form}
          sx={{ flexGrow: 1 }}
        >
          <InputLabel shrink htmlFor="dashboardcomment"></InputLabel>
          <TextBox
            defaultValue={result.text}
            placeHolder={null}
            id="dashboardcomment"
            handleChange={handleCommentChange}
            autoFocus={false}
          />
        </FormControl>
        <div
          // className={classes.buttonGroup}
          style={{ display: "grid", margin: "auto 0px auto 20px" }}
        >
          {commentValue != "" ? (
            <Button
              variant="contained"
              color="secondary"
              // className={classes.buttonEdit}
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
      </div>
    </div>
  );
};

export default DashboardComment;
