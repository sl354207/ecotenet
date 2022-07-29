import { Typography } from "@mui/material";

// const useStyles = makeStyles(() => ({
//   // description: {
//   //   marginTop: 20,
//   //   marginBottom: 20,
//   // },
// }));

const Description = ({ description, align, className }) => {
  // const classes = useStyles();

  return (
    <Typography
      variant="body1"
      align={align}
      // className={`${classes.description} ${className}`}
      sx={{ marginTop: "20px", marginBottom: "20px" }}
    >
      {description}
    </Typography>
  );
};

export default Description;
