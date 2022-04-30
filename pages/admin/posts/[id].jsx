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
  List,
  ListItem,
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

import AdminDialog from "../../../components/dialogs/AdminDialog";
import AdminCommentList from "../../../components/comments/AdminCommentList";
import Resolve from "../../../components/dialogs/Resolve";

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
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  buttonreply: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    marginLeft: 60,
    width: "auto",
    // margin: "10px auto",

    borderRadius: "10px",
  },
  buttonmobile: {
    display: "grid",
  },
  buttonup: {
    marginTop: 4,
  },

  delete: {
    color: "#fc7ebf",
    borderColor: "#fc7ebf",
  },

  comment: {
    display: "flow-root",
    flexGrow: 1,
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
  const comment_query = router.query.q;
  const flag = router.query.flag;

  const flagee = router.query.flagee;
  //   console.log(ID);

  const [dialog, setDialog] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

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

  const handleOpenDialog = (action, type, result) => {
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleOpenResolve = () => {
    setResolve(true);
  };

  const handleCloseResolve = () => {
    setResolve(false);
  };

  const { data: post } = useSWR(ID ? `/api/getposts/${ID}` : null, fetcher);

  const { data: comments, mutate } = useSWR(
    comment_query ? `/api/getPostComments?q=${ID}` : null,
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
        {comment_query ? (
          <Link href="/admin/flags">&#10229;Flags</Link>
        ) : (
          <Link href="/admin/posts">&#10229;Posts</Link>
        )}

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
            {!comment_query && (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOpenDialog("Approve", "post", post)}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => handleOpenDialog("Deny", "post", post)}
                >
                  Deny
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={`${classes.button} ${classes.delete}`}
                  onClick={() => handleOpenDialog("Delete", "post", post)}
                >
                  Delete
                </Button>
              </>
            )}
            {comment_query == "flag" && (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOpenResolve()}
                >
                  Resolve
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => handleOpenDialog("Deny", "post", post)}
                >
                  Deny
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={`${classes.button} ${classes.delete}`}
                  onClick={() => handleOpenDialog("Delete", "post", post)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
          <EditorLayout>
            <Editor cellPlugins={cellPlugins} value={post} readOnly />
          </EditorLayout>
        </Container>
      </>
    );
  }

  let commentList;
  if (!comment_query) {
    commentList = <></>;
  } else if (!comments || comments == undefined) {
    commentList = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        className={classes.progress}
      />
    );
  } else if (Array.isArray(comments) && comments.length == 0) {
    commentList = (
      <Typography variant="h6" align="center" className={classes.header}>
        no results
      </Typography>
    );
  } else {
    commentList = (
      <AdminCommentList
        comments={comments}
        comment_query={comment_query}
        handleOpenDialog={handleOpenDialog}
        handleOpenResolve={handleOpenResolve}
      />
    );
  }

  return (
    <>
      {list}

      {commentList}
      <AdminDialog
        contentType={action.type}
        action={action.action}
        open={dialog}
        handleClose={handleCloseDialog}
        className={classes.dialog}
        result={item}
        setSnackbar={setSnackbar}
        mutate={mutate}
      />
      <Resolve
        open={resolve}
        handleClose={handleCloseResolve}
        name={flagee}
        ID={flag}
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

export default post;
