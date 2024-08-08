import { useSnackbarContext } from "@components/context/SnackbarContext";
import Resolve from "@components/dialogs/Resolve";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import MapAdmin from "@components/maps/MapAdmin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import {
  Autocomplete,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
const speciesTypeOptions = [
  "mammal",
  "reptile",
  "amphibian",
  "bird",
  "fish",
  "arthropod",
  "mollusk",
  "cnidaria",
  "worm",
  "other_animals",
  "tree_shrub",
  "vine",
  "wildflower",
  "water_master",
  "graminoid",
  "other_plants",
  "uncategorized_plants",
  "gill_fungi",
  "non_gilled_fungi",
  "gasteroid_fungi",
  "other_fungi",
  "uncategorized_fungi",
  "bacteria",
  "virus",
  "protozoa",
  "chromista",
  "archaea",
  "algae",
  "ciliate",
];

const adminSpecies = () => {
  const theme = useTheme();
  const router = useRouter();
  const flag = router?.query?.flag;
  const flagee = router?.query?.flagee;
  const { snackbar, setSnackbar } = useSnackbarContext();

  const [results, setResults] = useState([]);
  const [species, setSpecies] = useState();
  const [speciesType, setSpeciesType] = useState();
  const [initialEcoregions, setInitialEcoregions] = useState([]);
  const [observedEcoregions, setObservedEcoregions] = useState([]);
  const [nativeEcoregions, setNativeEcoregions] = useState([]);
  const [clickInfo, setClickInfo] = useState([]);
  const [nativeStatus, setNativeStatus] = useState("native");
  const [toggleObserved, setToggleObserved] = useState(true);
  const [toggleNative, setToggleNative] = useState(true);
  const [toggleResources, setToggleResources] = useState(true);
  const [resolve, setResolve] = useState(false);

  useEffect(() => {
    if (router.query.name) {
      handleSearchChange({
        target: { value: router.query.name.replace(/_/g, " ") },
      });
    }
  }, [router.query.name]);

  const handleSearchChange = async (e) => {
    if (e.target.value) {
      const regex = /[`!@#$%^&*()_+=\[\]{};:"\\\|,.<>\/?~]/;
      if (!regex.test(e.target.value)) {
        const res = await fetch(
          `/api/admin/search/species?q=${e.target.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();

          setResults(data);
        }
      }
    }
  };

  const handleSearchSubmit = (event, newValue) => {
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
          setSpecies(result);
          setSpeciesType(result.species_type);
          setObservedEcoregions(result.unique_id);
          if (result.native_ecoregions) {
            setNativeEcoregions(result.native_ecoregions);
            setInitialEcoregions([
              ...result.native_ecoregions,
              ...result.unique_id,
            ]);
          } else {
            setNativeEcoregions([]);
            setInitialEcoregions([...result.unique_id]);
          }

          setClickInfo(result.unique_id);
          setNativeStatus("observed");
        }
      }
    } else {
      setObservedEcoregions([]);
      setNativeEcoregions([]);
      setInitialEcoregions([]);
      setClickInfo([]);
      setSpecies(null);
      setSpeciesType(null);
      setNativeStatus("native");
    }

    setResults([]);
  };

  const handleMapClick = useCallback(
    (event) => {
      const region = event.features && event.features[0];

      if (region && region.properties.unique_id !== "<NA>") {
        if (!clickInfo.includes(region.properties.unique_id)) {
          setClickInfo((clickInfo) => [
            ...clickInfo,
            region.properties.unique_id,
          ]);
          if (nativeStatus === "native") {
            setNativeEcoregions((nativeEcoregions) => [
              ...nativeEcoregions,
              region.properties.unique_id,
            ]);
          } else {
            setObservedEcoregions((observedEcoregions) => [
              ...observedEcoregions,
              region.properties.unique_id,
            ]);
          }
        } else {
          setClickInfo((clickInfo) =>
            clickInfo.filter((id) => id !== region.properties.unique_id)
          );
          if (nativeStatus === "native") {
            setNativeEcoregions((nativeEcoregions) =>
              nativeEcoregions.filter(
                (id) => id !== region.properties.unique_id
              )
            );
          } else {
            setObservedEcoregions((observedEcoregions) =>
              observedEcoregions.filter(
                (id) => id !== region.properties.unique_id
              )
            );
          }
        }
      }
    },
    [clickInfo]
  );

  const handleUpdate = async () => {
    if (species) {
      let data = {};
      if (species.native_ecoregions) {
        data = {
          scientific_name: species.scientific_name,
          species_type: speciesType,
          unique_id: observedEcoregions,
          native_ecoregions: nativeEcoregions,
        };
      } else {
        data = {
          scientific_name: species.scientific_name,
          species_type: speciesType,
          unique_id: observedEcoregions,
        };
      }

      const res = await fetch(
        `/api/admin/species/${species.scientific_name.replace(/ /g, "_")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: "Species updated successfully",
        });
      }

      if (!res.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message:
            "There was a problem updating species. Please try again later",
        });
      }
    }
  };

  const handleOpenResolve = () => {
    setResolve(true);
  };

  const handleCloseResolve = () => {
    setResolve(false);
  };

  const handleNativeStatusChange = (event) => {
    if (event.target.value === "native") {
      setNativeStatus("native");
      setClickInfo(nativeEcoregions);
    } else {
      setNativeStatus("observed");
      setClickInfo(observedEcoregions);
    }
  };

  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <div style={{ display: "inline-block", alignItems: "center" }}>
        <Link
          href="/admin"
          underline="hover"
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <ArrowBackIcon fontSize="small" />
          Admin
        </Link>

        {router.query.name && (
          <>
            <Link
              href="/admin/flags"
              underline="hover"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <ArrowBackIcon fontSize="small" />
              Flags
            </Link>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginTop: "10px", marginLeft: "10px" }}
              disabled={!species}
              onClick={() => handleOpenResolve()}
            >
              Resolve
            </Button>
            <Resolve
              open={resolve}
              handleClose={handleCloseResolve}
              name={flagee}
              ID={flag}
              route="species"
            />
          </>
        )}
      </div>

      <Container sx={{ marginBottom: "20px" }}>
        <Header title="Species Update" />
        <Button
          variant="outlined"
          color="secondary"
          disabled={
            !speciesType ||
            (species &&
              species.species_type === speciesType &&
              observedEcoregions.length + nativeEcoregions.length ===
                initialEcoregions.length)
          }
          onClick={() => handleUpdate()}
        >
          Update
        </Button>

        <Autocomplete
          sx={{
            marginTop: "20px",
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
          onChange={(event, newValue) => handleSearchSubmit(event, newValue)}
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
              inputProps={{
                ...params.inputProps,
                type: "text",
                maxLength: 100,
              }}
              onChange={(e) => handleSearchChange(e)}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <FormControl sx={{ display: "flex", flexGrow: 1, marginBlock: "20px" }}>
          <InputLabel htmlFor="category" shrink>
            Species Type:
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
            ListboxProps={{
              sx: {
                "& .MuiAutocomplete-groupLabel": {
                  backgroundColor: theme.palette.primary.light,
                  color: alpha(theme.palette.text.primary, 0.6),
                  fontSize: 16,
                },
                "& .MuiAutocomplete-groupUl": {
                  backgroundColor: theme.palette.primary.light,
                },
                "& .MuiAutocomplete-paper": {
                  backgroundColor: theme.palette.primary.light,
                  color: alpha(theme.palette.text.primary, 0.6),
                },
              },
            }}
            autoHighlight
            id="category-auto"
            name="category"
            onChange={(event, newValue) => {
              setSpeciesType(newValue);
            }}
            value={(speciesType && speciesType) || ""}
            disabled={!species}
            options={speciesTypeOptions}
            noOptionsText={
              <Typography
                sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
              >
                no options
              </Typography>
            }
            groupBy={(option) => option.title}
            getOptionLabel={(option) => {
              if (option && option) {
                return option;
              } else {
                return "";
              }
            }}
            renderInput={(params) => (
              // ...params is causing error check dashboard index on how to log params
              <TextField
                {...params}
                id="category"
                placeholder="Select category"
                variant="outlined"
                ref={params.InputProps.ref}
                inputProps={{
                  ...params.inputProps,
                  type: "text",
                  maxLength: 100,
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </FormControl>
        {species && (
          <>
            <Typography variant="h6" align="left">
              Resources:
              {toggleResources ? (
                <>
                  <IconButton
                    onClick={() => setToggleResources(false)}
                    size="small"
                  >
                    <KeyboardDoubleArrowUpIcon
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  </IconButton>
                  <List>
                    <ListItem key={"wiki"}>
                      <Link
                        variant="h6"
                        href={`https://en.wikipedia.org/wiki/${species.scientific_name.replace(
                          / /g,
                          "_"
                        )}`}
                        color="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        Wikipedia
                      </Link>
                    </ListItem>
                    <ListItem key={"inat"}>
                      <Link
                        variant="h6"
                        href={`https://www.inaturalist.org/search?q=${species.scientific_name.replace(
                          / /g,
                          "+"
                        )}`}
                        color="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        iNaturalist
                      </Link>
                    </ListItem>
                    <ListItem key={"wiki_commons"}>
                      <Link
                        variant="h6"
                        href={`https://commons.wikimedia.org/w/index.php?search=${species.scientific_name.replace(
                          / /g,
                          "+"
                        )}&title=Special:MediaSearch&go=Go&type=image`}
                        color="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        Wikimedia Commons
                      </Link>
                    </ListItem>
                    <ListItem key={"iucn"}>
                      <Link
                        variant="h6"
                        href={`https://www.iucnredlist.org/search?query=${species.scientific_name.replace(
                          / /g,
                          "+"
                        )}&searchType=species`}
                        color="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        IUCN Red List
                      </Link>
                    </ListItem>
                    <ListItem key={"eco"}>
                      <Link
                        variant="h6"
                        href={`https://www.ecotenet.org/species/${species.scientific_name.replace(
                          / /g,
                          "_"
                        )}`}
                        color="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        Ecotenet
                      </Link>
                    </ListItem>
                  </List>
                </>
              ) : (
                <IconButton
                  onClick={() => setToggleResources(true)}
                  size="small"
                >
                  <KeyboardDoubleArrowDownIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
              )}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                marginTop: "5px",
              }}
            >
              Observed:
              {toggleObserved ? (
                <>
                  <IconButton
                    onClick={() => setToggleObserved(false)}
                    size="small"
                  >
                    <KeyboardDoubleArrowLeftIcon
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  </IconButton>
                  {observedEcoregions.map((id) => (
                    <Link
                      href={`/ecoregions/${id}`}
                      color="secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      key={id}
                    >
                      Eco-{id}
                      {", "}
                    </Link>
                  ))}
                </>
              ) : (
                <IconButton
                  onClick={() => setToggleObserved(true)}
                  size="small"
                >
                  <KeyboardDoubleArrowRightIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
              )}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginBottom: "5px",
              }}
            >
              Native:
              {toggleNative ? (
                <>
                  <IconButton
                    onClick={() => setToggleNative(false)}
                    size="small"
                  >
                    <KeyboardDoubleArrowLeftIcon
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  </IconButton>
                  {nativeEcoregions &&
                    nativeEcoregions.map((id) => (
                      <Link
                        href={`/ecoregions/${id}`}
                        color="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        key={id}
                      >
                        Eco-{id}
                        {", "}
                      </Link>
                    ))}
                </>
              ) : (
                <IconButton onClick={() => setToggleNative(true)} size="small">
                  <KeyboardDoubleArrowRightIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
              )}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="native-toggle"
                name="native-toggle"
                value={nativeStatus}
                onChange={handleNativeStatusChange}
                row
              >
                <FormControlLabel
                  value="observed"
                  control={
                    <Radio
                      color="secondary"
                      sx={{
                        color: `${theme.palette.secondary.main}!important`,
                      }}
                    />
                  }
                  label="observed"
                />
                <FormControlLabel
                  value="native"
                  disabled={
                    !nativeEcoregions ||
                    (nativeEcoregions && nativeEcoregions.length === 0)
                  }
                  control={
                    <Radio
                      color="secondary"
                      sx={{
                        color: `${theme.palette.secondary.main}!important`,
                      }}
                    />
                  }
                  label="native"
                />
              </RadioGroup>
            </FormControl>
          </>
        )}

        <MapAdmin
          clickInfo={clickInfo}
          handleDblClick={handleMapClick}
          nativeStatus={nativeStatus}
        />
      </Container>
    </>
  );
};

export default adminSpecies;
