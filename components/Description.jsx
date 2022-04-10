import { Typography } from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  description: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const Description = ({ description, align, className }) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Typography
      variant="body1"
      align={align}
      className={`${classes.description} ${className}`}
    >
      {description}
    </Typography>
  );
};

export default Description;
