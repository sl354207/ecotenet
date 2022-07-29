import { TextField } from "@mui/material";
import { connectField } from "uniforms";

function ImageWidth({ onChange, value }) {
  return (
    <>
      <TextField
        placeholder="default width is set to 500"
        label="Width"
        name="src"
        type="number"
        sx={{ display: "flex", flexGrow: 1, marginBottom: "5px" }}
        value={value || ""}
        onChange={(e) => {
          const width = Number(e.target.value);
          onChange(width);
        }}
      />
    </>
  );
}

export default connectField(ImageWidth);
