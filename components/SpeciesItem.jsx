import { Button, ListItem, Typography, useMediaQuery } from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  buttonspecies: {
    display: "block",
    justifyContent: "start",
    textTransform: "none",
  },
}));

const SpeciesItem = ({ result }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const router = useRouter();

  return (
    <ListItem key={result._id}>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        className={classes.buttonspecies}
        onClick={() => {
          router.push("/mammal");
        }}
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
