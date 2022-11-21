import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, List } from "@mui/material";
import theme from "@utils/theme";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

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
    <List sx={{ backgroundColor: theme.palette.primary.main }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleForm}
        endIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={showForm ? { marginBottom: "5px" } : { marginBottom: "10px" }}
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
          key={comment._id}
        />
      ))}
    </List>
  );
};

export default CommentList;
