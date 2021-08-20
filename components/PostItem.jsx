import Link from "next/link";

// pass in post as prop from PostList
const PostItem = ({ post }) => {
  return (
    // {/* // link to each post by id from data */}
    <Link href="/posts/[_id]" as={`posts/${post._id}`}>
      {/* add content and styling to PostItem */}
      <a>
        <h3>{post._id} &rarr;</h3>
      </a>
    </Link>
  );
};

export default PostItem;
