import TextBox from "@components/TextBox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { createFlag } from "@utils/api-helpers";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  text: {
    padding: "5px 0px 10px 0px",
    display: "flex",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
}));

const Flag = ({
  open,
  handleClose,
  contentType,
  result,
  name,
  setSnackbar,
}) => {
  const classes = useStyles();

  const [value, setValue] = useState();

  // update text input field
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // const createFlag = async (flag) => {
  //   const res = await fetch("/api/dashboard/flags", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(flag),
  //   });

  //   return res;
  // };

  const handleSubmit = async () => {
    //   UPDATE NAME AND ID
    const flag = {
      name: name,
      flagged: result.name ? result.name : "ecotenet",
      type: contentType,
      text: value,
      content_id: result._id,
      ref: result.post_id ? result.post_id : "",
      status: "pending",
      date: new Date().toUTCString(),
    };

    const flagResponse = await createFlag(flag);
    handleClose();

    if (flagResponse.ok) {
      setSnackbar({
        open: true,
        severity: "success",
        message: "Flag submitted successfully",
      });
    }
    if (!flagResponse.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem submitting flag. Please try again later",
      });
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="update"
        aria-describedby="update"
      >
        <DialogTitle
          id="update"
          className={classes.dialog}
          color="textPrimary"
          align="center"
        >
          Flag {contentType}
        </DialogTitle>

        <DialogContent className={classes.dialog}>
          <DialogContentText id="update" color="textPrimary">
            Why would you like to flag this item?
          </DialogContentText>
          <TextBox
            id="flag"
            handleChange={handleChange}
            defaultValue=""
            placeHolder=""
            rows={1}
            className={classes.text}
            autoFocus={true}
            name="flag"
          />
        </DialogContent>

        <DialogActions className={classes.dialog}>
          <Button
            onClick={() => handleClose()}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit()}
            color="secondary"
            variant="outlined"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Flag;
