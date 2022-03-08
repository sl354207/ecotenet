import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MapTag from "../components/MapTag";

import {
  Container,
  Typography,
  InputBase,
  CircularProgress,
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
      console.log(data);
      setResults(data);
    }
  };

  const handleSubmit = async (event, newValue) => {
    const dash = newValue.indexOf("-");
    const name = newValue.slice(0, dash - 1);
    console.log(name);
    for (const result of results) {
      if (result.Scientific_Name == name) {
        setQuery(result);
        setClickInfo(...clickInfo, result.unique_id);
      }
    }
    console.log(query);
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
      <MapTag clickInfo={clickInfo} setClickInfo={setClickInfo} />
    </Container>
  );
};

export default species;
