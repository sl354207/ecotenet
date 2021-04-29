import Link from 'next/link'

// pass in post as prop from PostList which was created from posts data
const PostItem = ({post}) => {
    return (
        <h3>{post._id}</h3>
        // link to each post by id from data
        // <Link href='/post/[id]' as={`post/${post.id}`}>
        //     {/* add content and styling to PostItem */}
        //     <a className={postStyles.card}>
        //         <h3>{post.title} &rarr;</h3>
        //         <p>{post.excerpt}</p>
        //     </a>
        // </Link>
    )
}

export default PostItem