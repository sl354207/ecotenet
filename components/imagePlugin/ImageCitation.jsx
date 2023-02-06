import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageCitation({ onChange, value }) {
  return (
    <TextField
      placeholder="credit for image ownership"
      label="Citation"
      name="citation"
      id="citation"
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
        const citation = e.target.value;
        onChange(citation);
      }}
      // InputLabelProps={{ shrink: true }}
    />
  );
}

export default connectField(ImageCitation);
