import CommentList from "@components/comments/CommentList";
import { useUserContext } from "@components/context/UserContext";
import ClientDialog from "@components/dialogs/ClientDialog";
import Flag from "@components/dialogs/Flag";
import Link from "@components/layouts/Link";
import Vote from "@components/layouts/Vote";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FlagIcon from "@mui/icons-material/Flag";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import customImage from "@plugins/customImage";
// import Frame from "react-frame-component";
// The editor core
import Editor from "@react-page/editor";
// import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";
import { useOnScreenClient } from "@utils/useOnScreen";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import useSWR from "swr";

// Define which plugins we want to use.
const cellPlugins = [slate(), customImage, video, spacer, divider];

const fetcher = (url) => fetch(url).then((r) => r.json());
const DrawerPost = ({ id, FSOpen }) => {
  const { data: post } = useSWR(id ? `/api/posts/${id}` : null, fetcher);

  const router = useRouter();
  const { user } = useUserContext();

  const [ref, entry] = useOnScreenClient({
    threshold: 1,
  });

  // set post as value of editor
  const [value, setValue] = useState(post);
  // console.log(post);

  const [dialog, setDialog] = useState(false);
  const [flag, setFlag] = useState(false);
  const [action, setAction] = useState("");
  const [item, setItem] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loadComments, setLoadComments] = useState(false);

  const { data: comments, error } = useSWR(
    loadComments ? `/api/comments/${post._id}` : null,
    fetcher
  );
  // console.log(user);

  const { data: votes, mutate } = useSWR(`/api/votes/${id}`, fetcher);

  const reducer = (comments, toggle) => {
    // console.log(comments);
    // console.log(toggle);
    if (toggle.type == "load") {
      return toggle.payload;
    }
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
  };

  const [state, dispatch] = useReducer(reducer, comments);

  useEffect(() => {
    // console.log(loadComments);
    if (entry.isIntersecting) {
      setLoadComments(true);
    }
  }, [entry]);
  useEffect(() => {
    // console.log(comments);
    if (loadComments && comments) {
      comments.forEach((reply) => {
        reply.open = false;
        // console.log("loadComments");
      });
      dispatch({ type: "load", payload: comments });
      // console.log(comments);
    }
  }, [comments]);

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

  return (
    <>
      {post ? (
        <>
          <Container sx={{ minHeight: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginBlock: "15px" }}
                href={`/posts/${post._id}`}
              >
                view full page
              </Button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    marginRight: "auto",
                    visibility: "hidden",
                    minWidth: "30px",
                  }}
                ></div>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ marginBottom: "5px" }}
                >
                  {post.title}
                </Typography>
                <div>
                  <IconButton
                    sx={{ marginLeft: 2 }}
                    color="inherit"
                    aria-label="flag"
                    size="small"
                    onClick={() => handleOpenFlag("post", post)}
                  >
                    <FlagIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex" }}>
                <Typography align="center" variant="h6">
                  <Link
                    href={`/person/${post.name}`}
                    color="secondary"
                    underline="hover"
                  >
                    {post.name}
                  </Link>
                </Typography>
                <Button
                  href={`/tip?q=${post.name}`}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    marginLeft: "10px",
                    "& .MuiButton-startIcon": {
                      marginRight: "0px",
                    },
                  }}
                  size="small"
                  startIcon={<AttachMoneyIcon />}
                >
                  tip
                </Button>
              </div>
            </Box>
            <Typography
              sx={{
                fontStyle: "italic",
              }}
              align="left"
              variant="h6"
            >
              <>
                {" "}
                {post.updated && "Updated:"}{" "}
                {new Date(post.date).toLocaleDateString()}
              </>
            </Typography>
            <Typography variant="h6">
              Category: {post.category.title} {" >> "}
              {post.category.sub}
            </Typography>
            <Typography variant="h6">
              Ecoregions:{" "}
              {post.ecoregions.map((ecoregion) => (
                <Link
                  href={`/ecoregions/${ecoregion}`}
                  color="secondary"
                  underline="hover"
                  key={ecoregion}
                >
                  Eco-{ecoregion},{" "}
                </Link>
              ))}
            </Typography>
            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {votes ? (
                <Vote
                  post_count={votes && votes.count}
                  handleOpenDialog={handleOpenDialog}
                  name={user && user.name}
                  voters={votes && votes.voters}
                />
              ) : (
                <CircularProgress size={19} color="secondary" />
              )}
            </div>
          </Container>
          <div style={{ marginInline: "10px" }}>
            <Editor cellPlugins={cellPlugins} value={post} readOnly />
          </div>
          <Container>
            <Divider />

            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              Comments:
            </Typography>

            <div ref={ref}>
              {!comments && !error && <Typography>loading...</Typography>}
              {comments && (
                <CommentList
                  comments={comments}
                  post_id={post._id}
                  handleOpenDialog={handleOpenDialog}
                  handleOpenFlag={handleOpenFlag}
                  showForm={showForm}
                  handleForm={toggleForm}
                  handleReply={handleReply}
                  drawer={true}
                />
              )}
            </div>
          </Container>

          <ClientDialog
            contentType={action}
            open={dialog}
            handleClose={handleCloseDialog}
            post_id={post._id}
            result={item}
            closeForm={closeForm}
            name={user && user.name}
            mutate={mutate}
          />
          <Flag
            open={flag}
            handleClose={handleCloseFlag}
            contentType={action}
            result={item}
            name={user && user.name}
          />
        </>
      ) : (
        <CircularProgress
          color="secondary"
          size={50}
          disableShrink={true}
          sx={{
            margin: "100px auto",
            display: "flex",
            justifySelf: "center",
          }}
        />
      )}
    </>
  );
};

export default DrawerPost;
