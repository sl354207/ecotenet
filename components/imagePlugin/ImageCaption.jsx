import { TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { connectField } from "uniforms";

const useStyles = makeStyles(() => ({
  field: {
    display: "flex",
    flexGrow: 1,
    marginBottom: 5,
    marginTop: 5,
  },
}));

function ImageCaption({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="additional context or information for image"
        label="Caption"
        name="src"
        className={classes.field}
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
