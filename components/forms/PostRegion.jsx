import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  DragHandle,
  SortableItem,
  SortableList,
} from "@components/layouts/draggable";
import MapEditor from "@components/maps/MapEditor";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

const CustomChip = styled((props) => <Chip {...props} />)(({ theme }) => ({
  borderWidth: 2,
  color: theme.palette.text.primary,
  height: 40,
  margin: "0px 0px 0px 0px",

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

const PostRegion = ({
  clickInfo,
  setClickInfo,
  tiedSpecies,
  setTiedSpecies,
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMobileNative = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);

  const handleAutoChange = async (e) => {
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

  const handleAutoSubmit = (event, newValue) => {
    if (newValue !== null) {
      let name;
      if (newValue.includes(" - ")) {
        const dash = newValue.indexOf(" - ");
        name = newValue.slice(0, dash);
      } else {
        name = newValue;
      }

      for (const result of results) {
        if (
          result.scientific_name === name &&
          !items.find((item) => item.scientific_name === result.scientific_name)
        ) {
          result.id = result.scientific_name;
          result.tied = true;
          result.select = true;
          result.native = false;
          if (!result.native_ecoregions) {
            result.native_ecoregions = [];
          }
          setItems([...items, result]);
          setToggleSpecies(true);

          if (!tiedSpecies.includes(result.scientific_name)) {
            setTiedSpecies([...tiedSpecies, result.scientific_name]);
          }
        }
      }

      setResults([]);
    }
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
      setToggleEcoregions(true);
    }
  }, []);

  const handleRemoveChip = (item) => {
    setItems((items) => items.filter((i) => i !== item));
    setTiedSpecies(tiedSpecies.filter((i) => i !== item.id));
    setToggleSpecies(true);
  };

  const selectAll = (items) => {
    setClickInfo([]);
    const selected = items.filter((item) => item.select === true);
    const arraysOfNumbers = selected.map((obj) =>
      obj.native === true ? obj.native_ecoregions : obj.observed_ecoregions
    );
    // find all of the unique numbers in arraysOfNumbers
    const uniqueNumbers = Array.from(new Set(arraysOfNumbers.flat()));
    setClickInfo(uniqueNumbers);

    setToggleEcoregions(true);
  };

  const selectInterSecting = (items) => {
    setClickInfo([]);
    // Get all selected items
    const selected = items.filter((item) => item.select === true);
    // Get all arrays of numbers
    const arraysOfNumbers = selected.map((obj) =>
      obj.native === true ? obj.native_ecoregions : obj.observed_ecoregions
    );

    // Find the intersection of all arrays
    const sharedNumbers = arraysOfNumbers.reduce(
      (accumulator, currentArray) => {
        return accumulator.filter((value) => currentArray.includes(value));
      }
    );

    setClickInfo(sharedNumbers);

    setToggleEcoregions(true);
  };

  const [items, setItems] = useState([]);

  const handleTiedCheckboxChange = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, tied: !item.tied } : item
      )
    );
    if (!tiedSpecies.includes(id)) {
      setTiedSpecies([...tiedSpecies, id]);
    }
    if (tiedSpecies.includes(id)) {
      setTiedSpecies(tiedSpecies.filter((item) => item !== id));
    }
    setToggleSpecies(true);
  };

  const handleSelectCheckboxChange = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, select: !item.select } : item
      )
    );
  };

  const handleNativeCheckboxChange = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, native: !item.native } : item
      )
    );
    setNativeToggleValue(
      items.map((item) => (!item.native ? "native" : "observed"))
    );
  };

  const [nativeToggleValue, setNativeToggleValue] = useState("observed");

  const handleNativeToggleChange = (event) => {
    if (event.target.value === "native") {
      setNativeToggleValue("native");
      setItems(items.map((item) => ({ ...item, native: true })));
    } else {
      setNativeToggleValue("observed");
      setItems(items.map((item) => ({ ...item, native: false })));
    }
  };

  const handleRemoveTiedSpecies = (id) => {
    setTiedSpecies(tiedSpecies.filter((item) => item !== id));
    if (items.find((item) => item.id === id)) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, tied: !item.tied } : item
        )
      );
    }
    setToggleSpecies(true);
  };

  const [toggleSpecies, setToggleSpecies] = useState(true);
  const [toggleEcoregions, setToggleEcoregions] = useState(true);

  return (
    <Container>
      <Header title="Select Ecoregions" />

      <Description
        description="To help determine which ecoregions your post applies to you can add single or multiple species distributions to the map. These distributions may help you determine relevant ecoregions for your post. You may add or delete
        ecoregions by double clicking on the map or using the selection buttons. A single click highlights the
        ecoregion and displays the Eco-ID and ecoregion name."
        align="left"
      />

      <Typography variant="body1" align="left">
        Search for a species by common or scientific name to display their
        distribution on the map. A maximum of 3 species can be visualized on the
        map at the same time, but up to 15 species can be added and manipulated.
      </Typography>
      <Typography variant="body1" align="left" sx={{ marginTop: "20px" }}>
        *denotes required field
      </Typography>
      <Grid container>
        <Grid item xs={12} md={6}>
          <div style={{ display: "flex", flexDirection: "column" }}>
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
              onChange={(event, newValue) => handleAutoSubmit(event, newValue)}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              disabled={items.length === 15}
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
                  inputProps={{
                    ...params.inputProps,
                    type: "text",
                    maxLength: 100,
                  }}
                  onChange={(e) => handleAutoChange(e)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBlock: "10px" }}
              disabled={items.length === 0}
              onClick={() => selectAll(items)}
            >
              {isMobile ? "Select All" : "Select All Ecoregions"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBottom: "10px" }}
              disabled={clickInfo.length === 0}
              onClick={() => setClickInfo([])}
            >
              Clear All
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginBottom: "10px", flexGrow: 1 }}
              onClick={() => selectInterSecting(items)}
              disabled={
                items.length <= 1 || items.filter((i) => i.select).length <= 1
              }
            >
              {isMobile
                ? "Select Intersecting"
                : "Select Intersecting Ecoregions"}
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ marginTop: isMobile ? "24px" : "0px" }}>
          <div
            style={{
              display: "flex",
              visibility: items.length === 0 ? "hidden" : "visible",
            }}
          >
            <Tooltip
              enterTouchDelay={100}
              leaveTouchDelay={5000}
              arrow
              title={
                <>
                  <Typography color="inherit" variant="h6">
                    Toggle which species are included when using the
                    &apos;Select All&apos; and &apos;Select Intersecting&apos;
                    buttons. This includes species that are not one of the 3
                    visible species on the map and when they are not selected as
                    a tied species. If using &apos;Select Intersecting&apos; and
                    the selected species do not share at least one ecoregion,
                    then no ecoregions will be selected.
                  </Typography>
                </>
              }
            >
              <InfoIcon
                fontSize="small"
                sx={{ marginTop: "-28px", marginLeft: "auto" }}
              ></InfoIcon>
            </Tooltip>
            <Typography sx={{ marginTop: "-24px" }}>Select</Typography>

            <Typography
              sx={{
                marginTop: "-24px",
                marginLeft: "10px",
                // marginRight: "20px",
              }}
            >
              Tied
            </Typography>
            <Tooltip
              enterTouchDelay={100}
              leaveTouchDelay={5000}
              arrow
              title={
                <>
                  <Typography color="inherit" variant="h6">
                    Select checkbox to show native range of species. If no
                    native range is available the checkbox will be disabled. If
                    Native checkbox is selected these ecoregions will be used by
                    Select All and Select Intersecting buttons.
                  </Typography>
                </>
              }
            >
              <InfoIcon
                fontSize="small"
                sx={{ marginTop: "-28px", marginLeft: "10px" }}
              ></InfoIcon>
            </Tooltip>
            <Typography
              sx={{
                marginTop: "-24px",
                marginRight: { xs: "5px", sm: "15px", md: "10px", lg: "0px" },
              }}
            >
              {isMobileNative ? "N" : "Native"}
            </Typography>
          </div>

          <SortableList
            items={items}
            onChange={setItems}
            isMobile={isMobile}
            renderItem={(item) => (
              <SortableItem id={item.id}>
                <DragHandle />
                <CustomChip
                  label={
                    item.common_name
                      ? `${item.scientific_name} - ${item.common_name}`
                      : item.scientific_name
                  }
                  onClick={() => {
                    window.open(
                      `/species/${item.scientific_name.replace(/ /g, "_")}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  onDelete={() => handleRemoveChip(item)}
                  variant="outlined"
                  sx={{
                    borderColor:
                      items && items.indexOf(item) === 0
                        ? "#ff00ff"
                        : items && items.indexOf(item) === 1
                        ? "#ffff00"
                        : items && items.indexOf(item) === 2
                        ? "#00ffff"
                        : theme.palette.secondary.main,
                    // maxWidth: isMobile ? "60%" : "70%",
                    maxWidth: {
                      xs: "60%",
                      sm: "70%",
                      md: "60%",
                      lg: "65%",
                    },
                  }}
                ></CustomChip>
                <FormControlLabel
                  key={`select-${item.id}`}
                  sx={{ marginLeft: "auto", marginRight: "0px" }}
                  control={
                    <Checkbox
                      sx={{
                        color: theme.palette.secondary.main,
                        "&.Mui-checked": {
                          color: theme.palette.secondary.main,
                        },
                      }}
                      checked={item.select}
                      onChange={() => handleSelectCheckboxChange(item.id)}
                    />
                  }
                />
                <FormControlLabel
                  key={`tied-${item.id}`}
                  sx={{
                    marginLeft: { xs: "2px", md: "2px", lg: "10px" },
                    marginRight: "0px",
                  }}
                  control={
                    <Checkbox
                      sx={{
                        color: theme.palette.secondary.main,
                        "&.Mui-checked": {
                          color: theme.palette.secondary.main,
                        },
                      }}
                      checked={item.tied}
                      onChange={() => handleTiedCheckboxChange(item.id)}
                    />
                  }
                />
                <FormControlLabel
                  key={`native-${item.id}`}
                  sx={{
                    marginLeft: { xs: "2px", md: "2px", lg: "10px" },
                    marginRight: "0px",
                  }}
                  disabled={item.native_ecoregions.length === 0}
                  control={
                    <Checkbox
                      sx={{
                        color: theme.palette.secondary.main,
                        "&.Mui-checked": {
                          color: theme.palette.secondary.main,
                        },
                      }}
                      checked={item.native}
                      onChange={() => handleNativeCheckboxChange(item.id)}
                    />
                  }
                />
              </SortableItem>
            )}
          />
        </Grid>
      </Grid>

      <Divider sx={{ marginBlock: "10px" }} />

      <div style={{ display: "flex" }}>
        <Typography
          variant="h6"
          align="left"
          sx={{ minWidth: "fit-content", minHeight: "44px" }}
        >
          {isMobile ? "Species" : "Tied Species"}
          <Tooltip
            enterTouchDelay={100}
            leaveTouchDelay={5000}
            arrow
            title={
              <Typography color="inherit" variant="h6">
                Tied species are the species that are particularly relevant to
                this post. When your post is published they will be displayed
                similarly to the list of relevant ecoregions. Tying species to a
                post is not required (but is helpful!) and may not be relevant
                for all posts
              </Typography>
            }
          >
            <InfoIcon fontSize="small" sx={{ marginBottom: "6px" }}></InfoIcon>
          </Tooltip>
          :{" "}
          {tiedSpecies && tiedSpecies.length > 0 ? (
            <>
              {toggleSpecies ? (
                <IconButton onClick={() => setToggleSpecies(false)}>
                  <KeyboardDoubleArrowLeftIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
              ) : (
                <IconButton onClick={() => setToggleSpecies(true)}>
                  <KeyboardDoubleArrowRightIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
              )}
            </>
          ) : (
            <></>
          )}
        </Typography>
        {tiedSpecies && tiedSpecies.length > 0 && toggleSpecies && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {tiedSpecies &&
              tiedSpecies.map((id) => (
                <CustomChip
                  key={id}
                  label={id}
                  onDelete={() => handleRemoveTiedSpecies(id)}
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.secondary.main,
                    marginRight: "5px",
                    marginBottom: "4px",
                    userSelect: "auto",
                    cursor: "text",
                  }}
                ></CustomChip>
              ))}
          </div>
        )}
      </div>

      <Typography
        variant="h6"
        align="left"
        sx={{
          minWidth: "fit-content",
          minHeight: "44px",
          marginTop: clickInfo.length > 0 ? "0px" : "4px",
          marginBottom: clickInfo.length > 0 ? "4px" : "0px",
        }}
      >
        Ecoregions:*{" "}
        {clickInfo.length > 0 && (
          <>
            {toggleEcoregions ? (
              <>
                <IconButton onClick={() => setToggleEcoregions(false)}>
                  <KeyboardDoubleArrowLeftIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
                {clickInfo.map((ecoregion) => (
                  <Link
                    href={`/ecoregions/${ecoregion}`}
                    color="secondary"
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                    key={ecoregion}
                    sx={{
                      alignContent: "center",
                      fontSize: "1.25rem",
                      fontWeight: "400",
                      marginBottom: "3px",
                    }}
                  >
                    Eco-{ecoregion},{" "}
                  </Link>
                ))}
              </>
            ) : (
              <IconButton onClick={() => setToggleEcoregions(true)}>
                <KeyboardDoubleArrowRightIcon
                  sx={{ color: theme.palette.secondary.main }}
                />
              </IconButton>
            )}
          </>
        )}
      </Typography>

      <MapEditor
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        state={items}
        nativeToggleValue={nativeToggleValue}
        handleNativeToggleChange={handleNativeToggleChange}
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

export default PostRegion;
