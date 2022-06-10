import TextBox from "@components/TextBox";
import { Button, FormControl, InputLabel, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  buttonGroup: {
    display: "grid",
    margin: "auto 0px auto 20px",
  },
  buttonEdit: {
    margin: "4px 0px",
    minWidth: "fit-content",
    justifyContent: "start",
  },
  form: {
    flexGrow: 1,
  },
  text: {
    display: "flex",
    flexGrow: 1,
  },
  comment: {
    flexGrow: 1,
  },
}));

const DashboardComment = ({
  result,
  handleDeleteOpen,
  mutate,
  setSnackbar,
}) => {
  const classes = useStyles();

  const [commentValue, setCommentValue] = useState("");

  // update text input field
  const handleCommentChange = (event) => {
    setCommentValue(event.target.value);
  };

  // handle comment submission to database through api
  const handleCommentUpdate = async (commentValue) => {
    //combine all objects and send to api
    const comment = {
      _id: result._id,
      name: result.name,
      date: new Date().toUTCString(),
      text: commentValue,
      approved: "pending",
      updated: true,
    };

    const res = await fetch(`/api/dashboard/comments/${result._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Comment updated successfully",
      });
      setCommentValue("");
    }
  };

  return (
    <div className={classes.comment}>
      <Link href={`/posts/${result.post_id}`}>View Post</Link> {result.date}{" "}
      Approved: {result.approved}
      <div className={classes.text}>
        <FormControl className={classes.form}>
          <InputLabel shrink htmlFor="dashboardcomment"></InputLabel>
          <TextBox
            defaultValue={result.text}
            placeHolder={null}
            id="dashboardcomment"
            handleChange={handleCommentChange}
            autoFocus={false}
          />
        </FormControl>
        <div className={classes.buttonGroup}>
          {commentValue != "" ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonEdit}
              size="small"
              onClick={() => handleCommentUpdate(commentValue)}
            >
              Save Change
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonEdit}
              size="small"
              disabled
            >
              Save Change
            </Button>
          )}

          <Button
            variant="contained"
            color="secondary"
            className={classes.buttonEdit}
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
