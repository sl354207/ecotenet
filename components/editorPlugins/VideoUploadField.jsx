import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import theme from "@utils/theme";
import { validVideoPluginURL } from "@utils/validationHelpers";
import { useState } from "react";
import { connectField } from "uniforms";

function VideoUploadField({ onChange, value }) {
  //   console.log(value);
  const filter = createFilterOptions();

  const [url, setUrl] = useState();

  const [error, setError] = useState();

  const handleVideoUrl = async (e, newValue) => {
    if (newValue === null) {
      onChange("");
      setUrl(undefined);
      setError(false);
    }
    if (newValue && newValue !== null) {
      const videoUrl = newValue.inputValue;
      if (!validVideoPluginURL(videoUrl)) {
        setError(true);
      } else {
        onChange(videoUrl);
        setUrl(videoUrl);
        setError(false);
      }
    }
  };
  return (
    <>
      <FormControl
        sx={{ marginTop: "5px", display: "flex", marginInline: "10px" }}
        error={error}
      >
        <InputLabel shrink htmlFor="video-url"></InputLabel>
        <Autocomplete
          value={value || ""}
          // disabled={loading}
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
              }}
              {...params}
              placeholder="https://youtube.com/123"
              //   label="Existing video URL"
              error={error}
              name="video-url"
              id="video-url"
              type="url"
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

        <FormHelperText
          sx={{
            color: theme.palette.text.primary,
            marginLeft: "0px",
            fontSize: "medium",
          }}
        >
          {error
            ? "Invalid Video URL"
            : "Supported Platforms: Youtube, Vimeo, Dailymotion, Facebook, Twitch"}
        </FormHelperText>
      </FormControl>
      <Typography></Typography>
    </>
  );
}

export default connectField(VideoUploadField);
