import { useState, useRef } from "react";
import CommentForm from "./CommentForm";
import { Button, Typography, ListItem, Link } from "@material-ui/core";
import {
  alpha,
  makeStyles,
  useTheme,
  withStyles,
} from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles((theme) => ({
  paper: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
  },
  item: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    marginBottom: 10,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  reply: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    marginLeft: 60,
    width: "auto",
    // margin: "10px auto",
    marginBottom: 10,
  },
  comment: {
    flex: "auto",
  },
  description: {
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  content: {
    // display: "flex",
    // flexDirection: "column",
    // maxWidth: 800,
    flexGrow: 1,
    // marginLeft: 20,
  },
  items: {
    display: "flex",
    // flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
}));

//pass in comment and post id from comments
const Comment = ({ comment, post_id }) => {
  // console.log(comment);
  const classes = useStyles();

  // const [value, setValue] = useState("");

  const [reply, setReply] = useState(false);
  const container = useRef(null);

  const handleClick = () => {
    setReply(!reply);
  };

  //if comment ref equals comment id then display reply button otherwise do not. This creates only 1 level of nested comments
  if (comment.comment_ref === comment._id) {
    return (
      <>
        <ListItem className={classes.item}>
          <div className={classes.description}>
            <div className={classes.content}>
              <div className={classes.items}>
                <Typography
                  className={classes.author}
                  align="center"
                  variant="h6"
                >
                  <Link href="#" color="secondary">
                    {comment.name}
                  </Link>
                </Typography>
                <Typography
                  className={classes.publish}
                  align="left"
                  variant="h6"
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
                  // aria-describedby={id}
                  variant="outlined"
                  color="secondary"
                  onClick={handleClick}
                  endIcon={reply ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  reply
                </Button>
              </>
            )}
          </div>
        </ListItem>
        <CommentForm
          post_id={post_id}
          comment_ref={comment._id}
          showForm={reply}
          closeForm={handleClick}
        />
      </>
    );
  } else {
    return (
      <ListItem className={classes.reply}>
        <div className={classes.description}>
          <div className={classes.content}>
            <div className={classes.items}>
              <Typography
                className={classes.author}
                align="center"
                variant="h6"
              >
                <Link href="#" color="secondary">
                  {comment.name}
                </Link>
              </Typography>
              <Typography className={classes.publish} align="left" variant="h6">
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
        </div>
      </ListItem>
    );
  }
};

export default Comment;
