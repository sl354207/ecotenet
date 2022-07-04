import { TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { connectField } from "uniforms";

const useStyles = makeStyles((theme) => ({
  field: {
    display: "flex",
    flexGrow: 1,
    width: 450,
    marginBottom: 5,
    [theme.breakpoints.down("lg")]: {
      width: 400,
      // marginBottom: 5,
    },
    [theme.breakpoints.down("md")]: {
      width: 250,
      display: "flex",
      // marginBottom: 5,
    },
    [theme.breakpoints.down("sm")]: {
      width: 250,
      // marginBottom: 5,
    },
  },
}));

function ImageCaption({ onChange, value }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        placeholder="additional context or information for image"
        label="Caption"
        name="caption"
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
