import { Button, ListItem, Typography } from "@mui/material";

const CategorySpeciesListItem = ({
  result,
  state,
  dispatch,
  setItemSelect,
  setItem,
}) => {
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
        // href={`/species/${result._id}`}
        onClick={() => {
          // handleSubmit();
          dispatch({
            type: "add",
            payload: 0,
            value: result.unique_id,
            s_name: result.scientific_name,
            c_name: result.common_name,
          });
          setItemSelect(true);
          setItem(result.scientific_name);
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
