import Description from "@components/Description";
import Header from "@components/Header";
import MapEditor from "@components/maps/MapEditor";
import {
  Autocomplete,
  Chip,
  Container,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useCallback, useReducer, useState } from "react";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.light,
    "&:focus-within": {
      backgroundColor: theme.palette.primary.light,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    marginTop: 20,
    marginBottom: 20,
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  root: {
    color: theme.palette.text.primary,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
      "&:hover fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
      "&.Mui-focused fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
    },
  },
  popper: {
    marginTop: 4,
    backgroundColor: theme.palette.primary.light,
  },
  delete: {
    WebkitTapHighlightColor: "transparent",
    color: theme.palette.secondary.main,
    height: 22,
    width: 22,
    cursor: "pointer",
    margin: "0 5px 0 -6px",
    "&:hover": {
      color: alpha(theme.palette.secondary.main, 0.7),
    },
  },
  chip: {
    borderWidth: 2,
    color: theme.palette.text.primary,
    height: 40,
    margin: "0px 5px 10px 5px",
  },
  hidden: {
    visibility: "hidden",
  },
  mobile: {
    display: "inline-grid",
  },
  outline1: {
    borderColor: "#ff00ff",
  },
  outline2: {
    borderColor: "#ffff00",
  },
  outline3: {
    borderColor: "#00ffff",
  },
  description: {
    marginLeft: 10,
  },
  note: {
    marginTop: 10,
  },
}));

