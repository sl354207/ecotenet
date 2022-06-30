import { TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { connectField } from "uniforms";

const useStyles = makeStyles(() => ({
  field: {
    display: "flex",
    flexGrow: 1,
    marginBottom: 5,
  },
}));

function ImageDescription({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="brief description of image(for accessibility)"
        label="Alternative Description"
        name="src"
        className={classes.field}
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
