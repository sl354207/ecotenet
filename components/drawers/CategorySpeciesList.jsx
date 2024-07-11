import {
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import theme from "@utils/theme";
import { createRef } from "react";
import CategorySpeciesListItem from "./CategorySpeciesListItem";

const CategorySpeciesList = ({
  category,
  setItemSelected,
  setItem,
  ecoFilter,
  title,
  mutate,
  apiQuery,
  nativeToggleValue,
  setNativeToggleValue,
}) => {
  const uniqueFirstLetter = [
    ...new Set(category.map((item) => item.scientific_name[0])),
  ];

  // create object where keys equal uniqueFirstLetter value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  const refs = uniqueFirstLetter.reduce((acc, value) => {
    acc[value] = createRef();

    return acc;
  }, {});

  const handleNativeToggleChange = (event) => {
    if (event.target.value === "observed") {
      setNativeToggleValue("observed");
      mutate(
        `/api/${ecoFilter.unique_id}/${apiQuery}?native=${nativeToggleValue}`
      );
    } else {
      setNativeToggleValue("native");
      mutate(`/api/${ecoFilter.unique_id}/mammal?native=${nativeToggleValue}`);
    }
  };

  return (
    <>
      <Container sx={{ minHeight: "auto" }}>
        <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
          *Eco-{ecoFilter.unique_id} {title} current species count:{" "}
          {category.length}
        </Typography>
      </Container>
      <FormControl
        component="fieldset"
        sx={{
          marginTop: "20px",
          marginLeft: "80px",
        }}
      >
        <RadioGroup
          aria-label="native-toggle"
          name="native-toggle"
          value={nativeToggleValue}
          onChange={handleNativeToggleChange}
          row
        >
          <FormControlLabel
            value="observed"
            control={
              <Radio
                color="secondary"
                sx={{
                  color: `${theme.palette.secondary.main}!important`,
                }}
              />
            }
            label="observed"
          />
          <FormControlLabel
            value="native"
            // disabled={
            //   (ecoChips &&
            //     ecoChips[0] &&
            //     ecoChips[0].native_ecoregions &&
            //     ecoChips[0].native_ecoregions.length === 0) ||
            //   (ecoChips && ecoChips[0] && !ecoChips[0].native_ecoregions)
            // }
            control={
              <Radio
                color="secondary"
                sx={{
                  color: `${theme.palette.secondary.main}!important`,
                }}
              />
            }
            label="native"
          />
        </RadioGroup>
      </FormControl>
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
    </>
  );
};

export default CategorySpeciesList;
