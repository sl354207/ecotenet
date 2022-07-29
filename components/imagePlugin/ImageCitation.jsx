import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageCitation({ onChange, value }) {
  return (
    <>
      <TextField
        placeholder="credit for image ownership"
        label="Citation"
        name="citation"
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
          const citation = e.target.value;
          onChange(citation);
        }}
      />
    </>
  );
}

export default connectField(ImageCitation);
