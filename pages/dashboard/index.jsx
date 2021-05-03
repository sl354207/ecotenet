import  useSWR  from 'swr'


import  PostList  from '../../components/PostList'

// pass in posts from database as a prop
export default function Dashboard() {
    // retrieve posts from posts api. convert swr data to name posts.
    const { data: posts} = useSWR('/api/getPosts')
    console.log(posts);

    if (!posts) return "Loading...";

    return (
        <div>
        {/* pass in posts data as a prop */}
        <PostList posts={posts}/>
        </div>
    )
}