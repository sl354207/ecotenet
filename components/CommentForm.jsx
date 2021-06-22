import { useState } from "react";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";

const CommentForm = (_id) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (value, _id) => {
    const textObject = {
      text: value,
    };

    const idObject = {
      post_id: _id,
    };

    const comment = Object.assign(idObject, textObject);

    const res = await fetch("/api/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
  };

  return (
    <div>
      <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Placeholder"
        multiline
        variant="outlined"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <Button onClick={() => handleSubmit(value, _id)}>Save</Button>
    </div>
  );
};

export default CommentForm;
