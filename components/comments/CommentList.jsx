import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useState } from "react";
import { List, Button } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles((theme) => ({
  comments: {
    backgroundColor: theme.palette.primary.main,
    // border: "1px solid",
  },
  add: {
    marginBottom: 5,
  },
  noadd: {
    marginBottom: 10,
  },
}));

//pass in comments and post id from parent post
const CommentList = ({
  comments,
  post_id,
  showForm,
  handleForm,
  handleOpenDialog,
  handleOpenFlag,
  handleReply,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  // console.log(comments);

  //if comment doesn't have a ref(initial comment) than make ref same as comment id. Convert comment date from string to date object
  const dateComments = comments.map((comment) => {
    if (comment.comment_ref === "") {
      comment.comment_ref = comment._id;
      comment.date = new Date(comment.date);
      return comment;
    }
    comment.date = new Date(comment.date);
    return comment;
  });
  //sort comments so all comments are grouped together by ref(initial comment and replies) and then each group is sorted based on date created
  const sortedComments = dateComments.sort(function (a, b) {
    return (
      a.comment_ref.localeCompare(b.comment_ref) ||
      a.date.getTime() - b.date.getTime()
    );
  });

  return (
    <List className={classes.comments}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleForm}
        endIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        className={showForm ? classes.add : classes.noadd}
      >
        Add Comment
      </Button>
      <CommentForm
        post_id={post_id}
        comment_ref=""
        showForm={showForm}
        handleOpenDialog={handleOpenDialog}
      />
      {sortedComments.map((comment) => (
        <Comment
          comment={comment}
          post_id={post_id}
          handleOpenDialog={handleOpenDialog}
          handleOpenFlag={handleOpenFlag}
          handleReply={handleReply}
        />
      ))}
    </List>
  );
};

export default CommentList;
