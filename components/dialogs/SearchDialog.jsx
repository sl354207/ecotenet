import PostList from "@components/layouts/PostList";
import SpeciesList from "@components/layouts/SpeciesList";
import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Autocomplete,
  Button,
  CircularProgress,
  createFilterOptions,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const CustomPopper = function (props) {
  return (
    <Popper
      {...props}
      style={{ maxWidth: "900px", width: "calc(100% - 64px)" }}
      placement="bottom"
    />
  );
};

const SearchDialog = ({ search, setSearch, ecoFilter, layer, setLayer }) => {
  const [query, setQuery] = useState();
  const [autoError, setAutoError] = useState(false);
  const { mutate } = useSWRConfig();

  const handleCloseSearch = () => {
    setSearch(false);
    setQuery(undefined);
  };
  const {
    data: results,
    isLoading,
    error,
  } = useSWR(
    query
      ? `/api/search?q=${query.q}&filter=${query.filter}&eco=${
          ecoFilter && ecoFilter._id
        }`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  let list;

  if (isLoading) {
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
  } else {
    if (error) {
      list = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              mutate(
                `/api/search?q=${query.q}&filter=${query.filter}&eco=${
                  ecoFilter && ecoFilter._id
                }`
              )
            }
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(results) && results.length === 0) {
        list = (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        );
      } else if (
        results &&
        results.length > 0 &&
        results[0].title !== undefined
      ) {
        list = (
          <PostList
            posts={results}
            search={true}
            handleClose={handleCloseSearch}
          />
        );
      } else {
        list = (
          <SpeciesList results={results} handleClose={handleCloseSearch} />
        );
      }
    }
  }

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];
  return (
    <Dialog
      open={search}
      onClose={handleCloseSearch}
      fullWidth
      maxWidth="md"
      scroll="paper"
      disableScrollLock
      sx={{
        "&.MuiModal-root": {
          top: "30px",
          bottom:
            !query ||
            (Array.isArray(results) && results.length === 0) ||
            !results ||
            (Array.isArray(results) && results.length < 2)
              ? "auto"
              : 0,
        },
        "&.MuiDialog-root": {
          top: "30px",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <DialogTitle
          color="textPrimary"
          align="center"
          sx={{ paddingBottom: "0px", position: "fixed" }}
          variant="h5"
        >
          Search
        </DialogTitle>
        <IconButton
          sx={{ marginLeft: "auto" }}
          color="secondary"
          onClick={handleCloseSearch}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Divider
        variant="middle"
        sx={{
          color: theme.palette.secondary.main,
        }}
      />
      <DialogContent>
        <FormControl
          sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
          error={autoError}
        >
          <InputLabel htmlFor="search" shrink></InputLabel>
          <Autocomplete
            sx={{
              "& .MuiAutocomplete-inputRoot": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha("#94c9ff", 0.8),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha("#94c9ff", 0.8),
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#94c9ff",
                },
                "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha("#94c9ff", 0.3),
                },
                "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha("#94c9ff", 0.3),
                },
                "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e57373",
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e57373",
                },
              },
            }}
            autoHighlight
            disableClearable
            onChange={(event, newValue) => {
              const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
              if (!regex.test(newValue.inputValue)) {
                setAutoError(false);
                setQuery({ q: newValue.inputValue, filter: newValue.path });
              } else {
                setAutoError(true);
                setQuery(undefined);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              if (layer === "ecoregions") {
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
              } else {
                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    title: `"${params.inputValue}" in all species`,
                    path: "allSpecies",
                  });
                }
              }

              return filtered;
            }}
            selectOnFocus
            blurOnSelect
            handleHomeEndKeys
            id="search-auto"
            options={tags}
            getOptionLabel={(option) => {
              return "";
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.title}>
                {option.title}
              </li>
            )}
            freeSolo
            PopperComponent={CustomPopper}
            ListboxProps={{
              sx: {
                minHeight: ecoFilter ? "220px" : "auto",
                "& .MuiAutocomplete-option": {
                  minHeight: "48px",
                },
              },
            }}
            renderInput={(params) => (
              // ...params is causing error check dashboard index on how to log params
              <TextField
                id="search"
                fullWidth
                {...params}
                autoFocus={true}
                placeholder="Search site for species, posts, or authors"
                variant="outlined"
                ref={params.InputProps.ref}
                inputProps={{
                  ...params.inputProps,
                  type: "text",
                  maxLength: 100,
                }}
                InputLabelProps={{ shrink: true }}
                error={autoError}
              />
            )}
          />
          <FormHelperText
            sx={{ color: theme.palette.text.primary, fontSize: 16 }}
            id="component-error-text"
          >
            {autoError ? "Invalid Search Input" : " "}
          </FormHelperText>
        </FormControl>
        {layer && layer !== "ecoregions" && (
          <>
            <Typography align="center" variant="body2">
              *Currently it is not possible to search for posts or authors in
              the Freshwater Ecoregions layer, only species.
            </Typography>
            <Typography align="center" variant="body2">
              If you would like to search for posts or authors please switch to
              the Ecoregions layer.
            </Typography>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginTop: "20px" }}
                onClick={() => setLayer("ecoregions")}
              >
                switch to Ecoregions layer
              </Button>
            </div>
          </>
        )}

        {query && <>{list}</>}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
