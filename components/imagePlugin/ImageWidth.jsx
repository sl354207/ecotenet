import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageWidth({ onChange, value }) {
  return (
    <>
      <TextField
        placeholder="default width is set to 500"
        label="Width"
        name="width"
        id="width"
        type="number"
        sx={{
          display: "flex",
          flexGrow: 1,
          marginBottom: "5px",
          [theme.breakpoints.down("md")]: {
            width: "250px",
            display: "flex",
            marginBottom: "5px",
          },
          [theme.breakpoints.down("sm")]: {
            width: "150px",
            display: "flex",
            marginBottom: "5px",
          },
        }}
        value={value || ""}
        onChange={(e) => {
          const width = Number(e.target.value);
          onChange(width);
        }}
        // InputLabelProps={{ shrink: true }}
      />
    </>
  );
}

export default connectField(ImageWidth);
