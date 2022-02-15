import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import {
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Container,
  Button,
  Typography,
  Divider,
  useMediaQuery,
  TextField,
  InputBase,
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
  buttonlist: {
    display: "block",
    justifyContent: "start",
    textTransform: "none",
  },
  search: {
    position: "relative",
    border: "2px solid #94c9ff",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.light,

    // "&:hover": {
    //   backgroundColor: alpha(theme.palette.primary.light, 0.25),
    //   // border: "1px solid #94c9ff!important",
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
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const search = ({ ecoFilter }) => {
  // console.log(dog);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  // set tag state
  // const [tagValue, setTagValue] = useState([]);

  // set id to id in url query
  const router = useRouter();

  // category filter logic. Revisit
  // const [ecoFilter, setEcoFilter] = useState("");

  // // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  // useEffect(() => {
  //   let ecoregion = sessionStorage.getItem("ecoregion");

  //   if (router.pathname == "/mammals") {
  //     sessionStorage.setItem("ecoregion", router.pathname);
  //     setEcoFilter(router.pathname);
  //   } else {
  //     setEcoFilter(ecoregion);
  //   }
  // }, [router.pathname]);
  //   capture search query and filter parameters
  const query = router.query.q;
  const queryFilter = router.query.s;

  //   store database search results from an immediately invoked function expression(braces around anonymous function followed by immediate functIon call)
  const results = ((search) => {
    //   Use switch statement to return correct data based on query and filter. Wrap switch statement in function call to store return value.
    switch (search) {
      case "all-posts":
        //   must use different names for swr data in each case
        const { data } = useSWR(`/api/search/allPosts?q=${query}`, fetcher);
        const filter = "post";

        return data;

        // return allPosts;

        break;
      case "eco-posts":
        const { data: ecoPosts } = useSWR(
          `/api/search/ecoPosts?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "posts",
        //   data: ecoPosts,
        // };
        // console.log(ecoPosts);
        return ecoPosts;

        break;
      case "all-species":
        const { data: allSpecies } = useSWR(
          `/api/search/allSpecies?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "species",
        //   data: allSpecies,
        // };
        return allSpecies;

        break;
      case "eco-species":
        const { data: ecoSpecies } = useSWR(
          `/api/search/ecoSpecies?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "species",
        //   data: ecoSpecies,
        // };
        return ecoSpecies;

        break;
      // default:
      //   console.log(`Sorry, we are out of ${search}.`);
    }
  })(queryFilter);

  //   const _id = router.query._id;
  //   // capture url path to pass to form
  //   const pathName = router.pathname;

  //   // retrieve drafts from drafts api. convert swr data to name posts.
  //   const { data: post } = useSWR(`/api/getdrafts/${_id}`, fetcher);

  // loading state until draft is retrieved
  if (!results || results == undefined) return "Loading...";
  // console.log(results[0].title);
  if (results && results[0].title !== undefined) {
    return (
      <div>
        <ul>
          {results.map((result) => {
            return (
              <li>
                {result.title}
                {result.count}
              </li>
            );
          })}
        </ul>
        {query}
      </div>
    );
  } else {
    return (
      <Container>
        <Autocomplete
          className={classes.search}
          classes={{ paper: classes.popper }}
          autoHighlight
          disableClearable={true}
          // value={tagValue}

          onChange={(event, newValue) => {
            // if (typeof newValue === "string") {
            //   setTagValue(newValue);
            // }
            // if (newValue && newValue.inputValue) {
            //   // Create a new value from the user input
            //   setTagValue((tagValue) => [...tagValue, newValue.inputValue]);
            // }
            // else {
            // setTagValue(newValue);
            // console.log(newValue);
            router.push(`/search?q=${newValue.inputValue}&s=${newValue.path}`);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            // console.log(params);
            // console.log(ecoFilter);
            if (!ecoFilter) {
              if (params.inputValue !== "") {
                filtered.push(
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "all-posts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
                    path: "all-species",
                  }
                );
              }
            } else {
              if (params.inputValue !== "") {
                filtered.push(
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion posts`,
                    path: "eco-posts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion species`,
                    path: "eco-species",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "all-posts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
                    path: "all-species",
                  }
                );
              }
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={tags}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option.inputValue;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.inputValue;
          }}
          renderOption={(option) => option.title}
          // style={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            // <TextField
            //   {...params}
            //   className={classes.searchText}
            //   // label="Free solo with text demo"
            //   variant="standard"
            //   color="secondary"
            // />
            <InputBase
              {...params}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              // inputProps={{ "aria-label": "search" }}
              // onFocus={() => setSearchValue("")}
              // onChange={handleSearchClick}
              // value={searchValue}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}

              // autoFocus
            />
          )}
        />

        <Typography variant="h3" align="center" className={classes.header}>
          Search Results
        </Typography>

        <List>
          {results.map((result) => {
            return (
              <ListItem key={result._id}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  className={classes.buttonlist}
                  onClick={() => {
                    router.push("/mammal");
                  }}
                >
                  {isMobile ? (
                    <>
                      <Typography variant="h6" color="textPrimary" align="left">
                        <i>{result.Scientific_Name} -</i>
                      </Typography>
                      <Typography variant="h6" color="textPrimary" align="left">
                        {result.COMMON_NAME}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6" color="textPrimary" align="left">
                      <i>{result.Scientific_Name} -</i> {result.COMMON_NAME}
                    </Typography>
                  )}
                </Button>
              </ListItem>
            );
          })}
        </List>
      </Container>
    );
  }
};

export default search;
