import { useState, useRef } from "react";

import TextBox from "./TextBox";
import SureComment from "./SureComment";

import {
  Button,
  Portal,
  InputLabel,
  FormControl,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { Alert } from "@material-ui/lab";

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
const CommentForm = ({ showForm, post_id, comment_ref, closeForm }) => {
  const classes = useStyles();

  const router = useRouter();

  const [value, setValue] = useState("");

  const [dialog, setDialog] = useState(false);

  const [snackbar, setSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar(false);
    }

    setSnackbar(false);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleOpenDialog = () => {
    setDialog(true);
  };

  const container = useRef(null);

  // update text input field
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className={classes.addition} disableGutters>
      {showForm ? (
        <Portal container={container.current}>
          <FormControl className={classes.items}>
            <InputLabel shrink htmlFor="commentform"></InputLabel>
            <TextBox
              defaultValue={null}
              placeHolder={null}
              id="commentform"
              autoFocus={true}
              handleChange={handleChange}
              // rows={1}
              className={comment_ref != "" ? classes.cref : classes.noref}
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenDialog}
            className={classes.submit}
          >
            Submit
          </Button>
        </Portal>
      ) : null}

      <div ref={container} className={classes.comment} />
      <SureComment
        open={dialog}
        handleClose={handleCloseDialog}
        ariaLabeledBy="alert-dialog-title"
        ariaDescribedBy="alert-dialog-description"
        id="alert-dialog-description"
        className={classes.dialog}
        sure="Are you sure you want to submit comment?"
        action="submit"
        postID={post_id}
        value={value}
        resultID={comment_ref}
        setSnackbar={setSnackbar}
        closeForm={closeForm}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CommentForm;
