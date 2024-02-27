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
import customVideo from "@plugins/customVideo";

// The editor core
import Editor from "@react-page/editor";
// import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-video/lib/index.css";
import {
  handleClosePostDialog,
  handleClosePostFlag,
  handleOpenPostDialog,
  handleOpenPostFlag,
} from "@utils/dialogHelpers";
import fetcher from "@utils/fetcher";
import { useOnScreenClient } from "@utils/useOnScreen";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const slatePlugin = slate((slateDef) => ({
  ...slateDef,
  plugins: {
    ...slateDef.plugins,
    link: {
      // we can customize the h1 by providing a transform function
      link: slateDef.plugins.link.link((linkDef) => ({
        ...linkDef, // spread it, so that the new config contains all defaults
        Component: ({ style, children, ...props }) => (
          <a
            {...props}
            target={props.openInNewWindow ? "_blank" : undefined}
            style={{ ...style, color: "#c8fcff" }}
          >
            {children}
          </a>
        ),
      })),
    },
  },
}));

// Define which plugins we want to use.
const cellPlugins = [slatePlugin, customImage, customVideo, spacer, divider];

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});
const DynamicClientDialog = dynamic(
  () => import("@components/dialogs/ClientDialog"),
  {
    ssr: false,
  }
);
const DrawerPost = ({ id, handleClose }) => {
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

  //set limits for vote counter
  const [limit, setLimit] = useState(0);

  // set vote status
  const [vote, setVote] = useState(0);

  const [loadComments, setLoadComments] = useState(false);

  const [commentForm, setCommentForm] = useState({
    type: "",
    payload: "",
  });

  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    if (entry.isIntersecting) {
      setLoadComments(true);
    }
  }, [entry]);

  // const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  // const [modelError, setModelError] = useState(false);

  // useEffect(() => {
  // if (loadComments && comments && user.status === "authenticated") {
  // const loadModel = async () => {
  //   setModelLoading(true);
  //   try {
  //     // Loading model
  //     const model = await loadToxicity(0.7);
  //     if (model) {
  //       setModel(model);
  //       setModelLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setModelError(true);
  //     setModelLoading(false);
  //   }
  // };
  // loadModel();
  // }
  // }, [comments]);

  const handleOpenPostDialogWrapper = (action, result) => {
    handleOpenPostDialog(
      action,
      result,
      user,
      signIn,
      router,
      setItem,
      setAction,
      setDialog,
      setCommentForm
    );
  };

  const handleClosePostDialogWrapper = (reply) => {
    handleClosePostDialog(reply, setDialog, setCommentForm);
  };

  const handleOpenPostFlagWrapper = (action, result) => {
    handleOpenPostFlag(
      action,
      result,
      user,
      signIn,
      router,
      setItem,
      setAction,
      setFlag
    );
  };

  const handleClosePostFlagWrapper = () => {
    handleClosePostFlag(setFlag);
  };

  const closeCommentForm = () => {
    setShowCommentForm(false);
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
                            // marginRight: "auto",
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
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "auto",
                            marginBottom: "auto",
                          }}
                        >
                          <IconButton
                            sx={{ marginLeft: 2 }}
                            color="inherit"
                            aria-label="flag"
                            size="small"
                            onClick={() =>
                              handleOpenPostFlagWrapper("post", post)
                            }
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
                            onClick={(event) => {
                              handleClose(event);
                            }}
                          >
                            {post.name}
                          </Link>
                        </Typography>
                        {post.name !== "Ecotenet" && (
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
                        )}
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
                          onClick={(event) => {
                            handleClose(event);
                          }}
                        >
                          Eco-{ecoregion},{" "}
                        </Link>
                      ))}
                    </Typography>
                    {post.originalUrl && (
                      <Typography
                        variant="body1"
                        sx={{ marginBlock: "5px", overflowWrap: "anywhere" }}
                      >
                        Originally posted on:{" "}
                        <Link
                          href={post.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="secondary"
                          underline="hover"
                        >
                          {post.originalUrl}
                        </Link>
                      </Typography>
                    )}
                    <Divider />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Vote
                        handleOpenDialog={handleOpenPostDialogWrapper}
                        name={user && user.name}
                        vote={vote}
                        setVote={setVote}
                        limit={limit}
                        setLimit={setLimit}
                        id={post._id}
                      />
                    </div>
                  </Container>
                  <div style={{ marginInline: "10px" }}>
                    {(post.category.sub === "Edible" ||
                      post.category.sub === "Medicinal" ||
                      post.category.sub === "Cooking/Recipes") && (
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
                      {loadComments && (
                        <CommentList
                          commentForm={commentForm}
                          loadComments={loadComments}
                          post_id={post._id}
                          handleOpenDialog={handleOpenPostDialogWrapper}
                          handleOpenFlag={handleOpenPostFlagWrapper}
                          showForm={showCommentForm}
                          setShowForm={setShowCommentForm}
                          modelLoading={modelLoading}
                          user={user}
                          drawer={true}
                        />
                      )}
                    </div>
                  </Container>

                  {dialog && (
                    <DynamicClientDialog
                      contentType={action}
                      open={dialog}
                      handleClose={handleClosePostDialogWrapper}
                      post_id={post._id}
                      result={item}
                      closeCommentForm={closeCommentForm}
                      name={user && user.name}
                      mutate={mutate}
                      setVote={setVote}
                      setLimit={setLimit}
                      // model={model}
                      modelLoading={modelLoading}
                      setModelLoading={setModelLoading}
                      // modelError={modelError}
                      // setModelError={setModelError}
                    />
                  )}

                  {flag && (
                    <DynamicFlag
                      open={flag}
                      handleClose={handleClosePostFlagWrapper}
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
