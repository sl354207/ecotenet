import CommentList from "@components/comments/CommentList";
import ClientDialog from "@components/dialogs/ClientDialog";
import Flag from "@components/dialogs/Flag";
import EditorLayout from "@components/EditorLayout";
import Footer from "@components/Footer";
import Header from "@components/Header";
import { useUserContext } from "@components/UserContext";
import Vote from "@components/Vote";
import {
  Container,
  Divider,
  IconButton,
  Link,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FlagIcon from "@material-ui/icons/Flag";
import customImage from "@plugins/customImage";
// The editor core
import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import image from "@react-page/plugins-image";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";
import { getFeatures, getPostById, getPostComments } from "@utils/mongodb";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";

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
  flagBox: {
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
  const router = useRouter();
  const { user } = useUserContext();
  // console.log(user);
  // set post as value of editor
  const [value, setValue] = useState(post);

  //set count value for post
  const [count, setCount] = useState(post.count);

  const [dialog, setDialog] = useState(false);
  const [flag, setFlag] = useState(false);
  const [action, setAction] = useState("");
  const [item, setItem] = useState("");

  const [showForm, setShowForm] = useState(false);

  comments.forEach((reply) => {
    reply.open = false;
  });

  const reducer = (comments, toggle) => {
    if (toggle.type == "open") {
      return comments.map((comment) => {
        if (comment._id == toggle.payload) {
          comment.open = true;
        }

        return comment;
      });
    }
    if (toggle.type == "close") {
      return comments.map((comment) => {
        if (comment._id == toggle.payload) {
          comment.open = false;
        }

        return comment;
      });
    }
    if (toggle.type == "all") {
      return comments.map((comment) => {
        comment.open = false;

        return comment;
      });
    }
    // else {
    // POTENTIALLY ADD ERROR MESSAGE
    //   return menuItems;
    // }
  };

  const [state, dispatch] = useReducer(reducer, comments);

  const handleOpenDialog = (action, result) => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        setItem(result);
        setAction(action);

        setDialog(true);
        // console.log(action);
        // console.log(result);
        if (action == "Comment") {
          dispatch({ type: "open", payload: result.comment_ref });
        }
      }
    }
  };

  const handleCloseDialog = (reply) => {
    setDialog(false);

    if (reply == "reply") {
      dispatch({ type: "all" });
    }
    if (reply && reply !== "reply" && reply !== "") {
      dispatch({ type: "open", payload: reply });
    }
  };

  const toggleForm = () => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        setShowForm(!showForm);
      }
    }
  };
  const closeForm = () => {
    setShowForm(false);
  };

  const handleOpenFlag = (action, result) => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        setItem(result);
        setAction(action);
        setFlag(true);
      }
    }
  };

  const handleCloseFlag = () => {
    setFlag(false);
  };

  const handleReply = (toggle, ID) => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        dispatch({ type: toggle, payload: ID });
      }
    }
  };

  const date = new Date(post.date);

  return (
    <>
      <Container className={classes.container}>
        <div className={classes.flagBox}>
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
        closeForm={closeForm}
        name={user && user.name}
      />
      <Flag
        open={flag}
        handleClose={handleCloseFlag}
        contentType={action}
        result={item}
        name={user && user.name}
      />

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
