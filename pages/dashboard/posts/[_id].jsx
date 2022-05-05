import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import useSWR from "swr";
import StepForm from "../../../components/postForm/StepForm";

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
  const _id = router.query._id;
  // capture url path to pass to form
  const pathName = router.pathname;

  // retrieve drafts from drafts api. convert swr data to name posts.
  const { data: post } = useSWR(_id ? `/api/getposts/${_id}` : null, fetcher);

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

  return <StepForm post={post} pathName={pathName} />;
}
