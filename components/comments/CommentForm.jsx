import TextBox from "@components/inputFields/TextBox";
import { Button, FormControl, InputLabel, Portal } from "@mui/material";
import { useRef, useState } from "react";

//pass in post id and comment ref from comment
const CommentForm = ({ showForm, comment_ref, handleOpenDialog }) => {
  const [value, setValue] = useState({ text: "", comment_ref: comment_ref });

  const container = useRef(null);

  // update text input field
  const handleChange = (event) => {
    setValue({ text: event.target.value, comment_ref: comment_ref });
  };

  return (
    <div style={{ display: "block" }} disablegutters="true">
      {showForm ? (
        <Portal container={container.current}>
          <FormControl
            sx={
              comment_ref !== ""
                ? { flexGrow: 1, marginBottom: "10px", marginLeft: "25px" }
                : { flexGrow: 1, marginBottom: "10px" }
            }
          >
            <InputLabel shrink htmlFor="comment-form"></InputLabel>
            <TextBox
              defaultValue={null}
              placeHolder={null}
              id="comment-form"
              autoFocus={true}
              handleChange={handleChange}
              multiline={true}
              inputProps={{ type: "text", maxLength: 5000 }}
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenDialog("Comment", value)}
            sx={{ marginLeft: "10px" }}
          >
            Submit
          </Button>
        </Portal>
      ) : null}

      <div ref={container} style={{ display: "flex", alignItems: "center" }} />
    </div>
  );
};

export default CommentForm;
