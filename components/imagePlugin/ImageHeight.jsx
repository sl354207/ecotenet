import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

function ImageHeight({ onChange, value }) {
  return (
    <TextField
      placeholder="default height is set to 500"
      // defaultValue={500}
      label="Height"
      name="height"
      id="height"
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
      type="number"
      // inputProps={{ max: "1200" }}
      value={value || ""}
      onChange={(e) => {
        const height = Number(e.target.value);
        onChange(height);
      }}
      InputLabelProps={{ shrink: true }}
    />
  );
}

export default connectField(ImageHeight);
