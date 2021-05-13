import { useRouter } from 'next/router'

import { Button } from '@material-ui/core'; 

// pass in post as prop from DashboardDrafts which was created from posts data
const DashboardDraft = ({post}) => {
    const router = useRouter();

    const _id = post._id;
    
    // function to delete draft by id
    const deleteDraft = async (_id) => {
        const res = await fetch('/api/deleteDraft', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(_id),
        });

        // reload current page after deletion
        router.reload();
    }

    return (
        <div>
            <h3>{post._id}</h3>
            {/* push to draft url based on id */}
            <Button onClick={()=>router.push(`/dashboard/drafts/${post._id}`)}>Edit</Button>
            <Button onClick={()=>deleteDraft(_id)}>Delete</Button>
        </div>
        


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

export default DashboardDraft