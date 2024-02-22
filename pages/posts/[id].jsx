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
  Container,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import customImage from "@plugins/customImage";
import customVideo from "@plugins/customVideo";
// The editor core
import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-video/lib/index.css";

import { updatePost } from "@utils/apiHelpers";
import {
  handleClosePostDialog,
  handleClosePostFlag,
  handleOpenPostDialog,
  handleOpenPostFlag,
} from "@utils/dialogHelpers";
import {
  getPosts,
  getPublishedApprovedPostById,
} from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
import { useOnScreenServer } from "@utils/useOnScreen";
import { validID } from "@utils/validationHelpers";
import { signIn } from "next-auth/react";
import { ArticleJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";

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

const Post = ({ post }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();
  const { mutate } = useSWRConfig();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ref = useRef();
  const isVisible = useOnScreenServer(ref);

  // set post as value of editor
  const [value, setValue] = useState(post);

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
    if (isVisible) {
      setLoadComments(true);
    }
  }, [isVisible]);

  // const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  // const [modelError, setModelError] = useState(false);

  // useEffect(() => {
  //   // if (loadComments && comments && user.status === "authenticated") {
  //   //   const loadModel = async () => {
  //   //     setModelLoading(true);
  //   //     try {
  //   //       // Loading model
  //   //       const model = await loadToxicity(0.7);
  //   //       if (model) {
  //   //         setModel(model);
  //   //         setModelLoading(false);
  //   //       }
  //   //     } catch (error) {
  //   //       console.log(error);
  //   //       setModelError(true);
  //   //       setModelLoading(false);
  //   //     }
  //   //   };
  //   //   loadModel();
  //   // }
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

  const date = new Date(post.date);

  return (
    <>
      <NextSeo
        title={post.title}
        titleTemplate="%s"
        defaultTitle="Ecotenet"
        description={post.description}
        openGraph={{
          title: post.title,
          description: post.description,
          url: `https://www.ecotenet.org/posts/${post._id}`,
          siteName: "Ecotenet",
          type: "article",
          article: {
            // publishedTime: post.date,
            authors: [post.name],
            tags: post.tags,
          },
          // images: [
          //   {
          //     url: "https://www.ecotenet.org/logo_social.png",
          //     width: 1200,
          //     height: 630,
          //     alt: "Ecotenet logo",
          //   },
          // ],
        }}
      />
      <ArticleJsonLd
        // type="BlogPosting"
        url={`https://www.ecotenet.org/posts/${post._id}`}
        title={post.title}
        // images={[
        //   'https://example.com/photos/1x1/photo.jpg',
        //   'https://example.com/photos/4x3/photo.jpg',
        //   'https://example.com/photos/16x9/photo.jpg',
        // ]}
        // datePublished={post.date}
        description={post.description}
        useAppDir={false}
        authorName={[
          {
            name: post.name,
            url: `https://www.ecotenet.org/person/${post.name}`,
          },
        ]}
        publisherName="Ecotenet"
        publisherLogo="https://www.ecotenet.org/logo_social.png"
        isAccessibleForFree={true}
      />

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
            style={{ display: "flex", marginLeft: "auto", marginTop: "40px" }}
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
              onClick={() => handleOpenPostFlagWrapper("post", post)}
            >
              <FlagIcon />
            </IconButton>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
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
            <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
              Category: {post.category.title}
              {" >> "}
              {post.category.sub}
            </Typography>
          </div>

          {!isMobile && (
            <>
              <Vote
                handleOpenDialog={handleOpenPostDialogWrapper}
                name={user && user.name}
                vote={vote}
                setVote={setVote}
                limit={limit}
                setLimit={setLimit}
                id={post._id}
                isMobile={isMobile}
              />
            </>
          )}
        </div>
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
          </>
        )}
        <EditorLayout readOnly={true}>
          {(post.category.sub === "Edible" ||
            post.category.sub === "Medicinal" ||
            post.category.sub === "Cooking/Recipes") && (
            <Typography sx={{ paddingTop: "16px" }}>
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
        <div ref={ref} data-testid="comments-container">
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

      <Footer />
    </>
  );
};

// fetch post data at build time
export const getStaticProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const _id = context.params.id;

  if (validID(_id)) {
    const post = await getPublishedApprovedPostById(_id);

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

export default Post;
