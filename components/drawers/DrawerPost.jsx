import EditorLayout from "@components/EditorLayout";
import Header from "@components/Header";
import Link from "@components/Link";
import {
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import customImage from "@plugins/customImage";
// import Frame from "react-frame-component";
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
import theme from "@utils/theme";
import useSWR from "swr";

// Define which plugins we want to use.
const cellPlugins = [slate(), customImage, video, spacer, divider];

const fetcher = (url) => fetch(url).then((r) => r.json());
const DrawerPost = ({ id }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: post } = useSWR(id ? `/api/posts/${id}` : null, fetcher);
  // let date = new Date(post.date);

  let styles = {
    border: "none",
    width: "100%",
    height: "100%",
  };
  return (
    <>
      {post ? (
        <>
          <Container sx={{ backgroundColor: theme.palette.primary.main }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {/* <div
                style={{
                  display: "flex",
                  marginRight: "auto",
                  visibility: "hidden",
                  minWidth: "30px",
                }}
              ></div> */}
              <Header title={post.title} />
              {/* <div
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
      </div> */}
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
                  Ecoregions:{" "}
                  {post.ecoregions.map((ecoregion) => (
                    <Link
                      href={`/ecoregions/${ecoregion}`}
                      color="secondary"
                      underline="hover"
                    >
                      Eco-{ecoregion},{" "}
                    </Link>
                  ))}
                </Typography>
              </div>

              {/* {votes ? (
        <Vote
          post_count={votes && votes.count}
          count={count}
          setCount={setCount}
          handleOpenDialog={handleOpenDialog}
          name={user && user.name}
          voters={votes && votes.voters}
        />
      ) : (
        <CircularProgress size={19} color="secondary" />
      )} */}
            </div>
            <EditorLayout>
              <Editor
                cellPlugins={cellPlugins}
                value={post}
                // onChange={setValue}
                readOnly
              />
            </EditorLayout>
            {/* <Divider />
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
        />
      )}
    </div> */}
          </Container>
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
