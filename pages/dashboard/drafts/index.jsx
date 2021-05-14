import  useSWR  from 'swr'

import  DashboardDrafts  from '../../../components/DashboardDrafts'

import { Button } from '@material-ui/core';

import { useRouter } from 'next/router'

// pass in posts from database as a prop
export default function DraftsByUser() {

    const router = useRouter();

    // retrieve posts from posts api. convert swr data to name posts.

    // UPDATE TO GETDRAFTSBYUSER
    const { data: drafts} = useSWR('/api/getdrafts')
    
    // show loading state until drafts are retrieved
    if (!drafts) return "Loading...";

    return (
        <div>
        {/* pass in posts data as a prop */}
        <DashboardDrafts posts={drafts}/>
        <Button onClick={()=>router.push('/dashboard/editor')}>Create New Draft</Button>
        </div>
    )
}