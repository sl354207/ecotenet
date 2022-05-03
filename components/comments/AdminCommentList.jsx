import {
  Button,
  Typography,
  Link,
  Container,
  List,
  ListItem,
} from "@material-ui/core";

import { alpha, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonPost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  buttonReply: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    marginLeft: 60,
    width: "auto",
    marginTop: "20px",
    borderRadius: "10px",
  },
  buttonMobile: {
    display: "grid",
  },
  buttonDesktop: {
    marginTop: 4,
  },
  comment: {
    display: "flow-root",
    flexGrow: 1,
  },
}));
//pass in comments and post id from parent post
const AdminCommentList = ({
  comments,
  comment_query,
  handleOpenDialog,
  handleOpenResolve,
}) => {
  const classes = useStyles();

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
                    ? classes.buttonReply
                    : classes.buttonPost
                }
                style={
                  comment._id == comment_query
                    ? { borderColor: "#fc7ebf" }
                    : { borderColor: "#94c9ff" }
                }
              >
                <div className={classes.comment}>
                  <Typography>{comment.date.toDateString()}</Typography>
                  <Link>{comment.name}</Link>

                  <Typography>{comment.text}</Typography>
                </div>

                <div className={classes.buttonMobile}>
                  {comment._id == comment_query ? (
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
                        className={classes.buttonDesktop}
                        onClick={() =>
                          handleOpenDialog("Deny", "comment", comment)
                        }
                      >
                        Deny
                      </Button>

                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.buttonDesktop}
                        onClick={() =>
                          handleOpenDialog("Delete", "comment", comment)
                        }
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      {comment_query !== "flag" && (
                        <>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              handleOpenDialog("Deny", "comment", comment)
                            }
                          >
                            Deny
                          </Button>

                          <Button
                            variant="outlined"
                            color="secondary"
                            className={classes.buttonDesktop}
                            onClick={() =>
                              handleOpenDialog("Delete", "comment", comment)
                            }
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </ListItem>
            </>
          );
        })}
      </List>
    </Container>
  );
};

export default AdminCommentList;
