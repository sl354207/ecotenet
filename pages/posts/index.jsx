// const { getPosts } = require('../../utils/mongodb');
import { getPosts } from "../../utils/mongodb";

import PostList from "../../components/PostList";
import { Container } from "@material-ui/core";

// pass in posts from database as a prop
export default function Posts({ posts }) {
  return (
    <Container>
      {/* pass in posts data as a prop */}
      <PostList posts={posts} />
    </Container>
  );
}

// retrieve data at build time
export const getStaticProps = async () => {
  const posts = await getPosts();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
