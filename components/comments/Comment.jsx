import Link from "@components/Link";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlagIcon from "@mui/icons-material/Flag";
import {
  Button,
  IconButton,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import theme from "@utils/theme";
import CommentForm from "./CommentForm";

//pass in comment and post id from comments
const Comment = ({
  comment,
  post_id,
  handleOpenDialog,
  handleOpenFlag,
  handleReply,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //if comment ref equals comment id then display reply button otherwise do not. This creates only 1 level of nested comments
  if (comment.comment_ref === comment._id) {
    return (
      <>
        <ListItem
          sx={{
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: "flex" }}>
                <Typography align="center" variant="body1">
                  <Link
                    href={`/person/${comment.name}`}
                    color="secondary"
                    underline="hover"
                  >
                    {comment.name}
                  </Link>
                </Typography>
                <Typography
                  sx={{ marginLeft: "20px", fontStyle: "italic" }}
                  align="left"
                  variant="body1"
                >
                  {comment.updated ? (
                    //
                    <>
                      Updated on{" "}
                      {isMobile
                        ? comment.date.toLocaleDateString()
                        : comment.date.toDateString()}
                    </>
                  ) : (
                    //
                    <>
                      {isMobile
                        ? comment.date.toLocaleDateString()
                        : comment.date.toDateString()}
                    </>
                  )}
                </Typography>
              </div>
              <Typography variant="h6">{comment.text}</Typography>
            </div>

            {/* display reply button and comment form with comment ref to original comment*/}
            {comment.comment_ref === comment._id && (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={
                    comment.open
                      ? () => handleReply("close", comment._id)
                      : () => handleReply("open", comment._id)
                  }
                  endIcon={
                    comment.open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                >
                  reply
                </Button>
              </>
            )}
            <IconButton
              sx={{ marginLeft: "10px" }}
              color="inherit"
              aria-label="flag"
              size="small"
              onClick={() => handleOpenFlag("comment", comment)}
            >
              <FlagIcon />
            </IconButton>
          </div>
        </ListItem>
        <CommentForm
          post_id={post_id}
          comment_ref={comment._id}
          showForm={comment.open}
          handleOpenDialog={handleOpenDialog}
        />
      </>
    );
  } else {
    return (
      <ListItem
        sx={{
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
          borderRadius: "4px",
          marginLeft: "60px",
          width: "auto",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: "flex" }}>
              <Typography align="center" variant="body1">
                <Link
                  href={`/person/${comment.name}`}
                  color="secondary"
                  underline="hover"
                >
                  {comment.name}
                </Link>
              </Typography>
              <Typography
                sx={{ marginLeft: "20px", fontStyle: "italic" }}
                align="left"
                variant="body1"
              >
                {comment.updated ? (
                  //
                  <>
                    Updated on{" "}
                    {isMobile
                      ? comment.date.toLocaleDateString()
                      : comment.date.toDateString()}
                  </>
                ) : (
                  //
                  <>
                    {isMobile
                      ? comment.date.toLocaleDateString()
                      : comment.date.toDateString()}
                  </>
                )}
              </Typography>
            </div>
            <Typography variant="h6">{comment.text}</Typography>
          </div>
          <IconButton
            sx={{ marginLeft: "10px" }}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenFlag("comment", comment)}
          >
            <FlagIcon />
          </IconButton>
        </div>
      </ListItem>
    );
  }
};

export default Comment;
