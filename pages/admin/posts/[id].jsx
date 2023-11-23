import AdminCommentList from "@components/comments/AdminCommentList";
import AdminDialog from "@components/dialogs/AdminDialog";
import Resolve from "@components/dialogs/Resolve";
import EditorLayout from "@components/layouts/EditorLayout";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import customImage from "@plugins/customImage";
import customVideo from "@plugins/customVideo";
import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-video/lib/index.css";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
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

const post = () => {
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ID = router.query.id;
  const comment_query = router.query.q;
  const flag = router.query.flag;

  const flagee = router.query.flagee;

  const [dialog, setDialog] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const { mutate } = useSWRConfig();

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

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useSWR(ID ? `/api/admin/posts/${ID}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  const {
    data: comments,
    isLoading: commentLoading,
    error: commentError,
  } = useSWR(
    comment_query ? `/api/admin/posts/${ID}/comments` : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  let list;

  if (postLoading) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    if (postError) {
      list = (
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
            onClick={() => mutate(`/api/admin/posts/${ID}`)}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      list = (
        <>
          {post && (
            <>
              {comment_query ? (
                <Link
                  href="/admin/flags"
                  underline="hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Flags
                </Link>
              ) : (
                <Link
                  href="/admin/posts"
                  underline="hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Posts
                </Link>
              )}

              <Container sx={{ backgroundColor: theme.palette.primary.main }}>
                <Header title={post.title} />
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
                    <div style={{ display: "flex" }}>
                      <Typography align="center" variant="h6">
                        <Link
                          href={`/admin/people/${post.name}`}
                          underline="hover"
                        >
                          {post.name}
                        </Link>
                      </Typography>
                      <Typography
                        sx={{ marginLeft: "20px", fontStyle: "italic" }}
                        align="left"
                        variant="h6"
                      >
                        {isMobile
                          ? new Date(post.date).toLocaleDateString()
                          : new Date(post.date).toDateString()}
                      </Typography>
                    </div>
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
                    {post.originalUrl && (
                      <Typography
                        variant="body1"
                        sx={{ marginBlock: "10px", overflowWrap: "anywhere" }}
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
                  </div>
                  {!comment_query && (
                    <div
                      style={
                        isMobile ? { display: "grid" } : { display: "flex" }
                      }
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          handleOpenDialog("Approve", "Post", post)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={
                          isMobile
                            ? { marginTop: "4px" }
                            : { marginLeft: "4px" }
                        }
                        onClick={() => handleOpenDialog("Deny", "Post", post)}
                      >
                        Deny
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={
                          isMobile
                            ? {
                                marginTop: "4px",
                                color: "#fc7ebf",
                                borderColor: "#fc7ebf",
                              }
                            : {
                                marginLeft: "4px",
                                color: "#fc7ebf",
                                borderColor: "#fc7ebf",
                              }
                        }
                        onClick={() => handleOpenDialog("Delete", "Post", post)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                  {comment_query === "flag" && (
                    <div
                      style={
                        isMobile ? { display: "grid" } : { display: "flex" }
                      }
                    >
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
                        sx={
                          isMobile
                            ? { marginTop: "4px" }
                            : { marginLeft: "4px" }
                        }
                        onClick={() => handleOpenDialog("Deny", "Post", post)}
                      >
                        Deny
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={
                          isMobile
                            ? {
                                marginTop: "4px",
                                color: "#fc7ebf",
                                borderColor: "#fc7ebf",
                              }
                            : {
                                marginLeft: "4px",
                                color: "#fc7ebf",
                                borderColor: "#fc7ebf",
                              }
                        }
                        onClick={() => handleOpenDialog("Delete", "Post", post)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <EditorLayout readOnly={true}>
                  <Editor cellPlugins={cellPlugins} value={post} readOnly />
                </EditorLayout>
              </Container>
            </>
          )}
        </>
      );
    }
  }

  let commentList;
  if (!comment_query) {
    commentList = <></>;
  } else if (commentLoading) {
    commentList = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    if (commentError) {
      commentList = (
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
            onClick={() => mutate(`/api/admin/posts/${ID}/comments`)}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(comments) && comments.length === 0) {
        commentList = (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        );
      } else {
        commentList = (
          <>
            {comments && (
              <AdminCommentList
                comments={comments}
                comment_query={comment_query}
                handleOpenDialog={handleOpenDialog}
                handleOpenResolve={handleOpenResolve}
              />
            )}
          </>
        );
      }
    }
  }

  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      {list}
      {commentList}
      <AdminDialog
        contentType={action.type}
        action={action.action}
        open={dialog}
        handleClose={handleCloseDialog}
        result={item}
        mutate={mutate}
      />
      <Resolve
        open={resolve}
        handleClose={handleCloseResolve}
        name={flagee}
        ID={flag}
        mutate={mutate}
        route="post"
      />
    </>
  );
};

export default post;
