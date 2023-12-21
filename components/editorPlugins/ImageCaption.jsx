import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageCaption({ onChange, value }) {
  return (
    <TextField
      placeholder="additional context or information for image"
      label="Caption"
      name="caption"
      id="caption"
      sx={{
        display: "flex",
        flexGrow: 1,
        width: "450px",
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
      inputProps={{ type: "text", maxLength: 100 }}
      onChange={(e) => {
        const caption = e.target.value;
        onChange(caption);
      }}
      // InputLabelProps={{ shrink: true }}
    />
  );
}

export default connectField(ImageCaption);
