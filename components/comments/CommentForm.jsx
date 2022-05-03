import { useState, useRef } from "react";

import { Button, Portal, InputLabel, FormControl } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import TextBox from "../TextBox";

const useStyles = makeStyles(() => ({
  comment: {
    display: "flex",
    alignItems: "center",
  },
  form: {
    flexGrow: 1,
  },
  addition: {
    display: "block",
  },
  submit: {
    marginLeft: 10,
  },
  cRef: {
    marginLeft: 60,
    padding: "0px 0px 10px 0px",
  },
  noRef: {
    padding: "5px 0px 10px 0px",
  },
}));

//pass in post id and comment ref from comment
const CommentForm = ({ showForm, comment_ref, handleOpenDialog }) => {
  const classes = useStyles();

  const [value, setValue] = useState({ text: "", comment_ref: comment_ref });

  const container = useRef(null);

  // update text input field
  const handleChange = (event) => {
    setValue({ text: event.target.value, comment_ref: comment_ref });
  };

  return (
    <div className={classes.addition} disableGutters>
      {showForm ? (
        <Portal container={container.current}>
          <FormControl className={classes.form}>
            <InputLabel shrink htmlFor="commentform"></InputLabel>
            <TextBox
              defaultValue={null}
              placeHolder={null}
              id="commentform"
              autoFocus={true}
              handleChange={handleChange}
              className={comment_ref != "" ? classes.cRef : classes.noRef}
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenDialog("Comment", value)}
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
