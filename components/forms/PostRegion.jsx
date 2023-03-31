import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import MapEditor from "@components/maps/MapEditor";
import {
  Autocomplete,
  Chip,
  Container,
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

const speciesChips = [
  { count: 0 },
  {
    id: 1,
    regions: [],
    common_name: "",
    scientific_name: "",
    _id: "",
    open: false,
  },
  {
    id: 2,
    regions: [],
    common_name: "",
    scientific_name: "",
    _id: "",
    open: false,
  },
  {
    id: 3,
    regions: [],
    common_name: "",
    scientific_name: "",
    _id: "",
    open: false,
  },
];

// reducer function used by useReducer hook. Toggles the openList value from true to false in menuItems to open and close the correct dropdowns on the drawer
const reducer = (speciesChips, action) => {
  if (action.type === "remove") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = speciesChips[2].open;
        speciesChips[1].regions = speciesChips[2].regions;
        speciesChips[1].scientific_name = speciesChips[2].scientific_name;
        speciesChips[1].common_name = speciesChips[2].common_name;
        speciesChips[1]._id = speciesChips[2]._id;

        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;
        speciesChips[2]._id = speciesChips[3]._id;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;
        speciesChips[2]._id = speciesChips[3]._id;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;
        speciesChips[0].count -= 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
  if (action.type === "add") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = true;
        speciesChips[1].regions = action.value;
        speciesChips[1].scientific_name = action.s_name;
        speciesChips[1].common_name = action.c_name;
        speciesChips[1]._id = action._id;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = true;
        speciesChips[2].regions = action.value;
        speciesChips[2].scientific_name = action.s_name;
        speciesChips[2].common_name = action.c_name;
        speciesChips[2]._id = action._id;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = true;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
};

//pass in and destructure props.
const PostRegion = ({ clickInfo, setClickInfo }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    if (e.target.value) {
      const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
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

  const [state, dispatch] = useReducer(reducer, speciesChips);

  const handleSubmit = (event, newValue) => {
    if (newValue !== null) {
      const dash = newValue.indexOf("-");
      const name = newValue.slice(0, dash - 1);

      for (const result of results) {
        if (result.scientific_name === name) {
          switch (state[0].count) {
            case 0:
              dispatch({
                type: "add",
                payload: 1,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
                _id: result._id,
              });
              break;
            case 1:
              dispatch({
                type: "add",
                payload: 2,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
                _id: result._id,
              });
              break;
            case 2:
              dispatch({
                type: "add",
                payload: 3,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
                _id: result._id,
              });
              break;

            default:
              throw new Error();
          }
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

  const handleRemoveChip = (id) => {
    dispatch({
      type: "remove",
      payload: id,
      value: [],
      s_name: "",
      c_name: "",
      _id: "",
    });
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
        onChange={(event, newValue) => handleSubmit(event, newValue)}
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
            inputProps={{ ...params.inputProps, type: "text", maxLength: 100 }}
            onChange={(e) => handleChange(e)}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
      {isMobile ? (
        <div style={{ display: "inline-grid", marginTop: "5px" }}>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <CustomChip
              label={`${state[1].scientific_name} - ${state[1].common_name}`}
              onClick={() => {
                window.open(
                  `/species/${state[1]._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onDelete={() => handleRemoveChip(1)}
              variant="outlined"
              sx={{
                borderColor: "#ff00ff",
              }}
            ></CustomChip>
          ) : (
            <CustomChip sx={{ visibility: "hidden" }}></CustomChip>
          )}
          {Array.isArray(state[2].regions) && state[2].regions.length ? (
            <CustomChip
              label={`${state[2].scientific_name} - ${state[2].common_name}`}
              onClick={() => {
                window.open(
                  `/species/${state[2]._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onDelete={() => handleRemoveChip(2)}
              variant="outlined"
              sx={{
                borderColor: "#ffff00",
              }}
            ></CustomChip>
          ) : (
            <></>
          )}
          {Array.isArray(state[3].regions) && state[3].regions.length ? (
            <CustomChip
              label={`${state[3].scientific_name} - ${state[3].common_name}`}
              onClick={() => {
                window.open(
                  `/species/${state[3]._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onDelete={() => handleRemoveChip(3)}
              variant="outlined"
              sx={{
                borderColor: "#00ffff",
              }}
            ></CustomChip>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "5px" }}>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <CustomChip
              label={`${state[1].scientific_name} - ${state[1].common_name}`}
              onClick={() => {
                window.open(
                  `/species/${state[1]._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onDelete={() => handleRemoveChip(1)}
              variant="outlined"
              sx={{
                borderColor: "#ff00ff",
              }}
            ></CustomChip>
          ) : (
            <Chip sx={{ visibility: "hidden" }}></Chip>
          )}
          {Array.isArray(state[2].regions) && state[2].regions.length ? (
            <CustomChip
              label={`${state[2].scientific_name} - ${state[2].common_name}`}
              onClick={() => {
                window.open(
                  `/species/${state[2]._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onDelete={() => handleRemoveChip(2)}
              variant="outlined"
              sx={{
                borderColor: "#ffff00",
              }}
            ></CustomChip>
          ) : (
            <></>
          )}
          {Array.isArray(state[3].regions) && state[3].regions.length ? (
            <CustomChip
              label={`${state[3].scientific_name} - ${state[3].common_name}`}
              onClick={() => {
                window.open(
                  `/species/${state[3]._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onDelete={() => handleRemoveChip(3)}
              variant="outlined"
              sx={{
                borderColor: "#00ffff",
              }}
            ></CustomChip>
          ) : (
            <></>
          )}
        </div>
      )}
      <Typography variant="h6" align="left">
        Ecoregions:* {clickInfo.map((region) => `Eco-${region}, `)}
      </Typography>

      <MapEditor
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        state={state}
        // zoom={isMobile ? 3 : 4}
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
