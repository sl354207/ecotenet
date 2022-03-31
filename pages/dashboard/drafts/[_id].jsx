import useSWR from "swr";

import { useRouter } from "next/router";

import Link from "next/link";

import StepForm from "../../../components/PostForm/StepForm";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DraftByUser() {
  // set id to id in url query
  const router = useRouter();
  // console.log(router.query);
  const _id = router.query._id;
  // capture url path to pass to form
  const pathName = router.pathname;
  // console.log(_id);

  // retrieve drafts from drafts api. convert swr data to name posts.
  const { data: post } = useSWR(_id ? `/api/getposts/${_id}` : null, fetcher);

  // loading state until draft is retrieved
  if (!post || post == undefined) return "Loading...";

  return (
    <div>
      <StepForm post={post} pathName={pathName} />

      <Link href="/dashboard/drafts">Go Back</Link>
    </div>
  );
}
