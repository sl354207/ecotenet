import { useUserContext } from "@components/context/UserContext";
import StepForm from "@components/forms/StepForm";
import { CircularProgress } from "@mui/material";
import fetcher from "@utils/fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function DraftByUser() {
  // set id to id in url query
  const router = useRouter();
  const id = router.query._id;

  const { user } = useUserContext();

  // retrieve drafts from drafts api. convert swr data to name posts.
  const { data: post } = useSWR(
    id ? `/api/dashboard/posts/${id}?name=${user.name}` : null,
    fetcher
  );

  // loading state until draft is retrieved
  if (!post || post == undefined)
    return (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );

  return <StepForm post={post} user={user} />;
}
