import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = ({ comments, post_id }) => {
  const dateComments = comments.map((comment) => {
    if (comment.comment_ref === "") {
      comment.comment_ref = comment._id;
      comment.date = new Date(comment.date);
      return comment;
    }
    comment.date = new Date(comment.date);
    return comment;
  });

  const sortedComments = dateComments.sort(function (a, b) {
    return (
      a.comment_ref.localeCompare(b.comment_ref) ||
      a.date.getTime() - b.date.getTime()
    );
  });
  // console.log(dateComments[7].date.getTime());
  // console.log(comments);
  // console.log(sortedComments);

  // console.log(typeof dateComments[7].date);
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
