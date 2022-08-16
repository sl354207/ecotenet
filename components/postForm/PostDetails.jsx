import Description from "@components/Description";
import Header from "@components/Header";
import Link from "@components/Link";
import TextBox from "@components/TextBox";
import CategoriesAutoComplete from "@data/categories_autocomplete.json";
import InfoIcon from "@mui/icons-material/Info";
import {
  Autocomplete,
  Chip,
  ClickAwayListener,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createFilterOptions } from "@mui/material/useAutocomplete";
import theme from "@utils/theme";
import { useState } from "react";

//pass in and destructure props.
const PostDetails = ({
  handleDetailChange,
  details: { title, description, category, tags },
  setDetails,
  handleRemoveChip,
}) => {
  const categorySub = CategoriesAutoComplete.filter(
    (autoCategory) => autoCategory["query"] === category
  )[0];
  // console.log(categorySub);
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  // set filter for autocomplete options
  const filter = createFilterOptions();

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
        <Grid item xs={12} sm={6}>
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
            required
          >
            <InputLabel htmlFor="title">Title:</InputLabel>
            <TextBox
              defaultValue={title || ""}
              placeHolder=" title of post(max length 60 characters)"
              id="title"
              name="title"
              handleChange={handleDetailChange}
              rows={1}
              inputProps={{ maxLength: 60 }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
          >
            <InputLabel htmlFor="description">Description:</InputLabel>
            <TextBox
              defaultValue={description || ""}
              placeHolder=" short summary of post(max length 160 characters) "
              id="description"
              name="description"
              handleChange={handleDetailChange}
              rows={2}
              inputProps={{ maxLength: 160 }}
            />
            <FormHelperText sx={{ color: theme.palette.text.primary }}>
              Helps with search functionality
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
            required
          >
            <InputLabel htmlFor="category">Category:</InputLabel>

            <Autocomplete
              sx={{
                position: "relative",
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                borderRadius: "4px",
                backgroundColor: theme.palette.primary.main,
                "&:focus-within": {
                  backgroundColor: theme.palette.primary.main,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
                  borderRadius: "4px",
                },

                width: "auto",
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
              id="category"
              name="category"
              onChange={(event, newValue) => {
                setDetails((details) => ({
                  ...details,
                  category: newValue && newValue.query,
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
                // console.log(option);
                if (option && option.sub) {
                  return option.sub;
                } else {
                  return "";
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select category"
                  variant="outlined"
                  sx={{
                    color: theme.palette.text.primary,
                    border: `1px solid ${alpha(
                      theme.palette.secondary.main,
                      0.5
                    )}`,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          0.5
                        )}`,
                        border: "none",
                      },
                      "& .Mui-focused fieldset": {
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          0.5
                        )}`,
                      },
                    },
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                />
              )}
            />
          </FormControl>

          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={
                <>
                  <Typography color="inherit">
                    If you need help deciding check out our explantion for each{" "}
                    <Link href="/category" color="secondary" underline="hover">
                      category
                    </Link>
                  </Typography>
                </>
              }
              arrow
            >
              <IconButton edge="start" size="small" onClick={handleTooltipOpen}>
                <InfoIcon fontSize="small"></InfoIcon>
              </IconButton>
            </Tooltip>
          </ClickAwayListener>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            sx={{ display: "flex", flexGrow: 1, marginBottom: "12px" }}
          >
            <InputLabel htmlFor="keywords">Keywords:</InputLabel>
            <Autocomplete
              sx={{
                position: "relative",
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                borderRadius: "4px",
                backgroundColor: theme.palette.primary.main,
                "&:focus-within": {
                  backgroundColor: theme.palette.primary.main,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
                  borderRadius: "4px",
                },

                width: "auto",
              }}
              autoHighlight
              disabled={tags.length > 2 ? true : false}
              disableClearable={true}
              value={tags}
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
              id="tags"
              name="tags"
              options={[]}
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
              freeSolo
              filterSelectedOptions={false}
              renderInput={(params) => (
                <InputBase
                  {...params}
                  placeholder="Add keywords"
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "18px 9px 17px 9px",
                    },
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                />
              )}
            />
            <FormHelperText sx={{ color: theme.palette.text.primary }}>
              Helps with search functionality (3 max)
            </FormHelperText>
          </FormControl>
          <div>
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
              ></Chip>
            ))}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostDetails;
