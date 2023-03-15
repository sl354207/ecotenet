import CommentList from "@components/comments/CommentList";
import { useSnackbarContext } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import EditorLayout from "@components/layouts/EditorLayout";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
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
  useMediaQuery,
} from "@mui/material";
import customImage from "@plugins/customImage";
// The editor core
import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";
import { updatePost } from "@utils/apiHelpers";
import fetcher from "@utils/fetcher";
import { getPostById, getPosts } from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
import { useOnScreenServer } from "@utils/useOnScreen";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";
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

const post = ({ post }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ref = useRef();
  const isVisible = useOnScreenServer(ref);

  // set post as value of editor
  const [value, setValue] = useState(post);

  const [dialog, setDialog] = useState(false);
  const [flag, setFlag] = useState(false);
  const [action, setAction] = useState("");
  const [item, setItem] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loadComments, setLoadComments] = useState(false);

  const { mutate } = useSWRConfig();

  const {
    data: comments,
    isLoading: commentLoading,
    error: commentError,
  } = useSWR(loadComments ? `/api/comments/${post._id}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  //set limit for vote count
  const [limit, setLimit] = useState(0);
  // set vote status
  const [vote, setVote] = useState(0);

  const {
    data: votes,
    isLoading: voteLoading,
    error: voteError,
  } = useSWR(`/api/votes/${post._id}`, fetcher, {
    shouldRetryOnError: false,
  });

  const reducer = (comments, toggle) => {
    if (toggle.type === "load") {
      return toggle.payload;
    }
    if (toggle.type === "open") {
      return comments.map((comment) => {
        if (comment._id === toggle.payload) {
          comment.open = true;
        }

        return comment;
      });
    }
    if (toggle.type === "close") {
      return comments.map((comment) => {
        if (comment._id === toggle.payload) {
          comment.open = false;
        }

        return comment;
      });
    }
    if (toggle.type === "all") {
      return comments.map((comment) => {
        comment.open = false;

        return comment;
      });
    }
  };

  const [state, dispatch] = useReducer(reducer, comments);

  useEffect(() => {
    if (isVisible) {
      setLoadComments(true);
    }
  }, [isVisible]);
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

        if (action === "Comment") {
          dispatch({ type: "open", payload: result.comment_ref });
        }
      }
    }
  };

  const handleCloseDialog = (reply) => {
    setDialog(false);

    if (reply === "reply") {
      dispatch({ type: "all" });
    }
    if (reply && reply !== "reply" && reply !== "") {
      dispatch({ type: "open", payload: reply });
    }
  };

  const handleAddFeature = async () => {
    const submission = {
      _id: post._id,
      feature: "pending",
    };

    const res = await updatePost(submission, "admin");

    if (res.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: "Added to feature list",
      });
    }
    if (!res.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message:
          "There was a problem submitting feature. Please try again later",
      });
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

  const date = new Date(post.date);

  return (
    <>
      <Container sx={{ backgroundColor: theme.palette.primary.main }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              marginRight: "auto",
              visibility: "hidden",
              minWidth: "30px",
            }}
          ></div>
          <Header title={post.title} />
          <div
            style={{ display: "flex", marginLeft: "auto", marginTop: "auto" }}
          >
            {user && user.role === "admin" && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleAddFeature()}
              >
                Feature List
              </Button>
            )}

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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flexDirection: "column",
              maxWidth: "800px",
              flexGrow: 1,
              marginLeft: "20px",
            }}
          >
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
              {isMobile ? (
                <>
                  {" "}
                  {post.updated && "Updated:"} {date.toLocaleDateString()}
                </>
              ) : (
                <>
                  {post.updated && "Updated:"} {date.toDateString()}
                </>
              )}
            </Typography>
            <Typography variant="h6">
              Category: {post.category.title}
              {" >> "}
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
          </div>
          {!isMobile && (
            <>
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
                        onClick={() => mutate(`/api/votes/${post._id}`)}
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
                          vote={vote}
                          setVote={setVote}
                          limit={limit}
                          setLimit={setLimit}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
        {isMobile && (
          <>
            <Divider sx={{ marginTop: "10px" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBlock: "10px",
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
                        onClick={() => mutate(`/api/votes/${post._id}`)}
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
                          vote={vote}
                          setVote={setVote}
                          limit={limit}
                          setLimit={setLimit}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
        <EditorLayout>
          {(post.category.sub === "Edible" ||
            post.category.sub === "Medicinal") && (
            <Typography sx={{ marginTop: "5px" }}>
              <em>
                Disclaimer: This content is for educational purposes only.
                Before consuming anything make sure you have properly identified
                it and speak to a professional about any possible effects.
              </em>
            </Typography>
          )}
          <Editor
            cellPlugins={cellPlugins}
            value={value}
            onChange={setValue}
            readOnly
          />
        </EditorLayout>
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
                    onClick={() => mutate(`/api/comments/${post._id}`)}
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
          setVote={setVote}
          setLimit={setLimit}
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

      <Footer />
    </>
  );
};

// UPDATE!!! POSSIBLY ONLY STATIC FOR USER TESTING UNTIL UPGRADE ACCOUNT

// fetch post data at build time
// export const getServerSideProps = async (context) => {
//   // context allows us to fetch specific data points from data such as id
//   const _id = context.params.id;

//   const post = await getPostById(_id);

//   // const comments = await getPostComments(post._id.toString());

//   return {
//     props: {
//       post: JSON.parse(JSON.stringify(post)),
//       // comments: JSON.parse(JSON.stringify(comments)),
//     },
//   };
// };

// fetch post data at build time
export const getStaticProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const _id = context.params.id;

  const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;

  if (typeof _id === "string" && _id.length === 24 && !regex.test(_id)) {
    const post = await getPostById(_id);

    if (post === null) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          post: JSON.parse(JSON.stringify(post)),
        },
        revalidate: 60,
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
};

// build routing paths for each post at build time
export const getStaticPaths = async () => {
  const posts = await getPosts("published", "true");

  // create array of ids of each post in posts
  const ids = posts.map((post) => post._id);

  // create paths array with objects that follow structure given
  const paths = ids.map((id) => ({ params: { id: id.toString() } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default post;
