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
  CircularProgress,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Link,
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
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
  },
  buttonspecies: {
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
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  card: {
    // display: "flex",
    flex: "auto",
    marginRight: 20,
    // display: "block",
    // border: "1px solid #94c9ff",
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

  const query = router.query.q;
  const queryFilter = router.query.s;

  const { data: results } = useSWR(
    `/api/search/${queryFilter}?q=${query}`,
    fetcher
  );

  // loading state until draft is retrieved
  if (!results || results == undefined) {
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
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "allPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
                    path: "allSpecies",
                  }
                );
              }
            } else {
              if (params.inputValue !== "") {
                filtered.push(
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion posts`,
                    path: "ecoPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion species`,
                    path: "ecoSpecies",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "allPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
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
        <CircularProgress
          color="secondary"
          size={100}
          disableShrink={true}
          className={classes.progress}
        />
      </Container>
    );
  }
  // console.log(results[0].title);
  if (results && results[0].title !== undefined) {
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
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "allPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
                    path: "allSpecies",
                  }
                );
              }
            } else {
              if (params.inputValue !== "") {
                filtered.push(
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion posts`,
                    path: "ecoPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion species`,
                    path: "ecoSpecies",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "allPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
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
                  className={classes.buttonpost}
                  onClick={() => {
                    router.push("/mammal");
                  }}
                >
                  <div className={classes.card}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      color="textPrimary"
                      align="left"
                    >
                      {result.title}
                    </Typography>
                    <Typography gutterBottom color="textPrimary" align="left">
                      {result.description}
                    </Typography>
                    <Typography gutterBottom color="secondary" align="left">
                      {result.author}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h6" color="secondary" align="right">
                      {result.count}
                    </Typography>
                  </div>
                </Button>
              </ListItem>
            );
          })}
        </List>
      </Container>
    );
  } else {
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
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "allPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
                    path: "allSpecies",
                  }
                );
              }
            } else {
              if (params.inputValue !== "") {
                filtered.push(
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion posts`,
                    path: "ecoPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in ecoregion species`,
                    path: "ecoSpecies",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all posts`,
                    path: "allPosts",
                  },
                  {
                    inputValue: params.inputValue,
                    title: `Search for "${params.inputValue}" in all species`,
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
                  className={classes.buttonspecies}
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
