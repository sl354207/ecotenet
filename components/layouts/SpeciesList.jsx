import SpeciesItem from "@components/layouts/SpeciesItem";
import { List } from "@mui/material";

const SpeciesList = ({ results, handleClose }) => {
  return (
    <List>
      {results.map((result) => {
        return (
          <SpeciesItem
            result={result}
            handleClose={handleClose}
            key={result._id}
          />
        );
      })}
    </List>
  );
};

export default SpeciesList;
