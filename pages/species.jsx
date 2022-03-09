import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useEffect, useReducer } from "react";
import dynamic from "next/dynamic";
import MapTag from "../components/MapTag";

import {
  Container,
  Typography,
  InputBase,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

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
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

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
  {
    id: 4,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 5,
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
        speciesChips[1].open = false;
        speciesChips[1].regions = [];
        speciesChips[0].count -= 1;
        break;
      case 2:
        speciesChips[2].open = false;
        speciesChips[2].regions = [];
        speciesChips[0].count -= 1;
        break;
      case 3:
        speciesChips[3].open = false;
        speciesChips[3].regions = [];
        speciesChips[0].count -= 1;
        break;
      case 4:
        speciesChips[4].open = false;
        speciesChips[4].regions = [];
        speciesChips[0].count -= 1;
        break;
      case 5:
        speciesChips[5].open = false;
        speciesChips[5].regions = [];
        // speciesChips[0].count += 1
        break;
      default:
        throw new Error();
    }
    // return speciesChips.map((chip) => {
    //   if (chip.id == action.payload) {
    //     chip.open = false;
    //     chip.regions = [];
    //   }
    //   return chip;
    // });
  }
  if (action.type == "add") {
    console.log(speciesChips);
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

      case 4:
        speciesChips[4].open = true;
        speciesChips[4].regions = action.value;
        speciesChips[4].scientific_name = action.s_name;
        speciesChips[4].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 5:
        speciesChips[5].open = true;
        speciesChips[5].regions = action.value;
        speciesChips[5].scientific_name = action.s_name;
        speciesChips[5].common_name = action.c_name;
        return { ...speciesChips };
      // speciesChips[0].count += 1

      default:
        throw new Error();
    }
    // return speciesChips.map((chip) => {
    //   if (chip.id == action.payload) {
    //     chip.open = true;
    //     chip.region = action.value
    //   }
    //   return chip;
    // });
  }
  // else {
  // POTENTIALLY ADD ERROR MESSAGE
  //   return menuItems;
  // }
};

const species = () => {
  // need to dynamically import to work with mapbox
  //   const MapTag = dynamic(() => import("../components/MapTag"), {
  //     loading: () => "Loading...",
  //     ssr: false,
  //   });
  // console.log(dog);
  const classes = useStyles();
  const theme = useTheme();

  // set filter for autocomplete options
  //   const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  // set tag state
  // const [tagValue, setTagValue] = useState([]);

  // set id to id in url query
  const router = useRouter();

  const [query, setQuery] = useState();
  const [results, setResults] = useState([]);
  const [clickInfo, setClickInfo] = useState([]);
  const [speciesInfo1, setSpeciesInfo1] = useState([]);
  const [speciesInfo2, setSpeciesInfo2] = useState([]);

  //   const queryFilter = router.query.s;

  //   const { data: results } = useSWR(
  //     `/api/search/autoSpecies?q=${query}`,
  //     fetcher
  //   );

  //   console.log(results);

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

  const handleSubmit = async (event, newValue) => {
    const dash = newValue.indexOf("-");
    const name = newValue.slice(0, dash - 1);
    // console.log(name);
    for (const result of results) {
      if (result.Scientific_Name == name) {
        setQuery(result);
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
          case 3:
            dispatch({
              type: "add",
              payload: 4,
              value: result.unique_id,
              s_name: result.Scientific_Name,
              c_name: result.COMMON_NAME,
            });
            break;
          case 4:
            dispatch({
              type: "add",
              payload: 5,
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
  };

  return (
    <Container>
      <Autocomplete
        className={classes.search}
        classes={{ paper: classes.popper }}
        autoHighlight
        disableClearable={true}
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
          <InputBase
            {...params}
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            onChange={(e) => handleChange(e)}
          />
        )}
      />

      <Typography variant="h3" align="center" className={classes.header}>
        Search Results
      </Typography>

      {query && <>{query.COMMON_NAME}</>}
      {Array.isArray(state[1].regions) && state[1].regions.length ? (
        <Chip
          label={state[1].scientific_name}
          // onDelete={() => handleRemoveChip(tag)}
        ></Chip>
      ) : (
        <></>
      )}
      {Array.isArray(state[2].regions) && state[2].regions.length ? (
        <Chip
          label={state[2].scientific_name}
          // onDelete={() => handleRemoveChip(tag)}
        ></Chip>
      ) : (
        <></>
      )}
      {Array.isArray(state[3].regions) && state[3].regions.length ? (
        <Chip
          label={state[3].scientific_name}
          // onDelete={() => handleRemoveChip(tag)}
        ></Chip>
      ) : (
        <></>
      )}
      {Array.isArray(state[4].regions) && state[4].regions.length ? (
        <Chip
          label={state[4].scientific_name}
          // onDelete={() => handleRemoveChip(tag)}
        ></Chip>
      ) : (
        <></>
      )}
      {Array.isArray(state[5].regions) && state[5].regions.length ? (
        <Chip
          label={state[5].scientific_name}
          // onDelete={() => handleRemoveChip(tag)}
        ></Chip>
      ) : (
        <></>
      )}
      {/* {state.map((chip) => {
        const { open, id, regions } = chip;

        return (
          <List component="nav" aria-labelledby="nested-list" key="mainlist">
            <ListItem
              button
              key={id}
              // onClick={() => handleListClick(menuTitle)}
            >
              <ListItemText>
                {open ? regions.map((region) => region) : <></>}
              </ListItemText>
            </ListItem>
          </List>
        );
      })} */}
      <MapTag
        clickInfo={clickInfo}
        setClickInfo={setClickInfo}
        speciesInfo1={speciesInfo1}
      />
    </Container>
  );
};

export default species;
