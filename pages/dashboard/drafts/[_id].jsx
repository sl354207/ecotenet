import StepForm from "@components/postForm/StepForm";
import { useUserContext } from "@components/UserContext";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import useSWR from "swr";

const useStyles = makeStyles(() => ({
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DraftByUser() {
  const classes = useStyles();
  // set id to id in url query
  const router = useRouter();
  // console.log(router.query);
  const id = router.query._id;
  // capture url path to pass to form
  const pathName = router.pathname;
  // console.log(_id);

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
        className={classes.progress}
      />
    );

  return <StepForm post={post} pathName={pathName} user={user} />;
}
