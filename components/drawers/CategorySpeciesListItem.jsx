import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, ListItem, Typography } from "@mui/material";

const CategorySpeciesListItem = ({ result, setItemSelected, setItem }) => {
  const { setEcoChips, setTab } = useHomepageContext();
  return (
    <ListItem>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{
          display: "block",
          justifyContent: "start",
          textTransform: "none",
        }}
        onClick={() => {
          result.id = result.scientific_name;
          result.native = false;
          setEcoChips([result]);

          setItemSelected(true);
          setItem(result);
          setTab({ id: 2, label: "Distributions" });
        }}
      >
        <Typography variant="h6" color="textPrimary" align="left">
          <i>{result.scientific_name}</i>
        </Typography>
        {result.common_name && (
          <Typography variant="h6" color="textPrimary" align="left">
            {result.common_name}
          </Typography>
        )}
      </Button>
    </ListItem>
  );
};

export default CategorySpeciesListItem;
