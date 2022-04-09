import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostList from "../components/PostList";
import SpeciesList from "../components/SpeciesList";

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

const search = ({ ecoFilter }) => {
  // console.log(dog);
  const classes = useStyles();
  const theme = useTheme();

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  // set id to id in url query
  const router = useRouter();

  const query = router.query.q;
  const queryFilter = router.query.s;

  const { data: results } = useSWR(
    `/api/search/${queryFilter}?q=${query}`,
    fetcher
  );
  // console.log(results);

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        className={classes.progress}
      />
    );
  } else if (Array.isArray(results) && results.length == 0) {
    list = (
      <Typography variant="h3" align="center" className={classes.header}>
        no results
      </Typography>
    );
  } else if (results && results.length > 0 && results[0].title !== undefined) {
    list = <PostList posts={results} />;
  } else {
    list = <SpeciesList results={results} />;
  }

  return (
    <Container>
      <Autocomplete
        className={classes.search}
        classes={{ paper: classes.popper }}
        autoHighlight
        disableClearable={true}
        onChange={(event, newValue) => {
          router.push(`/search?q=${newValue.inputValue}&s=${newValue.path}`);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (!ecoFilter) {
            if (params.inputValue !== "") {
              filtered.push(
                {
                  inputValue: params.inputValue,
                  title: `"${params.inputValue}" in all posts`,
                  path: "allPosts",
                },
                {
                  inputValue: params.inputValue,
                  title: `"${params.inputValue}" in all species`,
                  path: "allSpecies",
                }
              );
            }
          } else {
            if (params.inputValue !== "") {
              filtered.push(
                {
                  inputValue: params.inputValue,
                  title: `"${params.inputValue}" in ecoregion posts`,
                  path: "ecoPosts",
                },
                {
                  inputValue: params.inputValue,
                  title: `"${params.inputValue}" in ecoregion species`,
                  path: "ecoSpecies",
                },
                {
                  inputValue: params.inputValue,
                  title: `"${params.inputValue}" in all posts`,
                  path: "allPosts",
                },
                {
                  inputValue: params.inputValue,
                  title: `"${params.inputValue}" in all species`,
                  path: "allSpecies",
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
        renderOption={(option) => option.title}
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
          />
        )}
      />

      <Typography variant="h4" align="center" className={classes.header}>
        Search Results
      </Typography>

      {list}
    </Container>
  );
};

export default search;
