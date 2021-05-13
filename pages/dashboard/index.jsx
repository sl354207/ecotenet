import { useRouter } from 'next/router'

import { Button } from '@material-ui/core';

export default function Dashboard() {
    
    const router = useRouter();

    return (
        <div>
            <Button onClick={()=>router.push('/dashboard/posts')}>Posts</Button>
            <Button onClick={()=>router.push('/dashboard/drafts')}>Drafts</Button>
        </div>
    )
}