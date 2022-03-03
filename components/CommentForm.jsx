import { useState, useRef } from "react";

import TextBox from "./TextBox";
import Sure from "./Sure";

import { Button, Portal, InputLabel, FormControl } from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

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
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
}));

//pass in post id and comment ref from comment
const CommentForm = ({ show, post_id, comment_ref }) => {
  const classes = useStyles();

  const router = useRouter();

  const [value, setValue] = useState("");

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

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

  // () => handleSubmit(value, post_id, comment_ref)

  return (
    <div className={classes.addition} disableGutters>
      {show ? (
        <Portal container={container.current}>
          <FormControl className={classes.items}>
            <InputLabel shrink htmlFor="commentform"></InputLabel>
            <TextBox
              defaultValue={null}
              placeHolder={null}
              id="commentform"
              autoFocus={true}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              // rows={1}
              className={comment_ref != "" ? classes.cref : classes.noref}
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
            className={classes.submit}
          >
            Submit
          </Button>
        </Portal>
      ) : null}

      <div ref={container} className={classes.comment} />
      <Sure
        open={open}
        handleClose={handleClose}
        ariaLabeledBy="alert-dialog-title"
        ariaDescribedBy="alert-dialog-description"
        id="alert-dialog-description"
        className={classes.dialog}
        sure="Are you sure you want to submit comment?"
        action="submit"
        postID={post_id}
        value={value}
        resultID={comment_ref}
      />
    </div>
  );
};

export default CommentForm;
