import Description from "@components/Description";
import Footer from "@components/Footer";
import Header from "@components/Header";
import MapSpecies from "@components/maps/MapSpecies";
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
import { useReducer, useState } from "react";

// const SuccessAuto = styled(Autocomplete)(({ theme }) => ({
//   position: "relative",
//   border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: theme.palette.primary.light,
//   "&:focus-within": {
//     backgroundColor: theme.palette.primary.light,
//     border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
//     borderRadius: theme.shape.borderRadius,
//   },
//   marginTop: 20,
//   marginBottom: 20,
//   marginLeft: theme.spacing(1),
//   width: "auto",
//   "& .MuiAutocomplete-paper": {
//     marginTop: 4,
//     backgroundColor: theme.palette.primary.light,
//   },
// }));

const useStyles = makeStyles((theme) => ({
  // search: {
  //   position: "relative",
  //   border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
  //   borderRadius: theme.shape.borderRadius,
  //   backgroundColor: theme.palette.primary.light,
  //   "&:focus-within": {
  //     backgroundColor: theme.palette.primary.light,
  //     border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
  //     borderRadius: theme.shape.borderRadius,
  //   },
  //   marginTop: 20,
  //   marginBottom: 20,
  //   marginLeft: theme.spacing(1),
  //   width: "auto",
  // },
  // root: {
  //   color: theme.palette.text.primary,
  //   "& .MuiOutlinedInput-root": {
  //     "& fieldset": {
  //       border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
  //     },
  //     "&:hover fieldset": {
  //       border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
  //     },
  //     "&.Mui-focused fieldset": {
  //       border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
  //     },
  //   },
  // },
  // popper: {
  //   marginTop: 4,
  //   backgroundColor: theme.palette.primary.light,
  // },
  // delete: {
  //   WebkitTapHighlightColor: "transparent",
  //   color: theme.palette.secondary.main,
  //   height: 22,
  //   width: 22,
  //   cursor: "pointer",
  //   margin: "0 5px 0 -6px",
  //   "&:hover": {
  //     color: alpha(theme.palette.secondary.main, 0.7),
  //   },
  // },
  // chip: {
  //   borderWidth: 2,
  //   color: theme.palette.text.primary,
  //   height: 40,
  //   margin: "0px 5px 10px 5px",
  // },
  // hidden: {
  //   visibility: "hidden",
  // },
  // mobile: {
  //   display: "inline-grid",
  // },
  // outline1: {
  //   borderColor: "#ff00ff",
  // },
  // outline2: {
  //   borderColor: "#ffff00",
  // },
  // outline3: {
  //   borderColor: "#00ffff",
  // },
  // descriptionMargin: {
  //   marginLeft: 10,
  // },
  // note: {
  //   marginTop: 10,
  // },
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

const speciesMap = () => {
  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);
  const [clickInfo, setClickInfo] = useState([]);

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
    <>
      <Container>
        <Header title="Species Map" />

        <Description
          description=" Search for a species by common or scientific name to display their
        distribution on the map. A maximum of three species can be mapped at the
        same time"
          align="left"
          // className={classes.descriptionMargin}
        />
        <Autocomplete
          // className={classes.search}
          // classes={{ paper: classes.popper }}
          sx={{
            position: "relative",
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
            borderRadius: "4px",
            backgroundColor: theme.palette.primary.light,
            "&:focus-within": {
              backgroundColor: theme.palette.primary.light,
              border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
              borderRadius: "4px",
            },
            marginTop: 4,
            marginBottom: 1,
            // marginLeft: theme.spacing(1),
            width: "auto",
          }}
          autoHighlight
          onChange={(event, newValue) => handleSubmit(event, newValue)}
          selectOnFocus
          clearOnBlur
          blurOnSelect
          handleHomeEndKeys
          id="species-map-auto"
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
              // classes={{
              //   root: classes.root,
              // }}
              sx={{
                color: theme.palette.text.primary,
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: `1px solid ${alpha(
                      theme.palette.secondary.main,
                      0.5
                    )}`,
                    borderRadius: "4px",
                  },
                  "&:hover fieldset": {
                    border: `1px solid ${alpha(
                      theme.palette.secondary.main,
                      0.5
                    )}`,
                    borderRadius: "4px",
                  },
                  "&.Mui-focused fieldset": {
                    border: `1px solid ${alpha(
                      theme.palette.secondary.main,
                      0.5
                    )}`,
                    borderRadius: "4px",
                  },
                },
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              onChange={(e) => handleChange(e)}
            />
          )}
        />
        {isMobile ? (
          <div style={{ display: "inline-grid" }}>
            {Array.isArray(state[1].regions) && state[1].regions.length ? (
              <Chip
                label={`${state[1].scientific_name} - ${state[1].common_name}`}
                onDelete={() => handleRemoveChip(1)}
                variant="outlined"
                // className={`${classes.outline1} ${classes.chip}`}
                // classes={{
                //   deleteIcon: classes.delete,
                // }}
                sx={{
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
                  borderColor: "#ff00ff",

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
                }}
              ></Chip>
            ) : (
              <Chip
                // className={classes.hidden}
                sx={{ visibility: "hidden" }}
              ></Chip>
            )}
            {Array.isArray(state[2].regions) && state[2].regions.length ? (
              <Chip
                label={`${state[2].scientific_name} - ${state[2].common_name}`}
                onDelete={() => handleRemoveChip(2)}
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
                  borderColor: "#ffff00",

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
                sx={{
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
                  borderColor: "#00ffff",

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
                sx={{
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
                  borderColor: "#ff00ff",

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
                }}
              ></Chip>
            ) : (
              <Chip sx={{ visibility: "hidden" }}></Chip>
            )}
            {Array.isArray(state[2].regions) && state[2].regions.length ? (
              <Chip
                label={`${state[2].scientific_name} - ${state[2].common_name}`}
                onDelete={() => handleRemoveChip(2)}
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
                  borderColor: "#ffff00",

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
                sx={{
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
                  borderColor: "#00ffff",

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
                }}
              ></Chip>
            ) : (
              <></>
            )}
          </>
        )}

        <MapSpecies clickInfo={clickInfo} state={state} />
        <Typography
          variant="subtitle2"
          align="left"
          // className={classes.note}
          sx={{ marginTop: "10px" }}
        >
          *A species distribution often does not align perfectly with ecoregion
          boundaries, therefore a species may not be present throughout the
          entire ecoregion but only in specific areas. A species may also be
          widespread but in small numbers so rarely seen.
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default speciesMap;
