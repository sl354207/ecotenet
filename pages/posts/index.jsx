
// import getPosts from '../utils/mongodb'
const { getPosts } = require('../../utils/mongodb');

import PostList from '../../components/PostList'

// pass in posts from database as a prop
export default function Posts({posts}) {
  return (
    <div>
      {/* pass in posts data as a prop */}
      <PostList posts={posts}/>
    </div>
  )
}

// retrieve data at build time
export const getStaticProps = async () => {
    const posts = await getPosts();
  
    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts))
      }
    }
  
  }