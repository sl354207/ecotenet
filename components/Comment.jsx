import { useState } from "react";
import CommentForm from "./CommentForm";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Popper } from "@material-ui/core";
import { Fade } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
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
      <div>
        <h3>{comment.text}</h3>
        {/* display reply button and comment form with comment ref to original comment*/}
        {comment.comment_ref === comment._id && (
          <div>
            <Button aria-describedby={id} onClick={handleClick}>
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
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <h3>REPLY COMMENT{comment.text}</h3>
      </div>
    );
  }
};

export default Comment;
