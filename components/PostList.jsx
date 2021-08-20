import PostItem from "./PostItem";

// pass down posts from database to PostList as a prop
const PostList = ({ posts }) => {
  return (
    <div>
      {/* for each post in posts data create a new PostItem component */}
      {/* pass in each post as a prop to PostItem */}
      {posts.map((post) => (
        <PostItem post={post} />
      ))}
    </div>
  );
};

export default PostList;
