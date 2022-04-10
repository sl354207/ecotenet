import { Typography } from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: 40,
  },
}));

const Header = ({ title, className }) => {
  const classes = useStyles();
  const theme = useTheme();
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
