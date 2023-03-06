import { useSnackbarContext } from "@components/context/SnackbarContext";
import TextBox from "@components/inputFields/TextBox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
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
        // aria-labelledby="update"
        // aria-describedby="update"
      >
        <DialogTitle
          id="flag-title"
          sx={{ backgroundColor: theme.palette.primary.light }}
          color="textPrimary"
          align="center"
        >
          Flag {contentType}
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: theme.palette.primary.light }}>
          <DialogContentText id="flag-text" color="textPrimary">
            Why would you like to flag this item?
          </DialogContentText>
          <FormControl sx={{ display: "flex", flexGrow: 1, marginTop: "5px" }}>
            <InputLabel shrink htmlFor="flag"></InputLabel>
            <TextBox
              id="flag"
              handleChange={handleChange}
              defaultValue=""
              placeHolder=""
              autoFocus={true}
              inputProps={{ type: "text", maxLength: 200 }}
            />
          </FormControl>
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
            disabled={
              (typeof value === "string" && value.trim().length === 0) ||
              value === undefined
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Flag;
