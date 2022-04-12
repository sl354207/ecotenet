// The editor core
import Editor, { Value } from "@react-page/editor";
import "@react-page/editor/lib/index.css";

import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";

import image from "@react-page/plugins-image";
import "@react-page/plugins-image/lib/index.css";

import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";

import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";

import divider from "@react-page/plugins-divider";

import {
  Button,
  IconButton,
  Typography,
  Link,
  Container,
  Divider,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";

import useSWR from "swr";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

import { useRouter } from "next/router";

import { useState } from "react";
import { Alert } from "@material-ui/lab";

import Header from "../../../components/Header";
import Vote from "../../../components/Vote";
import EditorLayout from "../../../components/EditorLayout";
import customImage from "../../../plugins/customImage";
import SurePostAdmin from "../../../components/SurePostAdmin";

const useStyles = makeStyles((theme) => ({
  description: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    flexGrow: 1,
    marginLeft: 20,
  },
  items: {
    display: "flex",
    // flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    // color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
  container: {
    backgroundColor: theme.palette.primary.main,
    // marginTop: "20px",
  },
  title: {
    paddingTop: "40px",
  },
  commentsection: {
    marginTop: 20,
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  button: {
    marginLeft: 4,
  },
  delete: {
    color: "#fc7ebf",
    borderColor: "#fc7ebf",
  },
  link: {
    color: theme.palette.secondary.light,
  },
}));

// Define which plugins we want to use.
const cellPlugins = [slate(), image, video, spacer, divider, customImage];

const fetcher = (url) => fetch(url).then((r) => r.json());
// pass in post and comments as props and create page for each post with corresponding comments
const post = () => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const ID = router.query.id;
  //   console.log(ID);

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (action) => {
    setDialog(true);
    setAction(action);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const { data: post, mutate } = useSWR(
    ID ? `/api/getposts/${ID}` : null,
    fetcher
  );

  let date;

  let list;

  if (!post || post == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        className={classes.progress}
      />
    );
  } else {
    date = new Date(post.date);
    list = (
      <>
        <Link href="/admin/posts" className={classes.link}>
          &#10229;Posts
        </Link>
        <Container className={classes.container}>
          <Header title={post.title} />
          <div className={classes.description}>
            <div className={classes.content}>
              <div className={classes.items}>
                <Typography align="center" variant="h6">
                  <Link href="#">{post.name}</Link>
                </Typography>
                <Typography
                  className={classes.publish}
                  align="left"
                  variant="h6"
                >
                  {date.toDateString()}
                </Typography>
              </div>
              <Typography variant="h6">
                Ecoregions:{" "}
                {post.ecoregions.map((ecoregion) => (
                  <Link href="#" color="secondary">
                    Eco-{ecoregion},{" "}
                  </Link>
                ))}
              </Typography>
            </div>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleOpenDialog("Approve")}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={() => handleOpenDialog("Deny")}
            >
              Deny
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={`${classes.button} ${classes.delete}`}
              onClick={() => handleOpenDialog("Delete")}
            >
              Delete
            </Button>
          </div>
          <EditorLayout>
            <Editor cellPlugins={cellPlugins} value={post} readOnly />
          </EditorLayout>
        </Container>
      </>
    );
  }

  return (
    <>
      {list}
      <SurePostAdmin
        post={post}
        action={action}
        open={dialog}
        handleClose={handleCloseDialog}
        ariaLabeledBy="alert-dialog-title"
        ariaDescribedBy="alert-dialog-description"
        id="alert-dialog-description"
        className={classes.dialog}
        sure="Are you sure you want to"
        setSnackbar={setSnackbar}
        mutate={mutate}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// fetch post data at build time
// export const getServerSideProps = async (context) => {
//   // context allows us to fetch specific data points from data such as id
//   const _id = context.params.id;

//   const post = await getPostById(_id);

//   const comments = await getPostComments(post._id.toString());

//   return {
//     props: {
//       post: JSON.parse(JSON.stringify(post)),
//       comments: JSON.parse(JSON.stringify(comments)),
//     },
//   };
// };

// build routing paths for each post at build time
// export const getStaticPaths = async () => {
//   const posts = await getFeatured();

//   // create array of ids of each post in posts
//   const ids = posts.map((post) => post._id);

//   // create paths array with objects that follow structure given
//   const paths = ids.map((id) => ({ params: { id: id.toString() } }));

//   // return a path for each post id. If no id return 404
//   return {
//     paths,
//     fallback: false,
//   };
// };

export default post;
