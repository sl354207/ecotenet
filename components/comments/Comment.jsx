import {
  Button,
  IconButton,
  Link,
  ListItem,
  Typography,
} from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlagIcon from "@material-ui/icons/Flag";
import CommentForm from "./CommentForm";

const useStyles = makeStyles((theme) => ({
  comment: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    marginBottom: 10,
  },
  reply: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    marginLeft: 60,
    width: "auto",
    marginBottom: 10,
  },
  box: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
  },
  items: {
    display: "flex",
  },
  date: {
    marginLeft: 20,
    fontStyle: "italic",
  },
  flag: {
    marginLeft: 10,
  },
}));

//pass in comment and post id from comments
const Comment = ({
  comment,
  post_id,
  handleOpenDialog,
  handleOpenFlag,
  handleReply,
}) => {
  const classes = useStyles();

  //if comment ref equals comment id then display reply button otherwise do not. This creates only 1 level of nested comments
  if (comment.comment_ref === comment._id) {
    return (
      <>
        <ListItem className={classes.comment}>
          <div className={classes.box}>
            <div className={classes.content}>
              <div className={classes.items}>
                <Typography
                  className={classes.author}
                  align="center"
                  variant="body1"
                >
                  <Link href={`/person/${comment.name}`} color="secondary">
                    {comment.name}
                  </Link>
                </Typography>
                <Typography
                  className={classes.date}
                  align="left"
                  variant="body1"
                >
                  {comment.updated ? (
                    //
                    <>Updated on {comment.date.toDateString()}</>
                  ) : (
                    //
                    <>{comment.date.toDateString()}</>
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
              className={classes.flag}
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
      <ListItem className={classes.reply}>
        <div className={classes.box}>
          <div className={classes.content}>
            <div className={classes.items}>
              <Typography
                className={classes.author}
                align="center"
                variant="body1"
              >
                <Link href={`/person/${comment.name}`} color="secondary">
                  {comment.name}
                </Link>
              </Typography>
              <Typography className={classes.date} align="left" variant="body1">
                {comment.updated ? (
                  //
                  <>Updated on {comment.date.toDateString()}</>
                ) : (
                  //
                  <>{comment.date.toDateString()}</>
                )}
              </Typography>
            </div>
            <Typography variant="h6">{comment.text}</Typography>
          </div>
          <IconButton
            className={classes.flag}
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
