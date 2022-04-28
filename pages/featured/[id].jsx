import Meta from "../../components/Meta";

import { getFeatures } from "../../utils/mongodb";
import { getPostById } from "../../utils/mongodb";
import { getPostComments } from "../../utils/mongodb";

// import Link from "next/link";

//do I need to import react
import { useReducer, useState } from "react";

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

import customImage from "../../plugins/customImage";

import EditorLayout from "../../components/EditorLayout";

import {
  Button,
  IconButton,
  Typography,
  Link,
  Container,
  Divider,
  Snackbar,
} from "@material-ui/core";

import Vote from "../../components/Vote";
import Nav from "../../components/Nav";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CommentList from "../../components/comments/CommentList";
import ClientDialog from "../../components/dialogs/ClientDialog";
import { Alert } from "@material-ui/lab";

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
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
}));

// Define which plugins we want to use.
const cellPlugins = [slate(), image, video, spacer, divider, customImage];

// pass in post and comments as props and create page for each post with corresponding comments
const post = ({ post, comments }) => {
  const classes = useStyles();
  // set post as value of editor
  const [value, setValue] = useState(post);

  //set count value for post
  const [count, setCount] = useState(post.count);

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState("");
  const [item, setItem] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  comments.forEach((reply) => {
    reply.open = false;
  });

  const reducer = (comments, toggle) => {
    // console.log(toggle);
    if (toggle.type == "open") {
      return comments.map((comment) => {
        if (comment._id == toggle.payload) {
          comment.open = true;
          // console.log(comment.open);
          // return comment;
        }
        // console.log(comment.open);
        // console.log(comments);
        return comment;
      });
    }
    if (toggle.type == "close") {
      return comments.map((comment) => {
        if (comment._id == toggle.payload) {
          comment.open = false;
          // console.log(comment.open);
          // return comment;
        }
        // console.log(comment.open);
        // console.log(comments);
        return comment;
      });
    }
    if (toggle.type == "all") {
      return comments.map((comment) => {
        comment.open = false;
        // console.log(comment.open);
        // return comment;

        // console.log(comment.open);
        // console.log(comments);
        return comment;
      });
    }
    // else {
    // POTENTIALLY ADD ERROR MESSAGE
    //   return menuItems;
    // }
  };

  const [state, dispatch] = useReducer(reducer, comments);
  // console.log(comments);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (action, result) => {
    setItem(result);
    setAction(action);

    setDialog(true);
    console.log(action);
    console.log(result);
    if (action == "Comment") {
      dispatch({ type: "open", payload: result.comment_ref });
    }
  };

  const handleCloseDialog = (reply) => {
    setDialog(false);
    // console.log(comments);
    if (reply == "reply") {
      dispatch({ type: "all" });
    }
    if (reply && reply !== "reply" && reply !== "") {
      dispatch({ type: "open", payload: reply });
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  const closeForm = () => {
    setShowForm(false);
    // setReply(false);
  };

  // const [reply, setReply] = useState(false);
  const handleReply = (toggle, ID) => {
    // console.log(state);
    dispatch({ type: toggle, payload: ID });
    // console.log(dispatch.toggle);
  };

  const date = new Date(post.date);

  return (
    <>
      <Container className={classes.container}>
        <Header title={post.title} />
        <div className={classes.description}>
          <div className={classes.content}>
            <div className={classes.items}>
              <Typography align="center" variant="h6">
                <Link href={`/person/${post.name}`} color="secondary">
                  {post.name}
                </Link>
              </Typography>
              <Typography className={classes.publish} align="left" variant="h6">
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

          <Vote
            post_count={post.count}
            count={count}
            setCount={setCount}
            handleOpenDialog={handleOpenDialog}
          />
        </div>
        <EditorLayout>
          <Editor
            cellPlugins={cellPlugins}
            value={value}
            onChange={setValue}
            readOnly
          />
        </EditorLayout>
        <Divider />
        <Typography variant="h6" className={classes.commentsection}>
          Comments:
        </Typography>
        <CommentList
          comments={state}
          post_id={post._id}
          handleOpenDialog={handleOpenDialog}
          showForm={showForm}
          handleForm={toggleForm}
          handleReply={handleReply}
        />
      </Container>

      <ClientDialog
        contentType={action}
        open={dialog}
        handleClose={handleCloseDialog}
        className={classes.dialog}
        post_id={post._id}
        result={item}
        setSnackbar={setSnackbar}
        closeForm={closeForm}
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
      <Footer />
    </>
  );
};

// fetch post data at build time
export const getStaticProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const _id = context.params.id;

  const post = await getPostById(_id);

  const comments = await getPostComments(post._id.toString());

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
    // revalidate: 10,
  };
};

// build routing paths for each post at build time
export const getStaticPaths = async () => {
  const posts = await getFeatures();

  // create array of ids of each post in posts
  const ids = posts.map((post) => post._id);

  // create paths array with objects that follow structure given
  const paths = ids.map((id) => ({ params: { id: id.toString() } }));

  // return a path for each post id. If no id return 404
  return {
    paths,
    fallback: false,
  };
};

export default post;
