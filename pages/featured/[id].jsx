import { getFeatures } from "../../utils/mongodb";
import { getPostById } from "../../utils/mongodb";
import { getPostComments } from "../../utils/mongodb";

import { useReducer, useState } from "react";

// The editor core
import Editor from "@react-page/editor";
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
  IconButton,
  Typography,
  Link,
  Container,
  Divider,
  Snackbar,
} from "@material-ui/core";

import FlagIcon from "@material-ui/icons/Flag";

import Vote from "../../components/Vote";

import { makeStyles } from "@material-ui/core/styles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CommentList from "../../components/comments/CommentList";
import ClientDialog from "../../components/dialogs/ClientDialog";
import { Alert } from "@material-ui/lab";
import Flag from "../../components/dialogs/Flag";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "column",
    maxWidth: 800,
    flexGrow: 1,
    marginLeft: 20,
  },
  items: {
    display: "flex",
  },
  date: {
    marginLeft: 20,
    fontStyle: "italic",
  },
  container: {
    backgroundColor: theme.palette.primary.main,
  },
  comments: {
    marginTop: 20,
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  flagbox: {
    display: "flex",
    justifyContent: "center",
  },
  spacer: {
    display: "flex",
    marginRight: "auto",
    visibility: "hidden",
    minWidth: 30,
  },
  flag: {
    display: "flex",
    marginLeft: "auto",
    marginTop: "auto",
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
  const [flag, setFlag] = useState(false);
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

  const handleOpenFlag = (action, result) => {
    setItem(result);
    setAction(action);
    setFlag(true);
  };

  const handleCloseFlag = () => {
    setFlag(false);
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
        <div className={classes.flagbox}>
          <div className={classes.spacer}></div>
          <Header title={post.title} />
          <IconButton
            className={classes.flag}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenFlag("post", post)}
          >
            <FlagIcon />
          </IconButton>
        </div>
        <div className={classes.box}>
          <div className={classes.content}>
            <div className={classes.items}>
              <Typography align="center" variant="h6">
                <Link href={`/person/${post.name}`} color="secondary">
                  {post.name}
                </Link>
              </Typography>
              <Typography className={classes.date} align="left" variant="h6">
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
        <Typography variant="h6" className={classes.comments}>
          Comments:
        </Typography>
        <CommentList
          comments={state}
          post_id={post._id}
          handleOpenDialog={handleOpenDialog}
          handleOpenFlag={handleOpenFlag}
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
      <Flag
        open={flag}
        handleClose={handleCloseFlag}
        contentType={action}
        result={item}
        setSnackbar={setSnackbar}
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
