import CommentList from "@components/comments/CommentList";
import { useUserContext } from "@components/context/UserContext";
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
import fetcher from "@utils/fetcher";
import { useOnScreenClient } from "@utils/useOnScreen";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

// Define which plugins we want to use.
const cellPlugins = [slate(), customImage, video, spacer, divider];

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});
const DynamicClientDialog = dynamic(
  () => import("@components/dialogs/ClientDialog"),
  {
    ssr: false,
  }
);
const DrawerPost = ({ id }) => {
  const { mutate } = useSWRConfig();
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useSWR(id ? `/api/posts/${id}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  const router = useRouter();
  const { user } = useUserContext();

  const [ref, entry] = useOnScreenClient({
    threshold: 1,
  });

  const [dialog, setDialog] = useState(false);
  const [flag, setFlag] = useState(false);
  const [action, setAction] = useState("");
  const [item, setItem] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loadComments, setLoadComments] = useState(false);

  const {
    data: comments,
    isLoading: commentLoading,
    error: commentError,
  } = useSWR(loadComments ? `/api/comments/${post._id}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  const {
    data: votes,
    isLoading: voteLoading,
    error: voteError,
  } = useSWR(`/api/votes/${id}`, fetcher, {
    shouldRetryOnError: false,
  });

  const reducer = (comments, toggle) => {
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
    if (entry.isIntersecting) {
      setLoadComments(true);
    }
  }, [entry]);
  useEffect(() => {
    if (loadComments && comments) {
      comments.forEach((reply) => {
        reply.open = false;
      });
      dispatch({ type: "load", payload: comments });
    }
  }, [comments]);

  const handleOpenDialog = (action, result) => {
    if (user.status === "unauthenticated" || user.status === "loading") {
      signIn();
    }
    if (user.status === "authenticated") {
      if (user.name === null || user.name === "" || user.name === undefined) {
        router.push("/auth/new-user");
      } else {
        setItem(result);
        setAction(action);

        setDialog(true);

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
    if (user.status === "unauthenticated" || user.status === "loading") {
      signIn();
    }
    if (user.status === "authenticated") {
      if (user.name === null || user.name === "" || user.name === undefined) {
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
    if (user.status === "unauthenticated" || user.status === "loading") {
      signIn();
    }
    if (user.status === "authenticated") {
      if (user.name === null || user.name === "" || user.name === undefined) {
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
    if (user.status === "unauthenticated" || user.status === "loading") {
      signIn();
    }
    if (user.status === "authenticated") {
      if (user.name === null || user.name === "" || user.name === undefined) {
        router.push("/auth/new-user");
      } else {
        dispatch({ type: toggle, payload: ID });
      }
    }
  };

  return (
    <>
      {postLoading ? (
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
      ) : (
        <>
          {postError ? (
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
                onClick={() => mutate(`/api/posts/${id}`)}
              >
                Error Loading. Retry
              </Button>
            </div>
          ) : (
            <>
              {post && (
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
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                      {voteLoading ? (
                        <CircularProgress size={19} color="secondary" />
                      ) : (
                        <>
                          {voteError ? (
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
                                onClick={() => mutate(`/api/votes/${id}`)}
                              >
                                Error Loading. Retry
                              </Button>
                            </div>
                          ) : (
                            <>
                              {votes && (
                                <Vote
                                  post_count={votes && votes.count}
                                  handleOpenDialog={handleOpenDialog}
                                  name={user && user.name}
                                  voters={votes && votes.voters}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Container>
                  <div style={{ marginInline: "10px" }}>
                    {(post.category.sub === "Edible" ||
                      post.category.sub === "Medicinal") && (
                      <Typography sx={{ marginTop: "5px" }}>
                        <em>
                          Disclaimer: This content is for educational purposes
                          only. Before consuming anything make sure you have
                          properly identified it and speak to a professional
                          about any possible effects.
                        </em>
                      </Typography>
                    )}
                    <Editor cellPlugins={cellPlugins} value={post} readOnly />
                  </div>
                  <Container>
                    <Divider />

                    <Typography variant="h6" sx={{ marginTop: "20px" }}>
                      Comments:
                    </Typography>

                    <div ref={ref}>
                      {commentLoading ? (
                        <Typography>loading...</Typography>
                      ) : (
                        <>
                          {commentError ? (
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
                                  mutate(`/api/comments/${post._id}`)
                                }
                              >
                                Error Loading. Retry
                              </Button>
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Container>

                  {dialog && (
                    <DynamicClientDialog
                      contentType={action}
                      open={dialog}
                      handleClose={handleCloseDialog}
                      post_id={post._id}
                      result={item}
                      closeForm={closeForm}
                      name={user && user.name}
                      mutate={mutate}
                    />
                  )}

                  {flag && (
                    <DynamicFlag
                      open={flag}
                      handleClose={handleCloseFlag}
                      contentType={action}
                      result={item}
                      name={user && user.name}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default DrawerPost;
