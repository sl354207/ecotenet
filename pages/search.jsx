import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";

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
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
      // border: "1px solid #94c9ff!important",
    },
    marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },
  searchText: {
    "&:hover": {
      // border: "1px solid #94c9ff",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    // width: "100%",
    // [theme.breakpoints.up("xs")]: {
    width: "0ch",
    "&:focus": {
      width: "20ch",
    },
    // },
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const search = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  // set tag state
  const [tagValue, setTagValue] = useState([]);

  // set id to id in url query
  const router = useRouter();
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
        <Typography variant="h3" align="center" className={classes.header}>
          Search Results
        </Typography>
        <Autocomplete
          className={classes.search}
          autoHighlight
          disableClearable={true}
          // value={tagValue}
          // onChange={(event, newValue) => {
          //   if (typeof newValue === "string") {
          //     () => {
          //       setTagValue(newValue);
          //     };
          //   } else if (newValue && newValue.inputValue) {
          //     // Create a new value from the user input
          //     setTagValue((tagValue) => [...tagValue, newValue.inputValue]);
          //   } else {
          //     setTagValue(newValue);
          //   }
          // }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== "") {
              filtered.push(
                {
                  inputValue: params.inputValue,
                  title: `Search for "${params.inputValue}" in all posts`,
                },
                {
                  inputValue: params.inputValue,
                  title: `Search for "${params.inputValue}" in all species`,
                }
              );
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
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.title;
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
        {/* {query} */}
      </Container>
      // <Container>
      // <Typography variant="h3" align="center" className={classes.header}>
      //   Mammals
      // </Typography>
      //   {/* <AppBar component="div" position="sticky" className={classes.subheader}>
      //   {uniqueFirst.map((item) => (
      //     <>
      //       {isMobile ? (
      //         <Button
      //           key={item}
      //           onClick={() => handleClick(item, -260)}
      //           className={classes.sublist}
      //           variant="outlined"
      //           color="secondary"
      //         >
      //           <Typography variant="h4" align="center">
      //             {item}
      //           </Typography>
      //         </Button>
      //       ) : (
      //         <Button
      //           key={item}
      //           onClick={() => handleClick(item, -140)}
      //           className={classes.sublist}
      //           variant="outlined"
      //           color="secondary"
      //         >
      //           <Typography variant="h4" align="center">
      //             {item}
      //           </Typography>
      //         </Button>
      //       )}
      //     </>
      //   ))}
      // </AppBar>
      // <Toolbar /> */}
      //   <List>
      //     {uniqueFirst.map((entry) => {
      //       return (
      //         <>
      //           <ListItem key={entry} ref={refs[entry]}>
      //             <ListItemText>
      //               <Typography variant="h5" color="secondary">
      //                 {entry}
      //               </Typography>
      //             </ListItemText>
      //           </ListItem>
      //           {mammals.map((mammal) => {
      //             if (mammal.Scientific_Name[0] === entry) {
      //               return (
      // <ListItem key={mammal._id}>
      //   <Button
      //     variant="outlined"
      //     color="secondary"
      //     fullWidth
      //     className={classes.buttonlist}
      //     onClick={() => {
      //       router.push("/mammal");
      //     }}
      //   >
      //     {isMobile ? (
      //       <>
      //         <Typography
      //           variant="h6"
      //           color="textPrimary"
      //           align="left"
      //         >
      //           <i>{mammal.Scientific_Name} -</i>
      //         </Typography>
      //         <Typography
      //           variant="h6"
      //           color="textPrimary"
      //           align="left"
      //         >
      //           {mammal.COMMON_NAME}
      //         </Typography>
      //       </>
      //     ) : (
      //       <Typography
      //         variant="h6"
      //         color="textPrimary"
      //         align="left"
      //       >
      //         <i>{mammal.Scientific_Name} -</i>{" "}
      //         {mammal.COMMON_NAME}
      //       </Typography>
      //     )}
      //   </Button>
      // </ListItem>
      //               );
      //             }
      //           })}
      //           <Divider />
      //         </>
      //       );
      //     })}
      //   </List>
      // </Container>
    );
  }
};

export default search;
