import { Button, ListItem, Typography } from "@mui/material";

const SpeciesItem = ({ result, state, dispatch }) => {
  // console.log(result);
  const handleSubmit = () => {
    switch (state[0].count) {
      case 0:
        dispatch({
          type: "add",
          payload: 1,
          value: result.unique_id,
          s_name: result.scientific_name,
          c_name: result.common_name,
        });
        break;
      case 1:
        dispatch({
          type: "add",
          payload: 2,
          value: result.unique_id,
          s_name: result.scientific_name,
          c_name: result.common_name,
        });
        break;
      case 2:
        dispatch({
          type: "add",
          payload: 3,
          value: result.unique_id,
          s_name: result.scientific_name,
          c_name: result.common_name,
        });
        break;

      default:
      //   throw new Error();
    }
  };

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

export default SpeciesItem;
