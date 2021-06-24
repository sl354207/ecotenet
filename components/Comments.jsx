import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = ({ comments, post_id }) => {
  // const sortedComments = comments.sort(function (a, b) {
  //   return a.date.getTime() - b.date.getTime();
  // });
  // console.log(comments[0].date.getTime());
  // console.log(sortedComments);
  return (
    <div>
      {comments.map((comment) => (
        <Comment comment={comment} post_id={post_id} />
      ))}
      <CommentForm post_id={post_id} />
    </div>
  );
};

export default Comments;
