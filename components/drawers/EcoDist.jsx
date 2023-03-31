import {
  alpha,
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "@utils/theme";

const CustomChip = styled((props) => <Chip {...props} />)(({ theme }) => ({
  borderWidth: 2,
  color: theme.palette.text.primary,
  height: 60,
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
  "& .MuiChip-label": {
    width: "100%",
  },
}));

const EcoDist = ({
  dist,
  setDist,
  distributionState,
  distributionDispatch,
  isMobile,
}) => {
  const handleChange = async (e) => {
    if (e.target.value) {
      const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
      if (!regex.test(e.target.value)) {
        const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();

          setDist(data);
        }
      }
    }
  };

  const handleSubmit = (event, newValue) => {
    if (newValue !== null) {
      const dash = newValue.indexOf("-");
      const name = newValue.slice(0, dash - 1);
      for (const result of dist) {
        if (result.scientific_name === name) {
          switch (distributionState[0].count) {
            case 0:
              distributionDispatch({
                type: "add",
                payload: 1,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
                _id: result._id,
              });
              break;
            case 1:
              distributionDispatch({
                type: "add",
                payload: 2,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
                _id: result._id,
              });
              break;
            case 2:
              distributionDispatch({
                type: "add",
                payload: 3,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
                _id: result._id,
              });
              break;

            default:
            //   throw new Error();
          }
        }
      }

      setDist([]);
    }
  };

  const handleRemoveChip = (id) => {
    distributionDispatch({
      type: "remove",
      payload: id,
      value: [],
      s_name: "",
      c_name: "",
      _id: "",
    });
  };
  return (
    <>
      {!isMobile && (
        <Typography
          variant="h4"
          align="center"
          sx={{ marginBottom: "15px", paddingTop: 3 }}
        >
          Species Map
        </Typography>
      )}

      <Typography variant="body1" align="left">
        Search for a species by common or scientific name to display their
        distribution on the map. A maximum of three species can be mapped at the
        same time
      </Typography>
      <FormControl sx={{ display: "flex" }}>
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
          onChange={(event, newValue) => handleSubmit(event, newValue)}
          selectOnFocus
          clearOnBlur
          blurOnSelect
          handleHomeEndKeys
          id="dist-auto"
          fullWidth
          options={
            dist
              ? dist.map((obj) => {
                  if (obj.common_name) {
                    return `${obj.scientific_name} - ${obj.common_name}`;
                  } else {
                    return `${obj.scientific_name}`;
                  }
                })
              : []
          }
          filterOptions={(x) => x}
          freeSolo
          renderInput={(params) => (
            // ...params is causing error check dashboard index on how to log params
            <TextField
              {...params}
              id="dist"
              autoFocus={!isMobile}
              placeholder="Search…"
              variant="outlined"
              fullWidth
              ref={params.InputProps.ref}
              inputProps={{
                ...params.inputProps,
                type: "text",
                maxLength: 100,
              }}
              onChange={(e) => handleChange(e)}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        {isMobile ? (
          <FormHelperText
            sx={{ color: theme.palette.text.primary, marginBottom: "5px" }}
          >
            {""}
          </FormHelperText>
        ) : (
          <FormHelperText
            sx={{ color: theme.palette.text.primary, marginBottom: "5px" }}
          >
            (Filter drawer must be closed to search)
          </FormHelperText>
        )}
      </FormControl>

      <div style={{ display: "inline-grid", width: "100%" }}>
        {Array.isArray(distributionState[1].regions) &&
        distributionState[1].regions.length ? (
          <CustomChip
            label={
              distributionState[1].scientific_name ? (
                <>
                  <Typography>
                    {distributionState[1].scientific_name}
                  </Typography>
                  <Typography>{distributionState[1].common_name}</Typography>
                </>
              ) : (
                "post"
              )
            }
            onClick={() => {
              distributionState[1].scientific_name
                ? window.open(
                    `/species/${distributionState[1]._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                : window.open(
                    `/posts/${distributionState[1]._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
            }}
            onDelete={() => handleRemoveChip(1)}
            variant="outlined"
            sx={{
              borderColor: "#ff00ff",
            }}
          ></CustomChip>
        ) : (
          <CustomChip sx={{ visibility: "hidden" }}></CustomChip>
        )}
        {Array.isArray(distributionState[2].regions) &&
        distributionState[2].regions.length ? (
          <CustomChip
            label={
              distributionState[2].scientific_name ? (
                <>
                  <Typography>
                    {distributionState[2].scientific_name}
                  </Typography>
                  <Typography>{distributionState[2].common_name}</Typography>
                </>
              ) : (
                "post"
              )
            }
            onClick={() => {
              distributionState[2].scientific_name
                ? window.open(
                    `/species/${distributionState[2]._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                : window.open(
                    `/posts/${distributionState[2]._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
            }}
            onDelete={() => handleRemoveChip(2)}
            variant="outlined"
            sx={{
              borderColor: "#ffff00",
            }}
          ></CustomChip>
        ) : (
          <></>
        )}
        {Array.isArray(distributionState[3].regions) &&
        distributionState[3].regions.length ? (
          <CustomChip
            label={
              distributionState[3].scientific_name ? (
                <>
                  <Typography>
                    {distributionState[3].scientific_name}
                  </Typography>
                  <Typography>{distributionState[3].common_name}</Typography>
                </>
              ) : (
                "post"
              )
            }
            onClick={() => {
              distributionState[3].scientific_name
                ? window.open(
                    `/species/${distributionState[3]._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                : window.open(
                    `/posts/${distributionState[3]._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
            }}
            onDelete={() => handleRemoveChip(3)}
            variant="outlined"
            sx={{
              borderColor: "#00ffff",
            }}
          ></CustomChip>
        ) : (
          <></>
        )}
      </div>

      <Typography variant="subtitle2" align="left" sx={{ marginTop: "10px" }}>
        *A species distribution often does not align perfectly with ecoregion
        boundaries, therefore a species may not be present throughout the entire
        ecoregion but only in specific areas. A species may also be widespread
        but in small numbers so rarely seen.
      </Typography>
    </>
  );
};

export default EcoDist;
