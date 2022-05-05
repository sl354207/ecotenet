import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  header: {
    marginTop: 40,
  },
}));

const Header = ({ title, className }) => {
  const classes = useStyles();
  return (
    <Typography
      variant="h4"
      align="center"
      className={`${classes.header} ${className}`}
    >
      {title}
    </Typography>
  );
};

export default Header;
