import SpeciesItem from "./SpeciesItem";
import { List } from "@material-ui/core";

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
