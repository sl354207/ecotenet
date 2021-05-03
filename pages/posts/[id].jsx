import Meta from '../../components/Meta'

import { getPosts } from '../../utils/mongodb'

import { getPostById } from '../../utils/mongodb'

// import Link from 'next/link'


// pass in post from data.js as prop and create page for each post
const post = ({ post }) => {
    // const router = useRouter()
    // const { id } = router.query
    
    return (
        <>
            <h1>{post._id}</h1>
            {/* <Meta title={post.title} />
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <br />
            <Link href='/'>Go Back</Link> */}
        </>
    )
}

// fetch post data at build time
export const getStaticProps = async (context) => {
    // context allows us to fetch specific data points from data such as id
    const _id = context.params.id;

    const post = await getPostById(_id);
    
    return {
        props: {
            post: JSON.parse(JSON.stringify(post))
        }
    }
}

// build routing paths for each post at build time
export const getStaticPaths = async () => {
    
    const posts = await getPosts();
    

    // create array of ids of each post in posts
    const ids = posts.map(post => post._id)

    // create paths array with objects that follow structure given
    const paths = ids.map(id => ({params: {id: id.toString()}}))

    

    // return a path for each post id. If no id return 404
    return {
        paths,
        fallback: false
    }
}



export default post