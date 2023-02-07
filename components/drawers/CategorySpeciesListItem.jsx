import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, ListItem, Typography } from "@mui/material";

const CategorySpeciesListItem = ({ result, setItemSelected, setItem }) => {
  const { distributionDispatch, setTab } = useHomepageContext();
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
          distributionDispatch({
            type: "add",
            payload: 0,
            value: result.unique_id,
            s_name: result.scientific_name,
            c_name: result.common_name,
            _id: result._id,
          });
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
