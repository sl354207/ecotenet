import  useSWR  from 'swr'
import { useRouter } from 'next/router'

// pass in posts from database as a prop
export default function DraftByUser() {
  // set id to id in url query
  const router = useRouter();
  const  _id  = router.query._id;
  
  // retrieve posts from posts api. convert swr data to name posts.
  const { data: draft} = useSWR(`/api/getdrafts/${_id}`)
  
  // loading state until draft is retrieved
  if (!draft) return "Loading...";

  return (
      <div>
      <h1>
          {draft._id}
      </h1>
      </div>
  )
}