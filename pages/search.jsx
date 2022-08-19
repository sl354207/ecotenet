import Footer from "@components/Footer";
import Header from "@components/Header";
import PostList from "@components/PostList";
import SpeciesList from "@components/SpeciesList";
import {
  Autocomplete,
  CircularProgress,
  Container,
  InputBase,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createFilterOptions } from "@mui/material/useAutocomplete";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const search = ({ ecoFilter }) => {
  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  // set id to id in url query
  const router = useRouter();

  const query = router.query.q;
  const queryFilter = router.query.filter;

  const { data: results } = useSWR(
    query
      ? `/api/search?q=${query}&filter=${queryFilter}&eco=${ecoFilter}`
      : null,
    fetcher
  );

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{
          margin: "100px auto",
          display: "flex",
          justifySelf: "center",
        }}
      />
    );
  } else if (Array.isArray(results) && results.length == 0) {
    list = (
      <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
        no results
      </Typography>
    );
  } else if (results && results.length > 0 && results[0].title !== undefined) {
    list = <PostList posts={results} />;
  } else {
    list = <SpeciesList results={results} />;
  }

  return (
    <>
      <Container>
        <Header title="Search Results" />
        <Autocomplete
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
            marginLeft: theme.spacing(1),
            width: "auto",
          }}
          autoHighlight
          disableClearable={true}
          onChange={(event, newValue) => {
            router.push(
              `/search?q=${newValue.inputValue}&filter=${newValue.path}`
            );
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
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            // if (typeof option === "string") {
            //   return option;
            // }
            // // Add "xxx" option created dynamically
            // if (option.inputValue) {
            //   return option.inputValue;
            // }
            // Regular option
            return "";
          }}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          freeSolo
          renderInput={(params) => (
            <InputBase
              {...params}
              placeholder="Search…"
              sx={{
                "& .MuiInputBase-input": {
                  padding: theme.spacing(2, 2, 2, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(2)})`,
                },
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
            />
          )}
        />

        {list}
      </Container>
      <Footer />
    </>
  );
};

export default search;
