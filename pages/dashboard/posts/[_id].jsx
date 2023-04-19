import { useUserContext } from "@components/context/UserContext";
import StepForm from "@components/forms/StepForm";
import { Button, CircularProgress } from "@mui/material";
import fetcher from "@utils/fetcher";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

export default function DraftByUser() {
  const router = useRouter();
  const id = router.query._id;

  const { user } = useUserContext();
  const { mutate } = useSWRConfig();

  // retrieve drafts from drafts api. convert swr data to name posts.
  const {
    data: post,
    isLoading,
    error,
  } = useSWR(
    id && user && user.name
      ? `/api/dashboard/posts/${id}?name=${user.name}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  // loading state until draft is retrieved
  if (isLoading) {
    return (
      <>
        <NextSeo noindex={true} nofollow={true} />
        <CircularProgress
          color="secondary"
          size={100}
          disableShrink={true}
          sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
        />
      </>
    );
  } else {
    if (error) {
      return (
        <>
          <NextSeo noindex={true} nofollow={true} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                mutate(`/api/dashboard/posts/${id}?name=${user.name}`)
              }
            >
              Error Loading. Retry
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          {post && (
            <>
              <NextSeo noindex={true} nofollow={true} />
              <StepForm post={post} user={user} />
            </>
          )}
        </>
      );
    }
  }
}
