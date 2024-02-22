import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, List, Typography } from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

import { signIn } from "next-auth/react";
import { useEffect, useReducer, useState } from "react";
import useSWR from "swr";

//pass in comments and post id from parent post
const CommentList = ({
  commentForm,
  post_id,
  showForm,
  setShowForm,
  handleOpenDialog,
  handleOpenFlag,
  drawer,
  modelLoading,
  loadComments,
  user,
}) => {
  const {
    data: comments,
    isLoading: commentLoading,
    error: commentError,
    mutate,
  } = useSWR(loadComments ? `/api/comments/${post_id}` : null, fetcher, {
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

  const [sortedComments, setSortedComments] = useState();

  useEffect(() => {
    if (comments && !commentError) {
      //if comment doesn't have a ref(initial comment) than make ref same as comment id. Convert comment date from string to date object
      const dateComments = comments.map((comment) => {
        if (comment.comment_ref === "") {
          comment.comment_ref = comment._id;
          comment.date = new Date(comment.date);
          comment.original_date = new Date(
            parseInt(comment._id.substring(0, 8), 16) * 1000
          );
          return comment;
        }
        comment.date = new Date(comment.date);
        comment.original_date = new Date(
          parseInt(comment._id.substring(0, 8), 16) * 1000
        );
        return comment;
      });
      //sort comments so all comments are grouped together by ref(initial comment and replies) and then each group is sorted based on date created
      // console.log(dateComments);
      setSortedComments(
        dateComments.sort(function (a, b) {
          return (
            a.comment_ref.localeCompare(b.comment_ref) ||
            a.original_date.getTime() - b.original_date.getTime()
          );
        })
      );

      if (loadComments) {
        comments.forEach((reply) => {
          reply.open = false;
        });
        dispatch({ type: "load", payload: comments });
      }
    }
  }, [comments, commentError]);

  useEffect(() => {
    dispatch(commentForm);
  }, [commentForm]);

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
                onClick={() => mutate(`/api/comments/${post_id}`)}
              >
                Error Loading. Retry
              </Button>
            </div>
          ) : (
            <>
              {comments && (
                <List
                  sx={{
                    backgroundColor: drawer
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={toggleForm}
                    endIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={
                      showForm
                        ? { marginBottom: "5px" }
                        : { marginBottom: "10px" }
                    }
                  >
                    Add Comment
                  </Button>
                  <CommentForm
                    post_id={post_id}
                    comment_ref=""
                    showForm={showForm}
                    handleOpenDialog={handleOpenDialog}
                    modelLoading={modelLoading}
                  />
                  {sortedComments &&
                    sortedComments.map((comment) => (
                      <Comment
                        comment={comment}
                        post_id={post_id}
                        handleOpenDialog={handleOpenDialog}
                        handleOpenFlag={handleOpenFlag}
                        handleReply={handleReply}
                        key={comment._id}
                        drawer={drawer}
                        modelLoading={modelLoading}
                      />
                    ))}
                </List>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default CommentList;
