import Comment from "./Comment";
import CommentForm from "./CommentForm";

//pass in comments and post id from parent post
const Comments = ({ comments, post_id }) => {
  //if comment doesn't have a ref than make ref same as comment id. Convert comment date from string to date object
  const dateComments = comments.map((comment) => {
    if (comment.comment_ref === "") {
      comment.comment_ref = comment._id;
      comment.date = new Date(comment.date);
      return comment;
    }
    comment.date = new Date(comment.date);
    return comment;
  });
  //sort comments so all comments are grouped together by ref and then each group is sorted based on date created
  const sortedComments = dateComments.sort(function (a, b) {
    return (
      a.comment_ref.localeCompare(b.comment_ref) ||
      a.date.getTime() - b.date.getTime()
    );
  });

  return (
    <div>
      {sortedComments.map((comment) => (
        <Comment comment={comment} post_id={post_id} />
      ))}
      <CommentForm post_id={post_id} comment_ref="" />
    </div>
  );
};

export default Comments;
