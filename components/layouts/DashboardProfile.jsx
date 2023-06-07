import TextBox from "@components/inputFields/TextBox";
import {
  alpha,
  Autocomplete,
  Button,
  Chip,
  createFilterOptions,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import theme from "@utils/theme";
import URISanity from "urisanity";

const DashboardProfile = ({
  user,
  results,
  profile,
  setProfile,
  handleProfileSubmit,
  handleProfileChange,
  handleRemoveChip,
  handleOpenDialog,
  error,
  setError,
}) => {
  // set filter for autocomplete options
  const filter = createFilterOptions();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Public Profile: optional
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          disabled={
            results.bio === profile.bio &&
            results.website === profile.website &&
            results.socials === profile.socials
          }
          onClick={() => handleProfileSubmit()}
        >
          Save Changes
        </Button>
      </div>

      <Typography variant="body1" gutterBottom>
        Approved: {results.approved}
      </Typography>
      <FormControl
        sx={{
          display: "flex",
          flexGrow: 1,
          margin: "10px 0 10px 0",
        }}
        error={error.bio}
      >
        <InputLabel htmlFor="bio" shrink>
          <b>Bio:</b>
        </InputLabel>

        <TextBox
          defaultValue={results.bio}
          placeHolder="Tell us about yourself..."
          id="bio"
          autoFocus={false}
          handleChange={handleProfileChange}
          multiline={true}
          inputProps={{ type: "text", maxLength: 5000 }}
          error={error.bio}
        />
        <FormHelperText sx={{ color: theme.palette.text.primary }}>
          {error.bio ? "Inappropriate language" : <></>}
        </FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          display: "flex",
          flexGrow: 1,
          margin: "10px 0 10px 0",
        }}
        error={error.website}
      >
        <InputLabel htmlFor="website" shrink>
          <b>Personal Website:</b>
        </InputLabel>

        <TextBox
          defaultValue={results.website}
          placeHolder="Share your personal website (example.com)"
          id="website"
          autoFocus={false}
          handleChange={handleProfileChange}
          multiline={false}
          inputProps={{ type: "url", maxLength: 100 }}
          error={error.website}
        />
        <FormHelperText sx={{ color: theme.palette.text.primary }}>
          {error.website ? "Invalid URL" : <></>}
        </FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          display: "flex",
          flexGrow: 1,
          margin: "10px 0 10px 0",
        }}
        error={error.socials}
      >
        <InputLabel htmlFor="socials" shrink>
          <b>Socials:</b>
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
          disabled={
            profile.socials && profile.socials.length > 2 ? true : false
          }
          disableClearable={true}
          value={[]}
          onChange={(event, newValue) => {
            if (
              URISanity.vet(newValue.inputValue, {
                allowWebTransportURI: true,
              }) === "about:blank"
            ) {
              setError({
                bio: error.bio,
                website: error.website,
                socials: true,
                comment: error.comment,
              });
            } else {
              setError({
                bio: error.bio,
                website: error.website,
                socials: false,
                comment: error.comment,
              });
              setProfile((profile) => ({
                ...profile,
                socials: [...profile.socials, newValue.inputValue],
              }));
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
          id="socials-auto"
          name="socials"
          options={[]}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          getOptionLabel={(option) => option.title || ""}
          freeSolo
          filterSelectedOptions={false}
          renderInput={(params) => {
            // ...params is causing error
            // console.log(params);
            return (
              <>
                <TextField
                  {...params}
                  id="socials"
                  placeholder="example.com"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={error.socials}
                  ref={params.InputProps.ref}
                  inputProps={{
                    ...params.inputProps,
                    type: "url",
                    maxLength: 100,
                  }}
                />
              </>
            );
          }}
        />
        <FormHelperText sx={{ color: theme.palette.text.primary }}>
          {error.socials ? "Invalid URL" : "Add social media links (3 max)"}
        </FormHelperText>
      </FormControl>
      <div>
        {profile.socials &&
          profile.socials.map((social) => (
            <Chip
              label={social}
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
              onDelete={() => handleRemoveChip(profile.socials, social)}
              key={social}
            ></Chip>
          ))}
      </div>
      <Typography variant="h5" gutterBottom sx={{ marginTop: "40px" }}>
        Private Settings:
      </Typography>
      <Button
        variant="outlined"
        color="error"
        disabled={
          user.name === null || user.name === "" || user.name === undefined
        }
        onClick={() => handleOpenDialog("delete", "Person", user)}
      >
        Delete Account
      </Button>
      {/* <div style={{ display: "flex" }}>
                <FormControl
                  sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
                  
                >
                  <InputLabel htmlFor="email" >Email:</InputLabel>
                  
                  <TextBox
                    defaultValue={results.email}
                    placeHolder="email@site.com"
                    id="email"
                    autoFocus={false}
                    handleChange={handleEmailChange}
                    rows={1}
                    multiline={false}
                    inputProps={{ type: "email" }}
                    
                  />

                  
                </FormControl>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginLeft: 2,
                    marginTop: "32px",
                    marginBottom: "10px",
                  }}
                  onClick={() => handleEmailUpdate()}
                  disabled={
                    email === "" || email === user.email || email === undefined
                  }
                >
                  Update Email
                </Button>
              </div>  */}
    </>
  );
};

export default DashboardProfile;
