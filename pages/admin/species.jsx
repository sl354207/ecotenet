import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import MapAdmin from "@components/maps/MapAdmin";
import {
  Autocomplete,
  Button,
  Container,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

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

  const [results, setResults] = useState([]);
  const [species, setSpecies] = useState();
  const [speciesType, setSpeciesType] = useState();
  const [initialEcoregions, setInitialEcoregions] = useState([]);
  const [clickInfo, setClickInfo] = useState([]);

  console.log(speciesType);
  console.log(species);

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
          setInitialEcoregions(result.unique_id);
          setClickInfo(result.unique_id);
        }
      }
    } else {
      setInitialEcoregions([]);
      setClickInfo([]);
      setSpecies(null);
      setSpeciesType(null);
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
        } else {
          setClickInfo((clickInfo) =>
            clickInfo.filter((id) => id !== region.properties.unique_id)
          );
        }
      }
    },
    [clickInfo]
  );

  return (
    <Container>
      <Header title="Species Update" />
      <Button
        variant="outlined"
        color="secondary"
        // sx={{ marginRight: "5px", marginBottom: "10px" }}
        disabled={
          !speciesType ||
          (species &&
            species.species_type === speciesType &&
            initialEcoregions === clickInfo)
        }
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
            inputProps={{ ...params.inputProps, type: "text", maxLength: 100 }}
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
          options={speciesTypeOptions}
          noOptionsText={
            <Typography sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
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

      <Typography variant="h6" align="left">
        Ecoregions:{" "}
        {clickInfo.map((id) => (
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
      </Typography>

      <MapAdmin
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        initialEcoregions={initialEcoregions}
      />
    </Container>
  );
};

export default adminSpecies;
