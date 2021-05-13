import  useSWR  from 'swr'
import { useRouter } from 'next/router'

// pass in posts from database as a prop
export default function PostByUser() {
    
  // set id to id in url query
  const router = useRouter();
  const  _id  = router.query._id;
  
  // retrieve posts from posts api. convert swr data to name post.
  const { data: post} = useSWR(`/api/getposts/${_id}`)
  
  // set loading state until post data is retrieved
  if (!post) return "Loading...";

  return (
      <div>
      <h1>
          {post._id}
      </h1>
      </div>
  )
}