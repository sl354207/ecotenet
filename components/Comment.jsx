import { useState, useRef } from "react";
import CommentForm from "./CommentForm";
import {
  Button,
  Popper,
  Fade,
  Typography,
  ListItem,
  Link,
  Portal,
  InputBase,
  InputLabel,
  FormControl,
} from "@material-ui/core";
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
    margin: "10px auto",
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

const BootstrapInput = withStyles((theme) => ({
  root: {
    // 'label + &': {
    //   marginTop: theme.spacing(3),
    // },
    marginLeft: 60,
  },
  input: {
    position: "relative",
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    // fontSize: 16,
    width: "auto",
    padding: "20px 10px",
    flexGrow: 1,
    // transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif',
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(','),
    "&:focus": {
      // boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      flexGrow: 1,
    },
  },
}))(InputBase);

//pass in comment and post id from comments
const Comment = ({ comment, post_id }) => {
  // console.log(comment);
  const classes = useStyles();
  // // set anchor element state for popper
  // const [anchorEl, setAnchorEl] = useState(null);

  // // set popper anchor to clicked comment
  // const handleClick = (event) => {
  //   setAnchorEl(anchorEl ? null : event.currentTarget);
  // };

  // // if popper is open set id
  // const open = Boolean(anchorEl);
  // const id = open ? "reply-form" : undefined;

  const [value, setValue] = useState("");

  const [show, setShow] = useState(false);
  const container = useRef(null);

  const handleClick = () => {
    setShow(!show);
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
                    Author
                  </Link>
                </Typography>
                <Typography
                  className={classes.publish}
                  align="left"
                  variant="h6"
                >
                  {comment.date.toDateString()}
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
                  endIcon={show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  reply
                </Button>
              </>
            )}
          </div>
        </ListItem>
        <CommentForm post_id={post_id} comment_ref={comment._id} show={show} />

        {/* {show ? (
          // <Portal container={container.current}>
          //   <FormControl className={classes.items}>
          //     <InputLabel shrink htmlFor="bootstrap-input"></InputLabel>
          //     <BootstrapInput
          //       defaultValue="react-bootstrap"
          //       id="bootstrap-input"
          //       autoFocus
          //       multiline
          //     />
          //   </FormControl>
          // </Portal>
          <CommentForm post_id={post_id} comment_ref={comment._id} show={show}/>
        ) : null} */}

        {/* <div ref={container} /> */}
        {/* <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div className={classes.paper}>
                <CommentForm post_id={post_id} comment_ref={comment._id} />
              </div>
            </Fade>
          )}
        </Popper> */}
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
                  Author
                </Link>
              </Typography>
              <Typography className={classes.publish} align="left" variant="h6">
                {comment.date.toDateString()}
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
