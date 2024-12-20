import {
  DragHandle,
  SortableItem,
  SortableList,
} from "@components/layouts/draggable";
import InfoIcon from "@mui/icons-material/Info";
import {
  Autocomplete,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Tooltip,
  Typography,
  alpha,
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
  ecoDistResults,
  setEcoDistResults,
  ecoChips,
  setEcoChips,
  isMobile,
  nativeToggleValue,
  setNativeToggleValue,
  layer,
}) => {
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

          setEcoDistResults(data);
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

      for (const result of ecoDistResults) {
        if (
          result.scientific_name === name &&
          !ecoChips.find(
            (item) => item.scientific_name === result.scientific_name
          )
        ) {
          result.id = result.scientific_name;
          result.native = false;

          setEcoChips([...ecoChips, result]);
        }
      }

      setNativeToggleValue("observed");

      setEcoDistResults([]);
    }
  };

  const handleRemoveChip = (ecoChip) => {
    setEcoChips((ecoChips) => ecoChips.filter((i) => i !== ecoChip));
  };

  const handleSelectCheckboxChange = (id) => {
    if (nativeToggleValue === "observed") {
      setEcoChips((prevState) =>
        prevState.map((item) =>
          item.scientific_name === id ? { ...item, native: true } : item
        )
      );
      setNativeToggleValue("native");
    } else {
      setEcoChips((prevState) =>
        prevState.map((item) =>
          item.scientific_name === id ? { ...item, native: false } : item
        )
      );
      setNativeToggleValue("observed");
    }
  };
  return (
    <>
      {!isMobile && (
        <Typography
          variant="h5"
          align="center"
          sx={{ marginBottom: "4px", marginTop: "10px", fontWeight: 500 }}
        >
          Species Map
        </Typography>
      )}

      <Typography variant="body1" align="left">
        Search for a species by common or scientific name to display their
        distribution on the map.
        {layer !== "dsmw" && (
          <Tooltip
            enterTouchDelay={100}
            leaveTouchDelay={5000}
            arrow
            title={
              <Typography color="inherit" variant="body1">
                A maximum of 3 species can be visualized on the map at the same
                time, but up to 5 species can be added and manipulated.
              </Typography>
            }
          >
            <InfoIcon
              fontSize="small"
              sx={{ marginLeft: "10px", marginBottom: "-5px" }}
            ></InfoIcon>
          </Tooltip>
        )}
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
          disabled={
            layer === "dsmw"
              ? ecoChips && ecoChips.length === 1
              : ecoChips && ecoChips.length === 5
          }
          onChange={(event, newValue) => handleSubmit(event, newValue)}
          selectOnFocus
          clearOnBlur
          blurOnSelect
          handleHomeEndKeys
          id="dist-auto"
          fullWidth
          options={
            ecoDistResults
              ? ecoDistResults.map((obj) => {
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
            (EcoFilter must be closed to search)
          </FormHelperText>
        )}
      </FormControl>
      {layer === "ecoregions" && ecoChips && ecoChips.length > 0 && (
        <>
          <Tooltip
            enterTouchDelay={100}
            leaveTouchDelay={5000}
            arrow
            title={
              <>
                <Typography color="inherit" variant="h6">
                  Toggle between Native and Observed ranges for a particular
                  species. Checkbox will be disabled if no native range is
                  available.
                </Typography>
              </>
            }
          >
            <InfoIcon
              fontSize="small"
              sx={{ marginTop: "-28px", marginLeft: { xs: "98%", md: "100%" } }}
            ></InfoIcon>
          </Tooltip>
          <Typography
            sx={{
              marginTop: "-24px",
              marginLeft: { xs: "95%", sm: "96%", md: "95%" },
            }}
          >
            N
          </Typography>
        </>
      )}
      {layer === "dsmw" ? (
        <>
          {ecoChips && ecoChips.length > 0 ? (
            <CustomChip
              label={
                ecoChips && ecoChips[0] && ecoChips[0].title
                  ? ecoChips[0].title
                  : ecoChips[0].common_name
                  ? `${ecoChips[0].scientific_name} - ${ecoChips[0].common_name}`
                  : ecoChips[0].scientific_name
              }
              clickable={ecoChips[0].scientific_name ? true : false}
              onClick={() => {
                if (ecoChips[0].scientific_name) {
                  window.open(
                    `/species/${ecoChips[0].scientific_name.replace(
                      / /g,
                      "_"
                    )}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              onDelete={() => handleRemoveChip(ecoChips[0])}
              variant="outlined"
              sx={{
                borderColor: theme.palette.secondary.main,
                maxWidth: isMobile ? "86%" : "85%",
                display: "flex",
              }}
            ></CustomChip>
          ) : (
            <></>
          )}
        </>
      ) : (
        <SortableList
          items={ecoChips}
          onChange={setEcoChips}
          main={true}
          isMobile={isMobile}
          renderItem={(ecoChip) => (
            <SortableItem id={ecoChip.id}>
              <DragHandle />
              <CustomChip
                label={
                  ecoChip.title
                    ? ecoChip.title
                    : ecoChip.common_name
                    ? `${ecoChip.scientific_name} - ${ecoChip.common_name}`
                    : ecoChip.scientific_name
                }
                clickable={ecoChip.scientific_name ? true : false}
                onClick={() => {
                  if (ecoChip.scientific_name) {
                    window.open(
                      `/species/${ecoChip.scientific_name.replace(/ /g, "_")}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
                onDelete={() => handleRemoveChip(ecoChip)}
                variant="outlined"
                sx={{
                  borderColor:
                    ecoChips && ecoChips.indexOf(ecoChip) === 0
                      ? "#ff00ff"
                      : ecoChips && ecoChips.indexOf(ecoChip) === 1
                      ? "#ffff00"
                      : ecoChips && ecoChips.indexOf(ecoChip) === 2
                      ? "#00ffff"
                      : theme.palette.secondary.main,
                  maxWidth: isMobile ? "81%" : "80%",
                }}
              ></CustomChip>
              {layer === "ecoregions" && (
                <FormControlLabel
                  key={`select-${ecoChip.id}`}
                  sx={{
                    marginLeft: "auto",
                    marginRight: { xs: "-20px", sm: "-15px", md: "-25px" },
                  }}
                  control={
                    <Checkbox
                      sx={{
                        color: theme.palette.secondary.main,
                        "&.Mui-checked": {
                          color: theme.palette.secondary.main,
                        },
                      }}
                      checked={ecoChip.native}
                      onChange={() => handleSelectCheckboxChange(ecoChip.id)}
                      disabled={
                        (ecoChip &&
                          ecoChip.native_ecoregions &&
                          ecoChip.native_ecoregions.length === 0) ||
                        (ecoChip && !ecoChip.native_ecoregions)
                      }
                    />
                  }
                />
              )}
            </SortableItem>
          )}
        />
      )}

      <Tooltip
        enterTouchDelay={100}
        leaveTouchDelay={5000}
        arrow
        title={
          <>
            {layer === "feow" ||
              (layer === "dsmw" && (
                <>
                  <Typography
                    color="inherit"
                    variant="body1"
                    sx={{ marginBottom: "5px" }}
                  >
                    If no freshwater or soil ecoregions are available for a
                    species, no ecoregions will be highlighted and the map
                    won&apos;t pan to any ecoregions.
                  </Typography>
                  <Divider sx={{ marginBottom: "5px" }} />
                </>
              ))}

            <Typography color="inherit" variant="body1">
              A species distribution often does not align perfectly with
              ecoregion boundaries, therefore a species may not be present
              throughout the entire ecoregion but only in specific areas. A
              species may also be widespread but in small numbers so rarely
              seen.
            </Typography>
          </>
        }
      >
        <InfoIcon
          fontSize="medium"
          sx={{ marginBlock: "10px", marginLeft: { xs: "0px", md: "-24px" } }}
        ></InfoIcon>
      </Tooltip>
    </>
  );
};

export default EcoDist;
