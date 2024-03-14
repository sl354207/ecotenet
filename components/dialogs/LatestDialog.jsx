import PostList from "@components/layouts/PostList";
import ecoregions from "@data/eco_coord.json";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 10;

const autoOptions = ecoregions
  .map((ecoregion) => {
    const eco = {
      name: ecoregion.name,
      id: ecoregion.unique_id,
    };

    return eco;
  })
  .sort(function (a, b) {
    return a.id - b.id;
  });

const LatestDialog = ({ latest, setLatest }) => {
  const [radio, setRadio] = useState("All Posts");
  const [ecoregion, setEcoregion] = useState();
  const { data, error, mutate, size, setSize, isLoading } = useSWRInfinite(
    radio === "All Posts" || (radio === "Eco-ID" && ecoregion)
      ? (index) => `/api/latest?page=${index + 1}&id=${ecoregion}`
      : null,
    fetcher,
    { revalidateFirstPage: false, shouldRetryOnError: false }
  );

  const posts = data ? [].concat(...data) : [];

  const isEmpty = data && data?.[size - 1]?.length === 0;

  const underPageSize = data && data?.[size - 1]?.length < PAGE_SIZE;

  const isReachingEnd = isEmpty || underPageSize;

  const [autoValue, setAutoValue] = useState();

  const handleRadioChange = (event) => {
    setRadio(event.target.value);
    setAutoValue();

    if (event.target.value === "All Posts") {
      setEcoregion();
    }
  };

  const handleCloseDialog = () => {
    setLatest(false);
  };

  let list;

  if (error) {
    list = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button variant="outlined" color="error" onClick={() => mutate()}>
          Error Loading. Retry
        </Button>
      </div>
    );
  } else {
    list = (
      <>
        {data && posts.length > 0 ? (
          <PostList
            posts={data && posts}
            handleClose={handleCloseDialog}
            search={true}
          />
        ) : (
          <div style={{ height: `calc(100vh - 328px)` }}>
            {ecoregion && posts.length === 0 && (
              // <div
              //   style={{
              //     display: "flex",
              //     justifyContent: "center",
              //     marginTop: "20px",
              //   }}
              // >
              <Typography
                variant="h6"
                align="center"
                sx={{ paddingTop: "20px" }}
              >
                No posts found
              </Typography>
              // </div>
            )}
          </div>
        )}
        <Button
          disabled={
            isLoading || isReachingEnd || (!ecoregion && radio === "Eco-ID")
          }
          onClick={() => {
            setSize(size + 1);
          }}
          variant="outlined"
          color="secondary"
          sx={{ display: "block", margin: "auto" }}
        >
          {isLoading
            ? "loading..."
            : isReachingEnd
            ? "no more posts"
            : "load more"}
        </Button>
      </>
    );
  }

  return (
    <Dialog
      open={latest}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="md"
      scroll="paper"
      disableScrollLock
      sx={{
        "&.MuiModal-root": {
          top: "30px",
          bottom: 0,
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
        }}
      >
        <DialogTitle
          color="textPrimary"
          align="center"
          sx={{ paddingBottom: "0px", position: "fixed" }}
          variant="h5"
        >
          Latest Posts
        </DialogTitle>

        <IconButton
          sx={{ marginLeft: "auto" }}
          color="secondary"
          onClick={handleCloseDialog}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Divider
        variant="middle"
        sx={{
          marginTop: "16px",
          color: theme.palette.secondary.main,
        }}
      />

      <DialogContent>
        <FormControl sx={{ display: "flex", justifyContent: "center" }}>
          <FormLabel id="radio-buttons-group-label"></FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue="All Posts"
            row
            value={radio}
            onChange={handleRadioChange}
            name="radio-buttons-group"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <FormControlLabel
              value="All Posts"
              control={
                <Radio
                  color="secondary"
                  sx={{
                    color: `${theme.palette.secondary.main}!important`,
                  }}
                />
              }
              label="All Posts"
            />
            <FormControlLabel
              value="Eco-ID"
              control={
                <Radio
                  color="secondary"
                  sx={{
                    color: `${theme.palette.secondary.main}!important`,
                  }}
                />
              }
              label="Eco-ID"
            />
          </RadioGroup>
        </FormControl>
        <FormControl sx={{ display: "flex", flexGrow: 1 }}>
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
            ListboxProps={{
              sx: {
                "& .MuiAutocomplete-groupLabel": {
                  backgroundColor: theme.palette.primary.light,
                  color: alpha(theme.palette.text.primary, 0.6),
                  fontSize: 16,
                },
                "& .MuiAutocomplete-groupUl": {
                  backgroundColor: theme.palette.primary.light,
                },
                "& .MuiAutocomplete-paper": {
                  backgroundColor: theme.palette.primary.light,
                  color: alpha(theme.palette.text.primary, 0.6),
                },
              },
            }}
            autoHighlight
            disabled={radio === "All Posts"}
            id="eco-auto"
            name="eco"
            onChange={(event, newValue) => {
              if (newValue && newValue !== null && newValue !== "") {
                setEcoregion(newValue.id);
                setAutoValue(newValue);
              } else {
                setEcoregion();
                setAutoValue();
              }
            }}
            value={autoValue || ""}
            options={autoOptions}
            noOptionsText={
              <Typography
                sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
              >
                no options
              </Typography>
            }
            getOptionLabel={(option) => {
              if (option) {
                return `Eco-${option.id}: ${option.name}`;
              } else {
                return "";
              }
            }}
            renderInput={(params) => (
              // ...params is causing error check dashboard index on how to log params
              <TextField
                {...params}
                id="eco"
                placeholder="Select Ecoregion"
                variant="outlined"
                ref={params.InputProps.ref}
                inputProps={{
                  ...params.inputProps,
                  type: "text",
                  maxLength: 100,
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </FormControl>
        {list}
      </DialogContent>
    </Dialog>
  );
};

export default LatestDialog;