const speciesChips = [
  { count: 0 },
  {
    id: 1,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 2,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 3,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
];

// reducer function used by useReducer hook. Toggles the openList value from true to false in menuItems to open and close the correct dropdowns on the drawer
const reducer = (speciesChips, action) => {
  if (action.type == "remove") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = speciesChips[2].open;
        speciesChips[1].regions = speciesChips[2].regions;
        speciesChips[1].scientific_name = speciesChips[2].scientific_name;
        speciesChips[1].common_name = speciesChips[2].common_name;

        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[0].count -= 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
  if (action.type == "add") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = true;
        speciesChips[1].regions = action.value;
        speciesChips[1].scientific_name = action.s_name;
        speciesChips[1].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = true;
        speciesChips[2].regions = action.value;
        speciesChips[2].scientific_name = action.s_name;
        speciesChips[2].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = true;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
};

//pass in and destructure props.
const PostRegion = ({ clickInfo, setClickInfo }) => {
  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    if (e.target.value) {
      const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      setResults(data);
    }
  };

  const [state, dispatch] = useReducer(reducer, speciesChips);

  const handleSubmit = (event, newValue) => {
    if (newValue != null) {
      const dash = newValue.indexOf("-");
      const name = newValue.slice(0, dash - 1);

      for (const result of results) {
        if (result.Scientific_Name == name) {
          switch (state[0].count) {
            case 0:
              dispatch({
                type: "add",
                payload: 1,
                value: result.unique_id,
                s_name: result.Scientific_Name,
                c_name: result.COMMON_NAME,
              });
              break;
            case 1:
              dispatch({
                type: "add",
                payload: 2,
                value: result.unique_id,
                s_name: result.Scientific_Name,
                c_name: result.COMMON_NAME,
              });
              break;
            case 2:
              dispatch({
                type: "add",
                payload: 3,
                value: result.unique_id,
                s_name: result.Scientific_Name,
                c_name: result.COMMON_NAME,
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

    if (region && region.properties.unique_id != "<NA>") {
      setClickInfo((clickInfo) => {
        if (!clickInfo.includes(region && region.properties.unique_id)) {
          return [...clickInfo, region && region.properties.unique_id];
        } else {
          const removed = clickInfo.splice(
            clickInfo.indexOf(region.properties.unique_id),
            1
          );

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
    });
  };

  return (
    <Container>
      <Header title="Select Ecoregions" />

      <Description
        description="Choose which ecoregions apply to your post. You may add or delete
        ecoregions by double clicking on the map. A single click highlights the
        ecoregion and displays the Eco-ID and ecoregion name"
        align="left"
        className={classes.description}
      />

      <Typography variant="body1" align="left" className={classes.description}>
        Search for a species by common or scientific name to display their
        distribution on the map. A maximum of three species can be mapped at the
        same time
      </Typography>
      <Typography variant="body1" align="left" className={classes.description}>
        *denotes required field
      </Typography>
      <Autocomplete
        className={classes.search}
        classes={{ paper: classes.popper }}
        autoHighlight
        onChange={(event, newValue) => handleSubmit(event, newValue)}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={
          results
            ? results.map(
                (obj) => `${obj.Scientific_Name} - ${obj.COMMON_NAME}`
              )
            : []
        }
        filterOptions={(x) => x}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search…"
            variant="outlined"
            classes={{
              root: classes.root,
            }}
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            onChange={(e) => handleChange(e)}
          />
        )}
      />
      {isMobile ? (
        <div className={classes.mobile}>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <Chip
              label={`${state[1].scientific_name} - ${state[1].common_name}`}
              onDelete={() => handleRemoveChip(1)}
              variant="outlined"
              className={`${classes.outline1} ${classes.chip}`}
              classes={{
                deleteIcon: classes.delete,
              }}
            ></Chip>
          ) : (
            <Chip className={classes.hidden}></Chip>
          )}
          {Array.isArray(state[2].regions) && state[2].regions.length ? (
            <Chip
              label={`${state[2].scientific_name} - ${state[2].common_name}`}
              onDelete={() => handleRemoveChip(2)}
              variant="outlined"
              className={`${classes.outline2} ${classes.chip}`}
              classes={{
                deleteIcon: classes.delete,
              }}
            ></Chip>
          ) : (
            <></>
          )}
          {Array.isArray(state[3].regions) && state[3].regions.length ? (
            <Chip
              label={`${state[3].scientific_name} - ${state[3].common_name}`}
              onDelete={() => handleRemoveChip(3)}
              variant="outlined"
              className={`${classes.outline3} ${classes.chip}`}
              classes={{
                deleteIcon: classes.delete,
              }}
            ></Chip>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <Chip
              label={`${state[1].scientific_name} - ${state[1].common_name}`}
              onDelete={() => handleRemoveChip(1)}
              variant="outlined"
              className={`${classes.outline1} ${classes.chip}`}
              classes={{
                deleteIcon: classes.delete,
              }}
            ></Chip>
          ) : (
            <Chip className={classes.hidden}></Chip>
          )}
          {Array.isArray(state[2].regions) && state[2].regions.length ? (
            <Chip
              label={`${state[2].scientific_name} - ${state[2].common_name}`}
              onDelete={() => handleRemoveChip(2)}
              variant="outlined"
              className={`${classes.outline2} ${classes.chip}`}
              classes={{
                deleteIcon: classes.delete,
              }}
            ></Chip>
          ) : (
            <></>
          )}
          {Array.isArray(state[3].regions) && state[3].regions.length ? (
            <Chip
              label={`${state[3].scientific_name} - ${state[3].common_name}`}
              onDelete={() => handleRemoveChip(3)}
              variant="outlined"
              className={`${classes.outline3} ${classes.chip}`}
              classes={{
                deleteIcon: classes.delete,
              }}
            ></Chip>
          ) : (
            <></>
          )}
        </>
      )}
      <Typography variant="h6" align="left">
        Ecoregions:* {clickInfo.map((region) => `Eco-${region}, `)}
      </Typography>

      <MapEditor
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        state={state}
      />
      <Typography variant="subtitle2" align="left" className={classes.note}>
        *A species distribution often does not align perfectly with ecoregion
        boundaries, therefore a species may not be present throughout the entire
        ecoregion but only in specific areas. A species may also be widespread
        but in small numbers so rarely seen.
      </Typography>
    </Container>
  );
};

export default PostRegion;
