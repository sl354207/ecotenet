import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { createRef } from "react";
import CategorySpeciesListItem from "./CategorySpeciesListItem";

const CategorySpeciesList = ({
  category,
  dispatch,
  state,
  setItemSelect,
  setItem,
  setTab,
}) => {
  const uniqueFirst = [
    ...new Set(category.map((item) => item.scientific_name[0])),
  ];

  // create object where keys equal uniqueFirst value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  const refs = uniqueFirst.reduce((acc, value) => {
    acc[value] = createRef();
    // console.log(acc);
    return acc;
  }, {});

  //   };
  return (
    <>
      <List>
        {uniqueFirst.map((entry) => {
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
                      dispatch={dispatch}
                      state={state}
                      setItemSelect={setItemSelect}
                      setItem={setItem}
                      setTab={setTab}
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
    </>
  );
};

export default CategorySpeciesList;
