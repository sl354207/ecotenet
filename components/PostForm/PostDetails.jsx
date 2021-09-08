import React, { Fragment, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Container, Grid } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import MapTag from "../MapTag";

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
  // need to dynamically import to work with mapbox
  const Map = dynamic(() => import("../MapTag"), {
    loading: () => "Loading...",
    ssr: false,
  });

  // set filter for autocomplete options
  const filter = createFilterOptions();

  // const [clickInfo, setClickInfo] = useState([]);
  // const handleMapClick = useCallback((event) => {
  //   const region = event.features && event.features[0];
  // console.log(clickInfo);

  //   setClickInfo((clickInfo) => {
  //     if (!clickInfo.includes(region && region.properties.ECO_NAME)) {
  //       return [...clickInfo, region && region.properties.ECO_NAME];
  //     } else {
  //       const removed = clickInfo.splice(
  //         clickInfo.indexOf(region.properties.ECO_NAME),
  //         1
  //       );
  //       // console.log(removed);
  //       // console.log(clickInfo);
  //       return clickInfo;
  //     }
  //   });
  //   // console.log(clickInfo);
  // }, []);
  // console.log(handleMapClick);

  // const clickedRegions = clickInfo;
  // console.log(clickedRegions);

  // const clickFilter = useMemo(
  //   () => ["in", "ECO_NAME", ...clickedRegions],

  //   [clickedRegions]
  // );
  // const clickFilter = ["in", "ECO_NAME", ...clickedRegions];
  // console.log(clickInfo);

  // check MUI docs and examples for component prop explanations. Need to change some ids and props.
  return (
    <Container>
      <Grid container spacing={2} noValidate>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            placeholder=" title of post(max length 60 characters)"
            margin="normal"
            value={title || ""}
            onChange={handleDetailChange}
            inputProps={{ maxLength: 60 }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Author"
            name="author"
            placeholder="author name"
            margin="normal"
            value={author || ""}
            onChange={handleDetailChange}
            inputProps={{ maxLength: 60 }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            placeholder=" short summary of post(max length 160 characters) "
            value={description || ""}
            onChange={handleDetailChange}
            margin="normal"
            inputProps={{ maxLength: 160 }}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id="combo-box-demo"
            name="category"
            autoHighlight
            onChange={(event, categoryValue) => {
              setCategoryValue(categoryValue);
            }}
            value={categoryValue}
            onInputChange={(event, categoryInputValue) => {
              setCategoryInputValue(categoryInputValue);
            }}
            inputValue={categoryInputValue}
            options={categoryOptions}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Category" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
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
            style={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Free solo with text demo"
                variant="outlined"
              />
            )}
          />
          {tagValue.map((tag) => (
            <div>
              <Chip label={tag} onDelete={() => handleRemoveChip(tag)}></Chip>
            </div>
          ))}
        </Grid>
      </Grid>
      <MapTag clickInfo={clickInfo} setClickInfo={setClickInfo} />

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
