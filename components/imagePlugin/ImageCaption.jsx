import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageCaption({ onChange, value }) {
  return (
    <>
      <TextField
        placeholder="additional context or information for image"
        label="Caption"
        name="caption"
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
        onChange={(e) => {
          const caption = e.target.value;
          onChange(caption);
        }}
      />
    </>
  );
}

export default connectField(ImageCaption);
