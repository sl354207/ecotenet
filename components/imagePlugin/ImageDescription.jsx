import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageDescription({ onChange, value }) {
  return (
    <>
      <TextField
        placeholder="brief description of image(for accessibility)"
        label="Alternative Description"
        name="description"
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
            // marginBottom: 5,
          },
          [theme.breakpoints.down("sm")]: {
            width: "250px",
            // marginBottom: 5,
          },
        }}
        value={value || ""}
        onChange={(e) => {
          const description = e.target.value;
          onChange(description);
        }}
      />
    </>
  );
}

export default connectField(ImageDescription);
