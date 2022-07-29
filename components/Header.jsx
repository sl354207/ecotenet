import { Typography } from "@mui/material";

// const useStyles = makeStyles(() => ({
//   // header: {
//   //   marginTop: 40,
//   // },
// }));

const Header = ({ title, className }) => {
  // const classes = useStyles();
  return (
    <Typography
      variant="h4"
      align="center"
      // className={`${classes.header} ${className}`}
      sx={{ marginTop: "40px" }}
    >
      {title}
    </Typography>
  );
};

export default Header;
