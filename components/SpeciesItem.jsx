import { Button, ListItem, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  button: {
    display: "block",
    justifyContent: "start",
    textTransform: "none",
  },
}));

const SpeciesItem = ({ result }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <ListItem key={result._id}>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        className={classes.button}
        href="/mammal"
      >
        {isMobile ? (
          <>
            <Typography variant="h6" color="textPrimary" align="left">
              <i>{result.Scientific_Name} -</i>
            </Typography>
            <Typography variant="h6" color="textPrimary" align="left">
              {result.COMMON_NAME}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" color="textPrimary" align="left">
            <i>{result.Scientific_Name} -</i> {result.COMMON_NAME}
          </Typography>
        )}
      </Button>
    </ListItem>
  );
};

export default SpeciesItem;
