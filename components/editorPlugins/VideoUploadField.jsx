import {
  Autocomplete,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import theme from "@utils/theme";
import { useState } from "react";
import { connectField } from "uniforms";

function VideoUploadField({ onChange, value }) {
  //   console.log(value);
  const filter = createFilterOptions();

  const [url, setUrl] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const handleVideoUrl = async (e, newValue) => {
    if (newValue === null) {
      onChange("");
      setUrl(undefined);
    }
    if (newValue && newValue !== null) {
      //   console.log(newValue.inputValue);
      //   onChange(newValue.inputValue);
      const videoUrl = newValue.inputValue;
      //   if (!validVideoPluginURL(videoUrl)) {
      //   } else {
      try {
        onChange(videoUrl);
        setUrl(videoUrl);
      } catch (error) {
        console.log(error);
      }
      //   }
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <Autocomplete
        value={value || ""}
        disabled={loading}
        onChange={handleVideoUrl}
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
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField
            sx={{
              display: "flex",
              flexGrow: 1,
              marginBottom: "5px",
              marginRight: "5px",
              width: "300px",
              [theme.breakpoints.down("md")]: {
                width: "250px",
                display: "flex",
                marginBottom: "5px",
                marginRight: "5px",
              },
              [theme.breakpoints.down("sm")]: {
                width: "150px",
                display: "flex",
                marginBottom: "5px",
                marginRight: "5px",
              },
            }}
            {...params}
            placeholder="https://youtube.com/123"
            //   label="Existing video URL"
            name="url"
            id="url"
            variant="standard"
            ref={params.InputProps.ref}
            inputProps={{
              ...params.inputProps,
              type: "url",
              maxLength: 300,
            }}
          />
        )}
      />
      <Typography>tEst</Typography>
    </div>
  );
}

export default connectField(VideoUploadField);
