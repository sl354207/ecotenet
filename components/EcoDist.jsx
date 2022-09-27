import {
  alpha,
  Autocomplete,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import theme from "@utils/theme";
import Description from "./Description";
import Header from "./Header";

const EcoDist = ({
  dist,
  setDist,

  state,
  dispatch,
}) => {
  const handleChange = async (e) => {
    // console.log(e);
    if (e.target.value) {
      const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setDist(data);
    }
  };

  const handleSubmit = (event, newValue) => {
    if (newValue != null) {
      const dash = newValue.indexOf("-");
      const name = newValue.slice(0, dash - 1);
      for (const result of dist) {
        if (result.scientific_name == name) {
          switch (state[0].count) {
            case 0:
              dispatch({
                type: "add",
                payload: 1,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
              });
              break;
            case 1:
              dispatch({
                type: "add",
                payload: 2,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
              });
              break;
            case 2:
              dispatch({
                type: "add",
                payload: 3,
                value: result.unique_id,
                s_name: result.scientific_name,
                c_name: result.common_name,
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
    dispatch({
      type: "remove",
      payload: id,
      value: [],
      s_name: "",
      c_name: "",
    });
  };
  return (
    <>
      <Header title="Species Map" />

      <Description
        description=" Search for a species by common or scientific name to display their
  distribution on the map. A maximum of three species can be mapped at the
  same time"
        align="left"
      />
      <Autocomplete
        sx={{
          position: "relative",
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
          borderRadius: "4px",
          backgroundColor: theme.palette.primary.light,
          "&:focus-within": {
            backgroundColor: theme.palette.primary.light,
            border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
            borderRadius: "4px",
          },
          marginTop: 4,
          marginBottom: 1,

          width: "auto",
        }}
        autoHighlight
        onChange={(event, newValue) => handleSubmit(event, newValue)}
        selectOnFocus
        clearOnBlur
        blurOnSelect
        handleHomeEndKeys
        id="species-map-auto"
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
          <TextField
            {...params}
            placeholder="Search…"
            variant="outlined"
            sx={{
              color: theme.palette.text.primary,
              borderRadius: "4px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: `1px solid ${alpha(
                    theme.palette.secondary.main,
                    0.5
                  )}`,
                  borderRadius: "4px",
                },
                "&:hover fieldset": {
                  border: `1px solid ${alpha(
                    theme.palette.secondary.main,
                    0.5
                  )}`,
                  borderRadius: "4px",
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${alpha(
                    theme.palette.secondary.main,
                    0.5
                  )}`,
                  borderRadius: "4px",
                },
              },
            }}
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            onChange={(e) => handleChange(e)}
          />
        )}
      />

      <div style={{ display: "inline-grid" }}>
        {Array.isArray(state[1].regions) && state[1].regions.length ? (
          <Chip
            label={
              state[1].scientific_name
                ? `${state[1].scientific_name} - ${state[1].common_name}`
                : "post"
            }
            onDelete={() => handleRemoveChip(1)}
            variant="outlined"
            sx={{
              borderWidth: 2,
              color: theme.palette.text.primary,
              height: 40,
              margin: "0px 5px 10px 5px",
              borderColor: "#ff00ff",

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
          ></Chip>
        ) : (
          <Chip sx={{ visibility: "hidden" }}></Chip>
        )}
        {Array.isArray(state[2].regions) && state[2].regions.length ? (
          <Chip
            label={
              state[2].scientific_name
                ? `${state[2].scientific_name} - ${state[2].common_name}`
                : "post"
            }
            onDelete={() => handleRemoveChip(2)}
            variant="outlined"
            sx={{
              borderWidth: 2,
              color: theme.palette.text.primary,
              height: 40,
              margin: "0px 5px 10px 5px",
              borderColor: "#ffff00",

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
          ></Chip>
        ) : (
          <></>
        )}
        {Array.isArray(state[3].regions) && state[3].regions.length ? (
          <Chip
            label={
              state[3].scientific_name
                ? `${state[3].scientific_name} - ${state[3].common_name}`
                : "post"
            }
            onDelete={() => handleRemoveChip(3)}
            variant="outlined"
            sx={{
              borderWidth: 2,
              color: theme.palette.text.primary,
              height: 40,
              margin: "0px 5px 10px 5px",
              borderColor: "#00ffff",

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
          ></Chip>
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
