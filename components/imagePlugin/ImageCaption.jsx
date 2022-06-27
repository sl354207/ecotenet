import { TextField } from "@material-ui/core";
// import BackupIcon from '@material-ui/icons/Backup';
import { makeStyles } from "@material-ui/core/styles";
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
