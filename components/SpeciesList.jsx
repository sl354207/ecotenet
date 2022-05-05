import { List } from "@material-ui/core";
import SpeciesItem from "./SpeciesItem";

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
