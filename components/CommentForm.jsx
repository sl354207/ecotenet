import { useState, useRef } from "react";

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
    // margin: "10px auto",
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
  },
  comment: {
    display: "flex",
    // marginTop: 10,
    alignItems: "center",
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
    // display: "flex",
    flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
  addition: {
    display: "block",
  },
  submit: {
    marginLeft: 10,
  },
  cref: {
    marginLeft: 60,
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    // 'label + &': {
    //   marginTop: theme.spacing(3),
    // },
    // marginLeft: 60,
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

//pass in post id and comment ref from comment
const CommentForm = ({ show, post_id, comment_ref }) => {
  const classes = useStyles();

  const [value, setValue] = useState("");

  // const [show, setShow] = useState(false);
  const container = useRef(null);

  // const handleClick = () => {
  //   setShow(!show);
  // };

  // update text input field
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // handle comment submission to database through api
  const handleSubmit = async (value, post_id, comment_ref) => {
    //convert comment values to key value pairs
    const textObject = {
      text: value,
    };

    const idObject = {
      post_id: post_id,
    };

    const refObject = {
      comment_ref: comment_ref,
    };

    const dateObject = {
      date: new Date().toUTCString(),
    };
    //combine all objects and send to api
    const comment = Object.assign(idObject, refObject, dateObject, textObject);

    const res = await fetch("/api/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
  };

  return (
    <ListItem className={classes.addition} disableGutters>
      {/* <TextField
        id="outlined-textarea"
        label="Comment"
        multiline
        variant="outlined"
        onChange={handleChange}
        onSubmit={handleSubmit}
      /> */}

      {/* <Button
        variant="outlined"
        color="secondary"
        onClick={handleClick}
        endIcon={show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        Add Comment
      </Button> */}
      {show ? (
        <Portal container={container.current}>
          <FormControl className={classes.items}>
            <InputLabel shrink htmlFor="bootstrap"></InputLabel>
            <BootstrapInput
              defaultValue="react-bootstrap"
              id="bootstrap"
              autoFocus
              onChange={handleChange}
              onSubmit={handleSubmit}
              multiline
              className={comment_ref != "" ? classes.cref : null}
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSubmit(value, post_id, comment_ref)}
            className={classes.submit}
          >
            Submit
          </Button>
        </Portal>
      ) : null}

      <div ref={container} className={classes.comment} />
    </ListItem>
  );
};

export default CommentForm;
