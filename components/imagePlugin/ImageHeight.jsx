import { TextField } from "@mui/material";
import { connectField } from "uniforms";

// const useStyles = makeStyles(() => ({
//   // field: {
//   //   display: "flex",
//   //   flexGrow: 1,
//   //   marginBottom: 5,
//   // },
// }));

function ImageHeight({ onChange, value }) {
  // const classes = useStyles();ls

  return (
    <>
      <TextField
        placeholder="default height is set to 500"
        // defaultValue={500}
        label="Height"
        name="src"
        // className={classes.field}
        sx={{ display: "flex", flexGrow: 1, marginBottom: "5px" }}
        // style={{ width: "400px" }}
        type="number"
        // inputProps={{ max: "1200" }}
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
