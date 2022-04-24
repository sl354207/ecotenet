import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useCallback, useReducer } from "react";

import {
  Container,
  Typography,
  InputBase,
  useMediaQuery,
  Chip,
  TextField,
  Button,
} from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "../Header";
import Description from "../Description";
import MapEditor from "../maps/MapEditor";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    // flexShrink: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    top: 60,
    marginTop: 20,
    border: "1px solid #94c9ff",
    borderRadius: "10px",
    // position: "sticky",
    // width: "100%",
    // maxWidth: 36,
    // backgroundColor: theme.palette.secondary.main,
  },
  sublist: {
    display: "flex",

    justifyContent: "center",
    // flexShrink: 1,
    // flexWrap: "wrap",

    // width: "100%",
    // maxWidth: 36,
  },
  header: {
    marginTop: 20,
  },

  search: {
    position: "relative",
    // border: "2px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.light,

    "&:focus-within": {
      backgroundColor: theme.palette.primary.light,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    // "&:hover": {
    //   // backgroundColor: alpha(theme.palette.common.white, 0.25),
    //   border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    //   outline: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    // },
    // marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },
  inputRoot: {
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
  inputInput: {
    padding: theme.spacing(2, 2, 2, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    // transition: theme.transitions.create("width"),
    // width: "100%",
    // [theme.breakpoints.up("xs")]: {
    //   width: "0ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },

  popper: {
    backgroundColor: theme.palette.primary.light,
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  chipDelete: {
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
    // fontSize: 16,
    height: 40,
    margin: "0px 5px 10px 5px",
  },
  chipHidden: {
    visibility: "hidden",
  },
  chipMobile: {
    display: "inline-grid",
  },
  chipOutline1: {
    borderColor: "#ff00ff",
  },
  chipOutline2: {
    borderColor: "#ffff00",
  },
  chipOutline3: {
    borderColor: "#00ffff",
  },
  description: {
    // marginTop: 20,
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
    // console.log(speciesChips);
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
    // console.log(speciesChips);
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
const PostRegion = ({ handleNext, handleBack, clickInfo, setClickInfo }) => {
  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    if (e.target.value) {
      //   console.log(e.target.value);
      const res = await fetch(`/api/search/autoSpecies?q=${e.target.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      // console.log(data);
      setResults(data);
    }
  };

  const [state, dispatch] = useReducer(reducer, speciesChips);

  const handleSubmit = (event, newValue) => {
    if (newValue != null) {
      const dash = newValue.indexOf("-");
      const name = newValue.slice(0, dash - 1);
      // console.log(name);
      for (const result of results) {
        if (result.Scientific_Name == name) {
          // setQuery(result);
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
          // setSpeciesInfo1([...result.unique_id]);
        }
      }
      // console.log(speciesInfo1);
      setResults([]);
    }
  };

  const handleMapClick = useCallback((event) => {
    const region = event.features && event.features[0];
    // console.log(region);
    if (region && region.properties.unique_id != "<NA>") {
      setClickInfo((clickInfo) => {
        // console.log(clickInfo);
        if (!clickInfo.includes(region && region.properties.unique_id)) {
          return [...clickInfo, region && region.properties.unique_id];
        } else {
          const removed = clickInfo.splice(
            clickInfo.indexOf(region.properties.unique_id),
            1
          );
          // console.log(removed);
          // console.log(clickInfo);
          return [...clickInfo];
        }
      });
    }

    // console.log(clickInfo);
  }, []);

  const handleRemoveChip = (id) => {
    dispatch({
      type: "remove",
      payload: id,
      value: [],
      s_name: "",
      c_name: "",
    });
    // return dispatch();
  };

  return (
    <Container>
      {/* <Typography variant="h4" align="center" className={classes.header}>
        Post Details
      </Typography> */}
      <Header title="Select Ecoregions" />
      {/* <Typography variant="body1" align="left" className={classes.description}>
        Choose which ecoregions apply to your post. You may add or delete
        ecoregions by double clicking on the map. A single click highlights the
        ecoregion and displays the Eco-ID and ecoregion name
      </Typography> */}
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
        // disableClearable={true}
        onChange={(event, newValue) => handleSubmit(event, newValue)}
        selectOnFocus
        clearOnBlur
        // clearText="Clear"
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
        // closeIcon
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search…"
            variant="outlined"
            classes={{
              root: classes.inputRoot,
            }}
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            onChange={(e) => handleChange(e)}
          />
        )}
      />
      {isMobile ? (
        <div className={classes.chipMobile}>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <Chip
              label={`${state[1].scientific_name} - ${state[1].common_name}`}
              onDelete={() => handleRemoveChip(1)}
              variant="outlined"
              // color="secondary"
              className={`${classes.chipOutline1} ${classes.chip}`}
              classes={{
                deleteIcon: classes.chipDelete,
              }}
            ></Chip>
          ) : (
            <Chip className={classes.chipHidden}></Chip>
          )}
          {Array.isArray(state[2].regions) && state[2].regions.length ? (
            <Chip
              label={`${state[2].scientific_name} - ${state[2].common_name}`}
              onDelete={() => handleRemoveChip(2)}
              variant="outlined"
              className={`${classes.chipOutline2} ${classes.chip}`}
              classes={{
                deleteIcon: classes.chipDelete,
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
              className={`${classes.chipOutline3} ${classes.chip}`}
              classes={{
                deleteIcon: classes.chipDelete,
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
              // color="secondary"
              className={`${classes.chipOutline1} ${classes.chip}`}
              classes={{
                deleteIcon: classes.chipDelete,
              }}
            ></Chip>
          ) : (
            <Chip className={classes.chipHidden}></Chip>
          )}
          {Array.isArray(state[2].regions) && state[2].regions.length ? (
            <Chip
              label={`${state[2].scientific_name} - ${state[2].common_name}`}
              onDelete={() => handleRemoveChip(2)}
              variant="outlined"
              className={`${classes.chipOutline2} ${classes.chip}`}
              classes={{
                deleteIcon: classes.chipDelete,
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
              className={`${classes.chipOutline3} ${classes.chip}`}
              classes={{
                deleteIcon: classes.chipDelete,
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
