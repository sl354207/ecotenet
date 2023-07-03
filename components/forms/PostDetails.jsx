import TextBox from "@components/inputFields/TextBox";
import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import CategoriesAutoComplete from "@data/categories_autocomplete.json";
import InfoIcon from "@mui/icons-material/Info";
import {
  Autocomplete,
  Box,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createFilterOptions } from "@mui/material/useAutocomplete";
import theme from "@utils/theme";
import { checkWebsite } from "@utils/validationHelpers";
import { useState } from "react";

//pass in and destructure props.
const PostDetails = ({
  handleDetailChange,
  details: { title, description, category, originalUrl, tags },
  setDetails,
  handleRemoveChip,
}) => {
  const categorySub = CategoriesAutoComplete.filter((autoCategory) => {
    if (category) {
      return (
        autoCategory["title"] === category["title"] &&
        autoCategory["sub"] === category["sub"]
      );
    }
  })[0];

  // set filter for autocomplete options
  const filter = createFilterOptions();

  const [error, setError] = useState(false);
  const [value, setValue] = useState(originalUrl);

  // check MUI docs and examples for component prop explanations. Need to change some ids and props.
  return (
    <Container>
      <Header title="Post Details" />

      <Description
        description="Choose a title and category for your post. To make it easier for people
        to find your post you may add a short description and keywords for your
        post"
        align="left"
      />
      <Typography
        variant="body1"
        align="left"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
      >
        *denotes required field
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} key="title-grid">
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
            required
          >
            <InputLabel htmlFor="title" shrink>
              Title:
            </InputLabel>
            <TextBox
              defaultValue={title || ""}
              placeHolder=" title of post(max length 100 characters)"
              id="title"
              name="title"
              handleChange={handleDetailChange}
              inputProps={{ type: "text", maxLength: 100 }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} key="description-grid">
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
          >
            <InputLabel htmlFor="description" shrink>
              Description:
            </InputLabel>
            <TextBox
              defaultValue={description || ""}
              placeHolder=" short summary of post(max length 160 characters) "
              id="description"
              name="description"
              handleChange={handleDetailChange}
              inputProps={{ type: "text", maxLength: 160 }}
            />
            <FormHelperText sx={{ color: theme.palette.text.primary }}>
              Helps with search functionality
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} key="category-grid">
          <FormControl sx={{ display: "flex", flexGrow: 1 }} required>
            <InputLabel htmlFor="category" shrink>
              Category:
            </InputLabel>

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
              id="category-auto"
              name="category"
              onChange={(event, newValue) => {
                // console.log(newValue);
                setDetails((details) => ({
                  ...details,
                  category: newValue && {
                    title: newValue.title,
                    sub: newValue["sub"],
                  },
                }));
              }}
              defaultValue={categorySub || ""}
              value={categorySub || ""}
              options={CategoriesAutoComplete}
              noOptionsText={
                <Typography
                  sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
                >
                  no options
                </Typography>
              }
              groupBy={(option) => option.title}
              getOptionLabel={(option) => {
                if (option && option["sub"]) {
                  return option["sub"];
                } else {
                  return "";
                }
              }}
              renderInput={(params) => (
                // ...params is causing error check dashboard index on how to log params
                <TextField
                  {...params}
                  id="category"
                  placeholder="Select category"
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

          <Tooltip
            enterTouchDelay={100}
            leaveTouchDelay={5000}
            arrow
            title={
              <>
                <Typography color="inherit" variant="h6">
                  If you need help deciding check out our explanation for each{" "}
                  <Link
                    href="/category"
                    color="secondary"
                    underline="hover"
                    sx={{ paddingRight: "100px" }}
                  >
                    category
                  </Link>
                </Typography>
              </>
            }
          >
            <IconButton edge="start" size="small">
              <InfoIcon fontSize="small"></InfoIcon>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} key="op-grid">
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
            error={error}
          >
            <InputLabel htmlFor="op" shrink>
              Originally Posted On:
            </InputLabel>
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
              value={value}
              onChange={(event, newValue) => {
                if (newValue) {
                  if (checkWebsite(newValue.inputValue)) {
                    setDetails((details) => ({
                      ...details,
                      originalUrl: newValue.inputValue,
                    }));
                    setValue(newValue.inputValue);
                    setError(false);
                  } else {
                    setError(true);
                  }
                } else {
                  setError(false);
                  setValue(newValue);
                  setDetails((details) => ({
                    ...details,
                    originalUrl: null,
                  }));
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    title: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              id="free-solo-dialog-demo"
              options={[]}
              getOptionLabel={(option) => {
                // e.g value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.title;
              }}
              autoHighlight
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="op"
                  placeholder="https://yourblog.com"
                  ref={params.InputProps.ref}
                  inputProps={{
                    ...params.inputProps,
                    type: "text",
                    maxLength: 100,
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={error}
                />
              )}
            />
            <FormHelperText
              sx={{
                color: theme.palette.text.primary,
                visibility: error ? "visible" : "hidden",
              }}
            >
              Invalid url
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} key="keywords-grid">
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
          >
            <InputLabel htmlFor="keywords" shrink>
              Keywords:
            </InputLabel>
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
              disabled={tags.length > 2 ? true : false}
              disableClearable={true}
              value={[]}
              onChange={(event, newValue) => {
                setDetails((details) => ({
                  ...details,
                  tags: [...tags, newValue.inputValue],
                }));
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Suggest the creation of a new value
                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    title: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="keywords-auto"
              name="tags"
              options={[]}
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
              getOptionLabel={(option) => option.title || ""}
              freeSolo
              filterSelectedOptions={false}
              renderInput={(params) => (
                // ...params is causing error check dashboard index on how to log params
                <TextField
                  {...params}
                  id="keywords"
                  placeholder="Add keywords"
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
            <FormHelperText sx={{ color: theme.palette.text.primary }}>
              Helps with search functionality (3 max)
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          key="tags-grid"
          sx={{
            "&.MuiGrid-item": {
              paddingTop: { xs: "0px", md: "16px" },
            },
          }}
        >
          <Box sx={{ marginTop: { xs: "0px", md: "32px" } }}>
            {tags.map((tag) => (
              <Chip
                label={tag}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.secondary.main,
                  borderWidth: 2,
                  color: theme.palette.text.primary,
                  height: 40,
                  margin: "0px 5px 10px 5px",
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
                onDelete={() => handleRemoveChip(tags, tag)}
                key={tag}
              ></Chip>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostDetails;
