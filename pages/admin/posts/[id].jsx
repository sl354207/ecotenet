import AdminCommentList from "@components/comments/AdminCommentList";
import AdminDialog from "@components/dialogs/AdminDialog";
import Resolve from "@components/dialogs/Resolve";
import EditorLayout from "@components/EditorLayout";
import Header from "@components/Header";
import Link from "@components/Link";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import customImage from "@plugins/customImage";
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
import theme from "@utils/theme";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

// Define which plugins we want to use.
const cellPlugins = [slate(), image, video, spacer, divider, customImage];

const fetcher = (url) => fetch(url).then((r) => r.json());
// pass in post and comments as props and create page for each post with corresponding comments
const post = () => {
  const router = useRouter();

  const ID = router.query.id;
  const comment_query = router.query.q;
  const flag = router.query.flag;

  const flagee = router.query.flagee;

  const [dialog, setDialog] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

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

  const { data: post } = useSWR(ID ? `/api/admin/posts/${ID}` : null, fetcher);

  const { data: comments, mutate } = useSWR(
    comment_query ? `/api/admin/posts/${ID}/comments` : null,
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
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    date = new Date(post.date);
    list = (
      <>
        {comment_query ? (
          <Link href="/admin/flags" underline="hover">
            &#10229;Flags
          </Link>
        ) : (
          <Link href="/admin/posts" underline="hover">
            &#10229;Posts
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
                  <Link href="#" underline="hover">
                    {post.name}
                  </Link>
                </Typography>
                <Typography
                  sx={{ marginLeft: "20px", fontStyle: "italic" }}
                  align="left"
                  variant="h6"
                >
                  {date.toDateString()}
                </Typography>
              </div>
              <Typography variant="h6">
                Ecoregions:{" "}
                {post.ecoregions.map((ecoregion) => (
                  <Link href="#" color="secondary" underline="hover">
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
                  onClick={() => handleOpenDialog("Approve", "Post", post)}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginLeft: "4px" }}
                  onClick={() => handleOpenDialog("Deny", "Post", post)}
                >
                  Deny
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginLeft: "4px",
                    color: "#fc7ebf",
                    borderColor: "#fc7ebf",
                  }}
                  onClick={() => handleOpenDialog("Delete", "Post", post)}
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
                  sx={{ marginLeft: "4px" }}
                  onClick={() => handleOpenDialog("Deny", "Post", post)}
                >
                  Deny
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginLeft: "4px",
                    color: "#fc7ebf",
                    borderColor: "#fc7ebf",
                  }}
                  onClick={() => handleOpenDialog("Delete", "Post", post)}
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
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else if (Array.isArray(comments) && comments.length == 0) {
    commentList = (
      <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
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
        result={item}
        mutate={mutate}
      />
      <Resolve
        open={resolve}
        handleClose={handleCloseResolve}
        name={flagee}
        ID={flag}
        mutate={mutate}
      />
    </>
  );
};

export default post;
