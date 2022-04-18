import {
  Button,
  IconButton,
  Typography,
  Link,
  Container,
  Divider,
  CircularProgress,
  Snackbar,
  List,
  ListItem,
} from "@material-ui/core";

import useSWR from "swr";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

import { useRouter } from "next/router";

import { useState } from "react";
import { Alert } from "@material-ui/lab";
import Notify from "./Notify";

const useStyles = makeStyles((theme) => ({
  description: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    flexGrow: 1,
    marginLeft: 20,
  },
  items: {
    display: "flex",
    // flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    // color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
  container: {
    backgroundColor: theme.palette.primary.main,
    // marginTop: "20px",
  },
  title: {
    paddingTop: "40px",
  },
  commentsection: {
    marginTop: 20,
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  button: {
    marginLeft: 4,
  },
  delete: {
    color: "#fc7ebf",
    borderColor: "#fc7ebf",
  },
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  buttonreply: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    marginLeft: 60,
    width: "auto",
    // margin: "10px auto",

    borderRadius: "10px",
  },
  buttonmobile: {
    display: "grid",
  },
  buttonup: {
    marginTop: 4,
  },

  delete: {
    color: "#fc7ebf",
    borderColor: "#fc7ebf",
  },

  comment: {
    display: "flow-root",
    flexGrow: 1,
  },
}));
//pass in comments and post id from parent post
const AdminComments = ({
  comments,
  comment_query,
  dialog,
  action,
  setSnackbar,
  handleOpenDialog,
  handleCloseDialog,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  //if comment doesn't have a ref(initial comment) than make ref same as comment id. Convert comment date from string to date object
  const dateComments = comments.map((comment) => {
    if (comment.comment_ref === "") {
      comment.comment_ref = comment._id;
      comment.date = new Date(comment.date);
      return comment;
    }
    comment.date = new Date(comment.date);
    return comment;
  });
  //sort comments so all comments are grouped together by ref(initial comment and replies) and then each group is sorted based on date created
  const sortedComments = dateComments.sort(function (a, b) {
    return (
      a.comment_ref.localeCompare(b.comment_ref) ||
      a.date.getTime() - b.date.getTime()
    );
  });

  return (
    <Container>
      <Typography variant="h6">Comments:</Typography>
      <List>
        {sortedComments.map((comment) => {
          return (
            <>
              <ListItem
                key={comment._id}
                className={
                  comment.comment_ref !== comment._id
                    ? classes.buttonreply
                    : classes.buttonpost
                }
                // className={classes.buttonpost}
                style={
                  comment._id == comment_query
                    ? { borderColor: "#fc7ebf" }
                    : { borderColor: "#94c9ff" }
                }
              >
                <div className={classes.comment}>
                  <Link>{comment.name}</Link>

                  <Typography>{comment.text}</Typography>
                </div>

                <div className={classes.buttonmobile}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleOpenDialog("Deny", "comment")}
                  >
                    Deny
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.buttonup}
                    onClick={() => handleOpenDialog("Delete", "comment")}
                  >
                    Delete
                  </Button>
                </div>
                <Notify
                  type="comment"
                  action={action}
                  open={dialog.notify}
                  handleClose={handleCloseDialog}
                  ariaLabeledBy="alert-dialog-title"
                  ariaDescribedBy="alert-dialog-description"
                  id="alert-dialog-description"
                  className={classes.dialog}
                  result={comment}
                  setSnackbar={setSnackbar}
                />
              </ListItem>
            </>
          );
        })}
      </List>
    </Container>
  );
};

export default AdminComments;
