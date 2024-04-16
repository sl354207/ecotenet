import {
  DragHandle,
  SortableItem,
  SortableList,
} from "@components/layouts/draggable";
import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  TextField,
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
  distributionState,
  distributionDispatch,
  ecoChips,
  setEcoChips,
  isMobile,
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
        // if (result.scientific_name === name) {
        //   switch (distributionState[0].count) {
        //     case 0:
        //       distributionDispatch({
        //         type: "add",
        //         payload: 1,
        //         value: result.unique_id,
        //         s_name: result.scientific_name,
        //         c_name: result.common_name,
        //         _id: result._id,
        //       });
        //       break;
        //     case 1:
        //       distributionDispatch({
        //         type: "add",
        //         payload: 2,
        //         value: result.unique_id,
        //         s_name: result.scientific_name,
        //         c_name: result.common_name,
        //         _id: result._id,
        //       });
        //       break;
        //     case 2:
        //       distributionDispatch({
        //         type: "add",
        //         payload: 3,
        //         value: result.unique_id,
        //         s_name: result.scientific_name,
        //         c_name: result.common_name,
        //         _id: result._id,
        //       });
        //       break;

        //     default:
        //     //   throw new Error();
        //   }
        // }
        if (
          result.scientific_name === name &&
          !ecoChips.find(
            (item) => item.scientific_name === result.scientific_name
          )
        ) {
          result.id = result.scientific_name;

          setEcoChips([...ecoChips, result]);
        }
      }

      setEcoDistResults([]);
    }
  };

  const handleRemoveChip = (ecoChip) => {
    // distributionDispatch({
    //   type: "remove",
    //   payload: id,
    //   value: [],
    //   s_name: "",
    //   c_name: "",
    //   _id: "",
    // });
    setEcoChips((ecoChips) => ecoChips.filter((i) => i !== ecoChip));
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
        distribution on the map. A maximum of 3 species can be visualized on the
        map at the same time, but up to 6 species can be added and manipulated.
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
      <SortableList
        items={ecoChips}
        onChange={setEcoChips}
        main={true}
        renderItem={(ecoChip) => (
          <SortableItem id={ecoChip.id}>
            <DragHandle />
            <CustomChip
              label={
                ecoChip.common_name
                  ? `${ecoChip.scientific_name} - ${ecoChip.common_name}`
                  : ecoChip.scientific_name
              }
              onClick={() => {
                window.open(
                  `/species/${ecoChip.scientific_name.replace(/ /g, "_")}`,
                  "_blank",
                  "noopener,noreferrer"
                );
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
              }}
            ></CustomChip>
          </SortableItem>
        )}
      />

      {/* <div style={{ display: "inline-grid", width: "100%" }}>
        {Array.isArray(distributionState[1].regions) &&
        distributionState[1].regions.length ? (
          <CustomChip
            label={
              distributionState[1].scientific_name ? (
                <>
                  <Typography>
                    {distributionState[1].scientific_name}
                  </Typography>
                  {distributionState[1].common_name && (
                    <Typography>{distributionState[1].common_name}</Typography>
                  )}
                </>
              ) : (
                "post"
              )
            }
            onClick={() => {
              distributionState[1].scientific_name
                ? window.open(
                    `/species/${distributionState[1].scientific_name.replace(
                      / /g,
                      "_"
                    )}`,
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
                  {distributionState[2].common_name && (
                    <Typography>{distributionState[2].common_name}</Typography>
                  )}
                </>
              ) : (
                "post"
              )
            }
            onClick={() => {
              distributionState[2].scientific_name
                ? window.open(
                    `/species/${distributionState[2].scientific_name.replace(
                      / /g,
                      "_"
                    )}`,
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
                  {distributionState[3].common_name && (
                    <Typography>{distributionState[3].common_name}</Typography>
                  )}
                </>
              ) : (
                "post"
              )
            }
            onClick={() => {
              distributionState[3].scientific_name
                ? window.open(
                    `/species/${distributionState[3].scientific_name.replace(
                      / /g,
                      "_"
                    )}`,
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
      </div> */}

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
