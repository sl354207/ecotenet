import React, { Fragment, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Container,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  NativeSelect,
  Select,
} from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import MapEditor from "../MapEditor";
import TextBox from "../TextBox";

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
    backgroundColor: theme.palette.primary.main,

    "&:focus-within": {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    // marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginTop: 6,
    marginBottom: 10,
    // marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },
  inputRoot: {
    color: theme.palette.text.primary,
  },
  inputInput: {
    padding: 18,
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em)`,
    // transition: theme.transitions.create("width"),
    // width: "100%",
    // [theme.breakpoints.up("xs")]: {
    //   width: "0ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },
  select: {
    color: theme.palette.text.primary,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        // border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
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
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  items: {
    display: "flex",
    flexGrow: 1,
  },
  label: {
    color: `${theme.palette.text.primary}!important`,
    position: "relative",
    transform: "none",
  },
  chipDelete: {
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
    // fontSize: 16,
    height: 40,
    margin: "0px 5px 10px 5px",
  },
  form: {
    marginBottom: 12,
  },
}));

//pass in and destructure props.
const PostDetails = ({
  handleNext,
  handleBack,
  handleDetailChange,
  detailValues: { title, author, description },
  categoryOptions,
  categoryValue,
  setCategoryValue,
  categoryInputValue,
  setCategoryInputValue,
  tags,
  tagValue,
  setTagValue,
  handleRemoveChip,
  clickInfo,
  setClickInfo,
}) => {
  // // need to dynamically import to work with mapbox
  // const Map = dynamic(() => import("../MapTag"), {
  //   loading: () => "Loading...",
  //   ssr: false,
  // });

  const classes = useStyles();
  const theme = useTheme();

  // set filter for autocomplete options
  const filter = createFilterOptions();

  // check MUI docs and examples for component prop explanations. Need to change some ids and props.
  return (
    <Container>
      {/* <div className={classes.form}> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* <TextBox
            fullWidth
            label="Title"
            name="title"
            placeholder=" title of post(max length 60 characters)"
            margin="normal"
            value={title || ""}
            onChange={handleDetailChange}
            inputProps={{ maxLength: 60 }}
            required
            color="secondary"
          /> */}
          <FormControl className={classes.items}>
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
              // handleChange={handleChange}
              // handleSubmit={handleSubmit}
              rows={1}
              inputProps={{ maxLength: 60 }}
              // className={comment_ref != "" ? classes.cref : classes.noref}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.items}>
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
              // handleChange={handleChange}
              // handleSubmit={handleSubmit}
              rows={2}
              inputProps={{ maxLength: 160 }}
              // className={comment_ref != "" ? classes.cref : classes.noref}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.items}>
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
              classes={{ paper: classes.popper }}
              autoHighlight
              // disableClearable={true}
              id="category"
              name="category"
              onChange={(event, categoryValue) => {
                setCategoryValue(categoryValue);
              }}
              // defaultValue={categoryValue || ""}
              value={categoryValue}
              onInputChange={(event, categoryInputValue) => {
                setCategoryInputValue(categoryInputValue);
              }}
              inputValue={categoryInputValue}
              options={categoryOptions}
              getOptionLabel={(option) => option}
              // style={{ width: 300 }}
              renderInput={(params) => (
                // <TextField
                //   {...params}
                //   label="Category"
                //   variant="outlined"
                //   color="secondary"
                // />
                <TextField
                  {...params}
                  placeholder="Select category"
                  variant="outlined"
                  // select
                  classes={{
                    root: classes.select,
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  // defaultValue={categoryValue || ""}
                  // onChange={(e) => handleChange(e)}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.items}>
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
              disableClearable={true}
              value={tagValue}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  () => {
                    setTagValue(newValue);
                  };
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setTagValue((tagValue) => [...tagValue, newValue.inputValue]);
                } else {
                  setTagValue(newValue);
                }
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
              id="keywords"
              name="keywords"
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
                <InputBase
                  {...params}
                  placeholder="Add keywords"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                />
              )}
            />
          </FormControl>
          <div>
            {tagValue.map((tag) => (
              <Chip
                label={tag}
                variant="outlined"
                className={classes.chip}
                classes={{
                  deleteIcon: classes.chipDelete,
                }}
                onDelete={() => handleRemoveChip(tag)}
              ></Chip>
            ))}
          </div>
        </Grid>
      </Grid>
      {/* </div>
      <MapEditor clickInfo={clickInfo} setClickInfo={setClickInfo} /> */}

      <div
        style={{ display: "flex", marginTop: 50, justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="default"
          onClick={handleBack}
          style={{ marginRight: 10 }}
        >
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </Container>
  );
};

export default PostDetails;
