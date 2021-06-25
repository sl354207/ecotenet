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

const Comment = ({ comment, post_id }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "reply-form" : undefined;

  if (comment.comment_ref === comment._id) {
    return (
      <div>
        <h3>{comment.text}</h3>
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
