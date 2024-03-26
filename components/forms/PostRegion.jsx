import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import MapEditor from "@components/maps/MapEditor";
import {
  Autocomplete,
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { useCallback, useReducer, useState } from "react";

const CustomChip = styled((props) => <Chip {...props} />)(({ theme }) => ({
  borderWidth: 2,
  color: theme.palette.text.primary,
  height: 40,
  margin: "0px 5px 10px 5px",

  "& .MuiChip-deleteIcon": {
    WebkitTapHighlightColor: "transparent",
    color: theme.palette.secondary.main,
    fontSize: 22,
    cursor: "pointer",
    margin: "0 5px 0 -6px",
    "&:hover": {
      color: alpha(theme.palette.secondary.main, 0.7),
    },
  },
}));

const initialState = {
  items: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return { items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item !== action.payload) };
    case "SELECT_ALL":
      return { items: action.payload };
    default:
      return state;
  }
}

//pass in and destructure props.
const PostRegion = ({ clickInfo, setClickInfo }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);

  const handleAutoChange = async (e) => {
    if (e.target.value) {
      const regex = /[`!@#$%^&*()_+=\[\]{};:"\\\|,.<>\/?~]/;
      if (!regex.test(e.target.value)) {
        const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();

          setResults(data);
        }
      }
    }
  };

  const handleAutoSubmit = (event, newValue) => {
    if (newValue !== null) {
      let name;
      if (newValue.includes(" - ")) {
        const dash = newValue.indexOf(" - ");
        name = newValue.slice(0, dash);
      } else {
        name = newValue;
      }

      for (const result of results) {
        if (result.scientific_name === name) {
          setClickInfo((clickInfo) => [...clickInfo, result.unique_id]);
          console.log(name);
          console.log(result);
          dispatch({ type: "ADD_ITEM", payload: result });
        } else {
          setClickInfo([]);
        }
      }

      setResults([]);
    }
  };

  const handleMapClick = useCallback((event) => {
    const region = event.features && event.features[0];

    if (region && region.properties.unique_id !== "<NA>") {
      setClickInfo((clickInfo) => {
        if (!clickInfo.includes(region && region.properties.unique_id)) {
          return [...clickInfo, region && region.properties.unique_id];
        } else {
          clickInfo.splice(clickInfo.indexOf(region.properties.unique_id), 1);

          return [...clickInfo];
        }
      });
    }
  }, []);

  const handleRemoveChip = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item });
  };
  const selectInterSecting = (first, second, third) => {
    let rest = [];
    if (second.length !== 0) {
      rest = [...rest, second];
    }
    if (third.length !== 0) {
      rest = [...rest, third];
    }

    rest = rest.map((array) => new Set(array));

    const intersecting = first.filter((e) => rest.every((set) => set.has(e)));
    setClickInfo(intersecting);
  };

  const [radioValue, setRadioValue] = useState();

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);

  const handleAddItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const handleRemoveItem = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item });
  };

  const handleSelectAll = () => {
    const allItems = ["item1", "item2", "item3"]; // Example items
    dispatch({ type: "SELECT_ALL", payload: allItems });
  };
  return (
    <Container>
      <Header title="Select Ecoregions" />

      <Description
        description="To help determine which ecoregions your post applies to you can add single or multiple species distributions to the map. These distributions may help you determine relevant ecoregions for your post. You may add or delete
        ecoregions by double clicking on the map. A single click highlights the
        ecoregion and displays the Eco-ID and ecoregion name"
        align="left"
      />

      <Typography variant="body1" align="left">
        Search for a species by common or scientific name to display their
        distribution on the map. A maximum of three species can be mapped at the
        same time
      </Typography>
      <Typography variant="body1" align="left" sx={{ marginTop: "20px" }}>
        *denotes required field
      </Typography>
      <Grid container>
        <Grid item xs={12} md={6}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Autocomplete
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.8),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.8),
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#94c9ff",
                  },
                  "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.3),
                  },
                  "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.3),
                  },
                  "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e57373",
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e57373",
                  },
                },
              }}
              autoHighlight
              onChange={(event, newValue) => handleAutoSubmit(event, newValue)}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="region-auto"
              options={
                results
                  ? results.map((obj) => {
                      if (obj.common_name) {
                        return `${obj.scientific_name} - ${obj.common_name}`;
                      } else {
                        return `${obj.scientific_name}`;
                      }
                    })
                  : []
              }
              filterOptions={(x) => x}
              freeSolo
              renderInput={(params) => (
                // ...params is causing error check dashboard index on how to log params
                <TextField
                  {...params}
                  id="region"
                  placeholder="Search…"
                  variant="outlined"
                  ref={params.InputProps.ref}
                  inputProps={{
                    ...params.inputProps,
                    type: "text",
                    maxLength: 100,
                  }}
                  onChange={(e) => handleAutoChange(e)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBlock: "10px" }}
              disabled={state.items.length === 0}
              // onClick={() => {
              //   setClickInfo(
              //     state[1].regions.concat(state[2].regions, state[3].regions)
              //   );
              // }}
            >
              Select All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBottom: "10px" }}
              disabled={state.items.length === 0}
              onClick={() => setClickInfo([])}
            >
              Clear All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginBottom: "10px" }}
              // onClick={() =>
              //   selectInterSecting(
              //     state[1].regions,
              //     state[2].regions,
              //     state[3].regions
              //   )
              // }
              disabled={state.items.length <= 1}
            >
              Select Intersecting
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl sx={{ display: "flex", justifyContent: "center" }}>
            <FormLabel id="radio-buttons-group-label"></FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              defaultValue="All Posts"
              value={radioValue}
              onChange={handleRadioChange}
              name="radio-buttons-group"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {state.items.map((item) => (
                <FormControlLabel
                  key={item.scientific_name}
                  value={item.scientific_name}
                  control={
                    <Radio
                      sx={{
                        color: `${theme.palette.secondary.main}!important`,
                      }}
                    />
                  }
                  label={
                    <CustomChip
                      label={
                        item.common_name
                          ? `${item.scientific_name} - ${item.common_name}`
                          : `${item.scientific_name}`
                      }
                      onClick={() => {
                        window.open(
                          `/species/${item.scientific_name.replace(/ /g, "_")}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      onDelete={() => handleRemoveChip(item)}
                      variant="outlined"
                      sx={{
                        borderColor: "#ff00ff",
                      }}
                    ></CustomChip>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* <button onClick={handleSelectAll}>Select All</button> */}
        </Grid>
      </Grid>

      <Typography variant="h6" align="left">
        Ecoregions:* {clickInfo.map((region) => `Eco-${region}, `)}
      </Typography>

      <MapEditor
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        // state={state}
      />
      <Typography variant="subtitle2" align="left" sx={{ marginTop: "10px" }}>
        A species distribution often does not align perfectly with ecoregion
        boundaries, therefore a species may not be present throughout the entire
        ecoregion but only in specific areas. A species may also be widespread
        but in small numbers so rarely seen.
      </Typography>
    </Container>
  );
};

export default PostRegion;
