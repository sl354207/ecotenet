import { TextField } from "@material-ui/core";
// import BackupIcon from '@material-ui/icons/Backup';
import { makeStyles } from "@material-ui/core/styles";
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
