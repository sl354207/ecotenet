import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageDescription({ onChange, value }) {
  return (
    <TextField
      placeholder="brief description of image(for accessibility)"
      label="Alternative Description"
      name="description"
      id="description"
      sx={{
        display: "flex",
        flexGrow: 1,
        width: "450px",
        marginBottom: "5px",
        [theme.breakpoints.down("lg")]: {
          width: "400px",
          // marginBottom: 5,
        },
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
      inputProps={{ type: "text", maxLength: 100 }}
      onChange={(e) => {
        const description = e.target.value;
        onChange(description);
      }}
      // InputLabelProps={{ shrink: true }}
    />
  );
}

export default connectField(ImageDescription);
