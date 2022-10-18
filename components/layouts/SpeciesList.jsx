import SpeciesItem from "@components/layouts/SpeciesItem";
import { List } from "@mui/material";

// pass in post as prop from PostList
const SpeciesList = ({ results }) => {
  return (
    <List>
      {results.map((result) => {
        return <SpeciesItem result={result} />;
      })}
    </List>
  );
};

export default SpeciesList;
