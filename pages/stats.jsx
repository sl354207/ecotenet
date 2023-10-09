import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import MapStats from "@components/maps/MapStats";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  List,
  ListItem,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import { getStatsEcoregions } from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
import { CollectionPageJsonLd, NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const options1 = [
  "Kingdom",
  "Phylum",
  "Class",
  "Order",
  "Family",
  "Genus",
  "Category",
  "All Species",
];

const stats = ({ ecoregions }) => {
  const { mutate } = useSWRConfig();

  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [options2, setOptions2] = useState();
  const [rendered, setRendered] = useState();
  const [go, setGo] = useState(false);

  const [allSpecies, setAllSpecies] = useState(false);
  const [allSpeciesRanked, setAllSpeciesRanked] = useState();

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(
    value1 && !allSpecies && value2 !== null
      ? `/api/rank?v1=${value1}&v2=${value2}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (value1 !== "all species") {
      if (results && results.length > 0) {
        if (results.includes(null)) {
          const index = results.indexOf(null);
          results.splice(index, 1);
        }

        if (results.every((i) => typeof i === "string")) {
          if (results.includes("tree_shrub")) {
            const index = results.indexOf("tree_shrub");
            results[index] = "tree/shrub";
            const mapped = results.map((result) => {
              if (result.includes("_")) {
                return result.replace(/_/g, " ");
              } else {
                return result;
              }
            });

            setOptions2(mapped);
          } else {
            setOptions2(results);
          }
        }
      }
    }
    if (value1 === "all species") {
      setRendered(value1);
    } else {
      if (value2) {
        if (value2 === "tree_shrub") {
          setRendered("tree/shrub");
        } else if (value2.includes("_")) {
          setRendered(value2.replace(/_/g, " "));
        } else {
          setRendered(value2);
        }
      }
    }
    // setRanked(results)
    // console.log(results);
  }, [results, value1]);
  useEffect(() => {
    if (go && allSpecies) {
      const sorted = ecoregions.sort(function (a, b) {
        return b.species_count - a.species_count;
      });
      setAllSpeciesRanked(sorted);
    } else {
      setAllSpeciesRanked(undefined);
    }
  }, [go]);

  let list;

  if (isLoading) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{
          margin: "50px auto",
          display: "flex",
          justifySelf: "center",
        }}
      />
    );
  } else {
    if (error) {
      list = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => mutate(`/api/rank?v1=${value1}&v2=${value2}`)}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(results) && results.length === 0) {
        list = (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        );
      } else if (allSpeciesRanked) {
        list = (
          <List>
            <>
              {allSpeciesRanked.map((ecoregion, index) => {
                return (
                  <div
                    key={ecoregion.unique_id}
                    style={{
                      border: `1px solid ${alpha(
                        theme.palette.secondary.main,
                        1
                      )}`,
                      marginBlock: "5px",
                      borderRadius: "10px",
                      display: "flex",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ marginBlock: "auto", paddingLeft: "16px" }}
                    >
                      {index + 1}
                    </Typography>
                    <div display="block">
                      <ListItem key={ecoregion.unique_id}>
                        Eco-{ecoregion.unique_id}:{" "}
                        <Link
                          sx={{ marginLeft: "5px" }}
                          href={`/ecoregions/${ecoregion.unique_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ecoregion.name}
                        </Link>
                      </ListItem>
                      <Typography sx={{ padding: "0px 0px 8px 16px" }}>
                        {rendered} species count: {ecoregion.species_count}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </>
          </List>
        );
      } else {
        list = (
          <List>
            {results && go && (
              <>
                {results.map((ecoregion, index) => {
                  return (
                    <div
                      key={ecoregion.unique_id}
                      style={{
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          1
                        )}`,
                        marginBlock: "5px",
                        borderRadius: "10px",
                        display: "flex",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ marginBlock: "auto", paddingLeft: "16px" }}
                      >
                        {index + 1}
                      </Typography>
                      <div display="block">
                        <ListItem key={ecoregion.unique_id}>
                          Eco-{ecoregion.unique_id}:{" "}
                          <Link
                            sx={{ marginLeft: "5px" }}
                            href={`/ecoregions/${ecoregion.unique_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ecoregion.name}
                          </Link>
                        </ListItem>
                        <Typography sx={{ padding: "0px 0px 8px 16px" }}>
                          {rendered} species count: {ecoregion.rank}
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </List>
        );
      }
    }
  }

  const ecoregionsSEO = ecoregions.map((eco) => {
    const seo = {
      name: eco.name,
    };
    return seo;
  });

  return (
    <>
      <NextSeo
        title="Stats"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Statistics on species and ecoregions"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/stats",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo.svg",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />
      <CollectionPageJsonLd name="Stats" hasPart={ecoregionsSEO} />
      <Container>
        <Header title="Stats" />
        <Box
          sx={{
            display: { xs: "grid", md: "flex" },
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBlock: "auto",
              marginInline: { xs: "auto", md: "inherit" },
            }}
          >
            Rank ecoregions by:{" "}
          </Typography>

          <FormControl
            sx={{
              marginLeft: { xs: "0px", md: "10px" },
              minWidth: "200px",
              marginBlock: { xs: "5px", md: "0px" },
            }}
          >
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
                setValue2(undefined);
                setGo(false);
                if (newValue === "Category") {
                  setValue1("species_type");
                  setAllSpecies(false);
                } else if (!newValue) {
                  setValue1(newValue);
                  setAllSpecies(false);
                } else {
                  setValue1(newValue.toLowerCase());
                  if (newValue === "All Species") {
                    setAllSpecies(true);
                  } else {
                    setAllSpecies(false);
                  }
                }
              }}
              value={value1}
              options={options1}
              noOptionsText={
                <Typography
                  sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
                >
                  no options
                </Typography>
              }
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

          <FormControl
            sx={{
              marginLeft: { xs: "0px", md: "10px" },
              minWidth: "250px",
              marginBlock: { xs: "5px", md: "0px" },
            }}
          >
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
                setGo(false);
                if (!newValue) {
                  setValue2(newValue);
                } else if (newValue === "tree/shrub") {
                  setValue2("tree_shrub");
                } else if (newValue.includes(" ")) {
                  setValue2(newValue.replace(/ /g, "_"));
                } else {
                  setValue2(newValue);
                }
              }}
              value={value2}
              options={options2}
              disabled={!value1 || !options2 || allSpecies}
              noOptionsText={
                <Typography
                  sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
                >
                  no options
                </Typography>
              }
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

          <Button
            color="secondary"
            variant="contained"
            onClick={() => setGo(true)}
            sx={{
              marginLeft: { xs: "0px", md: "10px" },
              marginBlock: { xs: "5px", md: "0px" },
            }}
            disabled={
              value1 === undefined ||
              value1 === null ||
              ((value2 === undefined || value2 === null) && !allSpecies) ||
              isLoading ||
              error
            }
          >
            GO
          </Button>
        </Box>
        <MapStats ecoregions={ecoregions} />
        {list}
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = async () => {
  const ecoregions = await getStatsEcoregions();

  return {
    props: {
      ecoregions: JSON.parse(JSON.stringify(ecoregions)),
    },
    revalidate: 60,
  };
};

export default stats;
