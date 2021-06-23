import Comment from "./Comment";

const Comments = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
