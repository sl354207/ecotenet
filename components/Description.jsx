import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  description: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const Description = ({ description, align, className }) => {
  const classes = useStyles();

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
