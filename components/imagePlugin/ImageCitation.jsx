import { TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { connectField } from "uniforms";

const useStyles = makeStyles(() => ({
  field: {
    display: "flex",
    flexGrow: 1,
    marginBottom: 5,
  },
}));

function ImageCitation({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="test"
        label="Citation"
        name="src"
        className={classes.field}
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
