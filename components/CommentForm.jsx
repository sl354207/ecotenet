import { useState, useRef } from "react";

import {
  Button,
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
    padding: "0px 0px 10px 0px",
  },
  noref: {
    // marginLeft: 60,
    padding: "5px 0px 10px 0px",
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {},
  input: {
    position: "relative",
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: 4,
    // fontSize: 16,
    width: "auto",
    padding: "20px 10px",
    flexGrow: 1,

    "&:focus": {
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
    <div className={classes.addition} disableGutters>
      {show ? (
        <Portal container={container.current}>
          <FormControl className={classes.items}>
            <InputLabel shrink htmlFor="bootstrap"></InputLabel>
            <BootstrapInput
              // defaultValue="react-bootstrap"
              id="bootstrap"
              autoFocus
              onChange={handleChange}
              onSubmit={handleSubmit}
              multiline
              className={comment_ref != "" ? classes.cref : classes.noref}
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
    </div>
  );
};

export default CommentForm;
