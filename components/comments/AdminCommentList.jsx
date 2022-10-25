import Link from "@components/layouts/Link";
import {
  Button,
  Container,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import theme from "@utils/theme";

//pass in comments and post id from parent post
const AdminCommentList = ({
  comments,
  comment_query,
  handleOpenDialog,
  handleOpenResolve,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
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
                sx={
                  comment.comment_ref !== comment._id
                    ? {
                        display: "flex",
                        justifyContent: "start",
                        textTransform: "none",
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          1
                        )}`,
                        marginLeft: "60px",
                        width: "auto",
                        marginTop: "20px",
                        borderRadius: "10px",
                      }
                    : {
                        display: "flex",
                        justifyContent: "start",
                        textTransform: "none",
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          1
                        )}`,
                        margin: "20px auto",
                        borderRadius: "10px",
                      }
                }
                style={
                  comment._id == comment_query
                    ? { borderColor: "#fc7ebf" }
                    : { borderColor: "#94c9ff" }
                }
              >
                <div style={{ display: "flow-root", flexGrow: 1 }}>
                  <Typography>
                    {isMobile
                      ? comment.date.toLocaleDateString()
                      : comment.date.toDateString()}
                  </Typography>
                  <Link
                    href={`/admin/people/${comment.name}`}
                    underline="hover"
                  >
                    {comment.name}
                  </Link>

                  <Typography>{comment.text}</Typography>
                </div>

                <div style={{ display: "grid" }}>
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
                        sx={{ marginTop: "4px" }}
                        onClick={() =>
                          handleOpenDialog("Deny", "comment", comment)
                        }
                      >
                        Deny
                      </Button>

                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ marginTop: "4px" }}
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
                            sx={{ marginTop: "4px" }}
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
