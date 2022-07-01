import { TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { connectField } from "uniforms";

const useStyles = makeStyles(() => ({
  //   field: {
  //     display: "flex",
  //     flexGrow: 1,
  //     marginBottom: 5,
  //   },
}));

function ImageHeight({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="brief description of image(for accessibility)"
        label="Height"
        name="src"
        className={classes.field}
        style={{ width: "400px" }}
        value={value || ""}
        onChange={(e) => {
          const description = e.target.value;
          onChange(description);
        }}
      />
    </>
  );
}

export default connectField(ImageHeight);
