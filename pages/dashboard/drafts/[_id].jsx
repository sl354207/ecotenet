import useSWR from "swr";

import { useRouter } from "next/router";

import Link from "next/link";

import StepForm from "../../../components/PostForm/StepForm";

export default function DraftByUser() {
  // set id to id in url query
  const router = useRouter();
  const _id = router.query._id;
  // capture url path to pass to form
  const pathName = router.pathname;

  // retrieve drafts from drafts api. convert swr data to name posts.
  const { data: post } = useSWR(`/api/getdrafts/${_id}`);

  // loading state until draft is retrieved
  if (!post || post == undefined) return "Loading...";

  return (
    <div>
      <StepForm post={post} pathname={pathName} />

      <Link href="/dashboard/drafts">Go Back</Link>
    </div>
  );
}
