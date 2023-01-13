import CommentList from "@components/comments/CommentList";
import { useSnackbarContext } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import ClientDialog from "@components/dialogs/ClientDialog";
import Flag from "@components/dialogs/Flag";
import EditorLayout from "@components/layouts/EditorLayout";
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
import useOnScreen from "@utils/useOnScreen";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";
import useSWR from "swr";

// Define which plugins we want to use.
const cellPlugins = [slate(), customImage, video, spacer, divider];

const fetcher = (url) => fetch(url).then((r) => r.json());
const DrawerPost = ({ id, FSOpen }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: post } = useSWR(id ? `/api/posts/${id}` : null, fetcher);
  // let date = new Date(post.date);

  let styles = {
    border: "none",
    width: "100%",
    height: FSOpen ? "56vh" : "51vh",
  };
  const router = useRouter();
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ref = useRef();
  const isVisible = useOnScreen(ref);
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
    if (isVisible) {
      setLoadComments(true);
    }
  }, [isVisible]);
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

  // const date = new Date(post.date);
  return (
    <>
      {post ? (
        // <>
        //   <>
        //     <Container sx={{ minHeight: "auto" }}>
        // <div style={{ display: "flex", flexDirection: "column" }}>
        //   <Button
        //     variant="contained"
        //     color="secondary"
        //     sx={{ marginBlock: "15px" }}
        //     href={`/posts/${post._id}`}
        //   >
        //     visit full post
        //   </Button>
        //   <Typography
        //     variant="h4"
        //     align="center"
        //     sx={{ marginBottom: "5px" }}
        //   >
        //     {post.title}
        //   </Typography>
        // </div>

        //       <div
        //         style={{
        //           display: "flex",
        //           justifyContent: "center",
        //           alignItems: "center",
        //         }}
        //       >
        //         <div
        //           style={{
        //             flexDirection: "column",
        //             maxWidth: "800px",
        //             flexGrow: 1,
        //             marginLeft: "20px",
        //           }}
        //         >
        //           <div
        //             style={{
        //               display: "flex",
        //               flexDirection: "column",
        //               alignItems: "start",
        //             }}
        //           >
        //             <div style={{ display: "flex" }}>
        //               <Typography align="center" variant="h6">
        //                 <Link
        //                   href={`/person/${post.name}`}
        //                   color="secondary"
        //                   underline="hover"
        //                 >
        //                   {post.name}
        //                 </Link>
        //               </Typography>
        //               <Button
        //                 href={`/tip?q=${post.name}`}
        //                 color="secondary"
        //                 variant="outlined"
        //                 sx={{
        //                   marginLeft: "10px",
        //                   "& .MuiButton-startIcon": {
        //                     marginRight: "0px",
        //                   },
        //                 }}
        //                 size="small"
        //                 startIcon={<AttachMoneyIcon />}
        //               >
        //                 tip
        //               </Button>
        //             </div>

        //             <Typography
        //               sx={{
        //                 fontStyle: "italic",
        //                 fontWeight: 400,
        //                 fontSize: "1.2rem",
        //               }}
        //               align="left"
        //               variant="h6"
        //             >
        //               {post.updated && "Updated:"}{" "}
        //               {new Date(post.date).toLocaleDateString()}
        //             </Typography>
        //           </div>
        //           <Typography variant="h6">Votes: {post.count}</Typography>
        //           <Typography variant="h6">
        //             Ecoregions:{" "}
        //             {post.ecoregions.map((ecoregion) => (
        //               <Link
        //                 href={`/ecoregions/${ecoregion}`}
        //                 color="secondary"
        //                 underline="hover"
        //                 key={ecoregion}
        //               >
        //                 Eco-{ecoregion},{" "}
        //               </Link>
        //             ))}
        //           </Typography>
        //         </div>
        //       </div>
        //     </Container>

        //     {/* {isMobile ? ( */}
        //     <EditorLayout>
        //       <Editor
        //         cellPlugins={cellPlugins}
        //         value={post}
        //         // onChange={setValue}
        //         readOnly
        //       />
        //     </EditorLayout>
        //     {/* ) : ( */}
        //     {/* <Frame
        //         style={styles}
        //         head={
        //           <style>
        //             {
        //               "a {color: #c8fcff; text-decoration: none;overflow-wrap: anywhere;} a:hover {color: #c8fcff; text-decoration: underline; overflow-wrap: anywhere;} p {color:#ffffff; font-weight: 400; font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em; } h2 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} h1 {color:#ffffff;line-height: 1.5; letter-spacing: 0.00938em;} h3 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} h4 {color:#ffffff; font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em;} h5 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} h6 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} ul {color:#ffffff;  font-weight: 400;font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em;} ol {color:#ffffff;font-weight: 400; font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em;}"
        //             }
        //           </style>
        //         }
        //       > */}
        // {/* <EditorLayout>
        //       <Editor
        //         cellPlugins={cellPlugins}
        //         value={post}
        //         // onChange={setValue}
        //         readOnly
        //       />
        //     </EditorLayout> */}
        //     {/* </Frame> */}
        //     {/* )} */}
        //   </>
        // </>
        <>
          <Container sx={{ minHeight: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginBlock: "15px" }}
                href={`/posts/${post._id}`}
              >
                visit full post
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
                <div
                // style={{
                //   display: "flex",
                //   marginLeft: "auto",
                //   marginTop: "auto",
                // }}
                >
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
                // marginLeft: { xs: "0px", md: "20px" },
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
            <Typography variant="h6">Category: {post.category}</Typography>
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
                // alignItems: "center",
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
          <EditorLayout mobile={true}>
            <Editor
              cellPlugins={cellPlugins}
              value={post}
              onChange={setValue}
              readOnly
            />
          </EditorLayout>
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
