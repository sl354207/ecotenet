import { Button, ListItem, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SpeciesItem = ({ result }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xl"));

  return (
    <ListItem key={result._id}>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{
          display: "block",
          justifyContent: "start",
          textTransform: "none",
        }}
        href={`/species/${result._id}`}
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
