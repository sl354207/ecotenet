import { TextField } from "@mui/material";
import theme from "@utils/theme";
import { connectField } from "uniforms";

// const useStyles = makeStyles((theme) => ({
//   field: {
//     display: "flex",
//     flexGrow: 1,
//     width: 450,
//     marginBottom: 5,
//     [theme.breakpoints.down("lg")]: {
//       width: 400,
//       // marginBottom: 5,
//     },
//     [theme.breakpoints.down("md")]: {
//       width: 250,
//       display: "flex",
//       // marginBottom: 5,
//     },
//     [theme.breakpoints.down("sm")]: {
//       width: 250,
//       // marginBottom: 5,
//     },
//   },
// }));

function ImageCaption({ onChange, value }) {
  // const classes = useStyles();ls

  return (
    <>
      <TextField
        placeholder="additional context or information for image"
        label="Caption"
        name="caption"
        // className={classes.field}
        sx={{
          display: "flex",
          flexGrow: 1,
          width: "450px",
          marginBottom: "5px",
          [theme.breakpoints.down("lg")]: {
            width: "400px",
            // marginBottom: 5,
          },
          [theme.breakpoints.down("md")]: {
            width: "250px",
            display: "flex",
            // marginBottom: 5,
          },
          [theme.breakpoints.down("sm")]: {
            width: "250px",
            // marginBottom: 5,
          },
        }}
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
