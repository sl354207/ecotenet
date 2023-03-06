import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { createRef } from "react";
import CategorySpeciesListItem from "./CategorySpeciesListItem";

const CategorySpeciesList = ({ category, setItemSelected, setItem }) => {
  const uniqueFirstLetter = [
    ...new Set(category.map((item) => item.scientific_name[0])),
  ];

  // create object where keys equal uniqueFirstLetter value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  const refs = uniqueFirstLetter.reduce((acc, value) => {
    acc[value] = createRef();
    // console.log(acc);
    return acc;
  }, {});

  //   };
  return (
    <List>
      {uniqueFirstLetter.map((entry) => {
        return (
          <>
            <ListItem key={entry} ref={refs[entry]}>
              <ListItemText>
                <Typography variant="h5" color="secondary">
                  {entry}
                </Typography>
              </ListItemText>
            </ListItem>
            {category.map((item) => {
              if (item.scientific_name[0] === entry) {
                return (
                  <CategorySpeciesListItem
                    result={item}
                    setItemSelected={setItemSelected}
                    setItem={setItem}
                    key={item._id}
                  />
                );
              }
            })}
            <Divider />
          </>
        );
      })}
    </List>
  );
};

export default CategorySpeciesList;
