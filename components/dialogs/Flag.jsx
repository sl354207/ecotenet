import { useSnackbarContext } from "@components/context/SnackbarContext";
import TextBox from "@components/inputFields/TextBox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createFlag } from "@utils/apiHelpers";
import theme from "@utils/theme";
import { useState } from "react";

const Flag = ({ open, handleClose, contentType, result, name }) => {
  const { snackbar, setSnackbar } = useSnackbarContext();

  const [value, setValue] = useState();

  // update text input field
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    //   UPDATE NAME AND ID
    const flag = {
      name: name,
      flagged: result.name ? result.name : "ecotenet",
      type: contentType,
      text: value,
      content_id: result._id,
      ref: result.post_id ? result.post_id : "",
    };

    const flagResponse = await createFlag(flag);
    handleClose();

    if (flagResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: "Flag submitted successfully",
      });
    }
    if (!flagResponse.ok) {
      setSnackbar({
        ...snackbar,
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
          sx={{ backgroundColor: theme.palette.primary.light }}
          color="textPrimary"
          align="center"
        >
          Flag {contentType}
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: theme.palette.primary.light }}>
          <DialogContentText id="update" color="textPrimary">
            Why would you like to flag this item?
          </DialogContentText>
          <TextBox
            id="flag"
            handleChange={handleChange}
            defaultValue=""
            placeHolder=""
            rows={1}
            autoFocus={true}
            name="flag"
          />
        </DialogContent>

        <DialogActions sx={{ backgroundColor: theme.palette.primary.light }}>
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
