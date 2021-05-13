import  useSWR  from 'swr'

import  DashboardPosts  from '../../../components/DashboardPosts'

// pass in posts from database as a prop
export default function PostsByUser() {
    // retrieve posts from posts api. convert swr data to name posts.

    // UPDATE TO GETPOSTSBYUSER
    const { data: posts} = useSWR('/api/getposts')
    
    // set loading state until posts data is retrieved
    if (!posts) return "Loading...";

    return (
        <div>
        {/* pass in posts data as a prop */}
        <DashboardPosts posts={posts}/>
        </div>
    )
}