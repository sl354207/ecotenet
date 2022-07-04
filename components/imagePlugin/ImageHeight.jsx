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

function ImageHeight({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="default height is set to 500"
        // defaultValue={500}
        label="Height"
        name="src"
        className={classes.field}
        // style={{ width: "400px" }}
        type="number"
        value={value || ""}
        onChange={(e) => {
          const height = Number(e.target.value);
          onChange(height);
        }}
      />
    </>
  );
}

export default connectField(ImageHeight);
