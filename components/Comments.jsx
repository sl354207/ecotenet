import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { List } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  comments: {
    backgroundColor: theme.palette.primary.main,
    // border: "1px solid",
  },
}));

//pass in comments and post id from parent post
const Comments = ({ comments, post_id }) => {
  const classes = useStyles();
  const theme = useTheme();
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
      {sortedComments.map((comment) => (
        <Comment comment={comment} post_id={post_id} />
      ))}
      <CommentForm post_id={post_id} comment_ref="" />
    </List>
  );
};

export default Comments;
