import Header from "@components/layouts/Header";
import MapAdmin from "@components/maps/MapAdmin";
import {
  Autocomplete,
  Button,
  Chip,
  Container,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

const CustomChip = styled((props) => <Chip {...props} />)(({ theme }) => ({
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
}));

const adminSpecies = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);
  const [clickInfo, setClickInfo] = useState({});

  const handleChange = async (e) => {
    if (e.target.value) {
      const regex = /[`!@#$%^&*()_+=\[\]{};:"\\\|,.<>\/?~]/;
      if (!regex.test(e.target.value)) {
        const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();

          setResults(data);
        }
      }
    }
  };

  const handleSubmit = (event, newValue) => {
    if (newValue !== null) {
      let name;
      if (newValue.includes(" - ")) {
        const dash = newValue.indexOf(" - ");
        name = newValue.slice(0, dash);
      } else {
        name = newValue;
      }

      for (const result of results) {
        if (result.scientific_name === name) {
          console.log(result);
        }
      }
    }

    setResults([]);
  };

  const handleMapClick = useCallback((event) => {
    const region = event.features && event.features[0];

    if (region && region.properties.unique_id !== "<NA>") {
      setClickInfo((clickInfo) => {
        if (!clickInfo.includes(region && region.properties.unique_id)) {
          return [...clickInfo, region && region.properties.unique_id];
        } else {
          clickInfo.splice(clickInfo.indexOf(region.properties.unique_id), 1);

          return [...clickInfo];
        }
      });
    }
  }, []);

  const handleRemoveChip = (id) => {};

  return (
    <Container>
      <Header title="Species Update" />

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
        handleHomeEndKeys
        id="region-auto"
        options={
          results
            ? results.map((obj) => {
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
            id="region"
            placeholder="Search…"
            variant="outlined"
            ref={params.InputProps.ref}
            inputProps={{ ...params.inputProps, type: "text", maxLength: 100 }}
            onChange={(e) => handleChange(e)}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
      {isMobile ? (
        <div style={{ display: "inline-grid", marginTop: "5px" }}>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <CustomChip
              label={
                state[1].common_name
                  ? `${state[1].scientific_name} - ${state[1].common_name}`
                  : `${state[1].scientific_name}`
              }
              onClick={() => {
                window.open(
                  `/species/${state[1].scientific_name.replace(/ /g, "_")}`,
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
        </div>
      ) : (
        <div style={{ marginTop: "5px" }}>
          {Array.isArray(state[1].regions) && state[1].regions.length ? (
            <CustomChip
              label={
                state[1].common_name
                  ? `${state[1].scientific_name} - ${state[1].common_name}`
                  : `${state[1].scientific_name}`
              }
              onClick={() => {
                window.open(
                  `/species/${state[1].scientific_name.replace(/ /g, "_")}`,
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
            <Chip sx={{ visibility: "hidden" }}></Chip>
          )}
        </div>
      )}
      <Typography variant="h6" align="left">
        Ecoregions:* {clickInfo.map((region) => `Eco-${region}, `)}
      </Typography>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginRight: "5px", marginBottom: "10px" }}
        disabled={state[0].count === 0}
        onClick={() => {
          setClickInfo(
            state[1].regions.concat(state[2].regions, state[3].regions)
          );
        }}
      >
        Select All
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginRight: "5px", marginBottom: "10px" }}
        disabled={Array.isArray(clickInfo) && !clickInfo.length}
        onClick={() => setClickInfo([])}
      >
        Clear All
      </Button>

      <MapAdmin
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        state={state}
      />
      <Typography variant="subtitle2" align="left" sx={{ marginTop: "10px" }}>
        A species distribution often does not align perfectly with ecoregion
        boundaries, therefore a species may not be present throughout the entire
        ecoregion but only in specific areas. A species may also be widespread
        but in small numbers so rarely seen.
      </Typography>
    </Container>
  );
};

export default adminSpecies;
