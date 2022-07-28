import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
  // header: {
  //   marginTop: 40,
  // },
}));

const Header = ({ title, className }) => {
  const classes = useStyles();
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
