import { useState } from "react";

import {
  ClickAwayListener,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  Link,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import { Autocomplete, createFilterOptions } from "@material-ui/lab";

import TextBox from "../TextBox";

import { alpha, makeStyles } from "@material-ui/core/styles";

import CategoriesAutoComplete from "../../data/categories_autocomplete.json";
import Header from "../Header";
import Description from "../Description";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    "&:focus-within": {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    marginTop: 6,
    marginBottom: 10,
    width: "auto",
  },
  root: {
    color: theme.palette.text.primary,
  },
  input: {
    padding: 18,
  },
  select: {
    color: theme.palette.text.primary,
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
    },
  },
  popper: {
    backgroundColor: theme.palette.primary.light,
  },
  form: {
    display: "flex",
    flexGrow: 1,
    marginBottom: 12,
  },
  label: {
    color: `${theme.palette.text.primary}!important`,
    position: "relative",
    transform: "none",
  },
  delete: {
    WebkitTapHighlightColor: "transparent",
    color: theme.palette.secondary.main,
    height: 22,
    width: 22,
    cursor: "pointer",
    margin: "0 5px 0 -6px",
    "&:hover": {
      color: alpha(theme.palette.secondary.main, 0.7),
    },
  },
  chip: {
    borderColor: theme.palette.secondary.main,
    borderWidth: 2,
    color: theme.palette.text.primary,
    height: 40,
    margin: "0px 5px 10px 5px",
  },
  groupLabel: {
    backgroundColor: theme.palette.primary.light,
    color: alpha(theme.palette.text.primary, 0.6),
  },
  noOptions: {
    color: alpha(theme.palette.text.primary, 0.6),
  },
  helper: {
    color: theme.palette.text.primary,
  },
  required: {
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 20,
  },
}));

//pass in and destructure props.
const PostDetails = ({
  handleDetailChange,
  details: { title, description, category, tags },
  setDetails,
  handleRemoveChip,
}) => {
  const classes = useStyles();

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
      <Typography variant="body1" align="left" className={classes.required}>
        *denotes required field
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.form} required>
            <InputLabel
              htmlFor="title"
              classes={{
                root: classes.label,
                formControl: classes.label,
                focused: classes.label,
              }}
            >
              Title:
            </InputLabel>
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
          <FormControl className={classes.form}>
            <InputLabel
              htmlFor="description"
              classes={{
                root: classes.label,
                formControl: classes.label,
                focused: classes.label,
              }}
            >
              Description:
            </InputLabel>
            <TextBox
              defaultValue={description || ""}
              placeHolder=" short summary of post(max length 160 characters) "
              id="description"
              name="description"
              handleChange={handleDetailChange}
              rows={2}
              inputProps={{ maxLength: 160 }}
            />
            <FormHelperText className={classes.helper}>
              Helps with search functionality
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.form} required>
            <InputLabel
              htmlFor="category"
              classes={{
                root: classes.label,
                formControl: classes.label,
                focused: classes.label,
              }}
            >
              Category:
            </InputLabel>

            <Autocomplete
              className={classes.search}
              classes={{
                paper: classes.popper,
                groupLabel: classes.groupLabel,
                noOptions: classes.noOptions,
              }}
              autoHighlight
              id="category"
              name="category"
              onChange={(event, newValue) => {
                setDetails((details) => ({
                  ...details,
                  category: newValue,
                }));
              }}
              defaultValue={category || ""}
              value={category}
              options={CategoriesAutoComplete}
              groupBy={(option) => option.title}
              getOptionLabel={(option) => option.sub}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select category"
                  variant="outlined"
                  classes={{
                    root: classes.select,
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
              interactive
              title={
                <>
                  <Typography color="inherit">
                    If you need help deciding check out our explantion for each{" "}
                    <Link href="/category" color="secondary">
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
          <FormControl className={classes.form}>
            <InputLabel
              htmlFor="keywords"
              classes={{
                root: classes.label,
                formControl: classes.label,
                focused: classes.label,
              }}
            >
              Keywords:
            </InputLabel>
            <Autocomplete
              className={classes.search}
              classes={{ paper: classes.popper }}
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
              renderOption={(option) => option.title}
              freeSolo
              filterSelectedOptions={false}
              renderInput={(params) => (
                <InputBase
                  {...params}
                  placeholder="Add keywords"
                  classes={{
                    root: classes.root,
                    input: classes.input,
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                />
              )}
            />
            <FormHelperText className={classes.helper}>
              Helps with search functionality (3 max)
            </FormHelperText>
          </FormControl>
          <div>
            {tags.map((tag) => (
              <Chip
                label={tag}
                variant="outlined"
                className={classes.chip}
                classes={{
                  deleteIcon: classes.delete,
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
