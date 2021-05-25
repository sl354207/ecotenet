import  useSWR  from 'swr'

import  DashboardPosts  from '../../../components/Dashboard/DashboardPosts'

import { Button } from '@material-ui/core';

import { useRouter } from 'next/router'

// pass in posts from database as a prop
export default function PostsByUser() {

    const router = useRouter();
    
    // retrieve posts from posts api. convert swr data to name posts.

    // UPDATE TO GETPOSTSBYUSER
    const { data: posts} = useSWR('/api/getposts')
    
    // set loading state until posts data is retrieved
    if (!posts) return "Loading...";

    return (
        <div>
            {/* pass in posts data as a prop */}
            <DashboardPosts posts={posts}/>
            <Button onClick={()=>router.push('/dashboard/editor')}>Create New Post</Button>
        </div>
    )
}