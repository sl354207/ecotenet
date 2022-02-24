import { useState } from "react";
import CommentForm from "./CommentForm";
import { Button, Popper, Fade, Typography, ListItem } from "@material-ui/core";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  item: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    margin: "10px auto",
  },
  reply: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    marginLeft: 60,
    width: "auto",
    margin: "10px auto",
  },
  comment: {
    flex: "auto",
  },
}));

//pass in comment and post id from comments
const Comment = ({ comment, post_id }) => {
  const classes = useStyles();
  // set anchor element state for popper
  const [anchorEl, setAnchorEl] = useState(null);

  // set popper anchor to clicked comment
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // if popper is open set id
  const open = Boolean(anchorEl);
  const id = open ? "reply-form" : undefined;

  //if comment ref equals comment id then display reply button otherwise do not. This creates only 1 level of nested comments
  if (comment.comment_ref === comment._id) {
    return (
      <ListItem className={classes.item}>
        <Typography variant="body1" className={classes.comment}>
          {comment.text}
        </Typography>
        {/* display reply button and comment form with comment ref to original comment*/}
        {comment.comment_ref === comment._id && (
          <>
            <Button
              aria-describedby={id}
              variant="outlined"
              color="secondary"
              onClick={handleClick}
            >
              reply
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <div className={classes.paper}>
                    <CommentForm post_id={post_id} comment_ref={comment._id} />
                  </div>
                </Fade>
              )}
            </Popper>
          </>
        )}
      </ListItem>
    );
  } else {
    return (
      <ListItem className={classes.reply}>
        <Typography variant="body1">{comment.text}</Typography>
      </ListItem>
    );
  }
};

export default Comment;
