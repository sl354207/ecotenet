import { TextField } from "@mui/material";
import { connectField } from "uniforms";

function ImageHeight({ onChange, value }) {
  return (
    <>
      <TextField
        placeholder="default height is set to 500"
        // defaultValue={500}
        label="Height"
        name="src"
        sx={{ display: "flex", flexGrow: 1, marginBottom: "5px" }}
        type="number"
        // inputProps={{ max: "1200" }}
        value={value || ""}
        onChange={(e) => {
          const height = Number(e.target.value);
          onChange(height);
        }}
      />
    </>
  );
}

export default connectField(ImageHeight);
