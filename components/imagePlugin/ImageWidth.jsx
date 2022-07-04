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

function ImageWidth({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="default width is set to 500"
        label="Width"
        name="src"
        type="number"
        // defaultValue={500}
        className={classes.field}
        // style={{ width: "400px" }}
        value={value || ""}
        onChange={(e) => {
          console.log(typeof e.target.value);
          const width = Number(e.target.value);
          onChange(width);
        }}
      />
    </>
  );
}

export default connectField(ImageWidth);
