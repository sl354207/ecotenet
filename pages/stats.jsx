import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Autocomplete,
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
import { getEcoregions } from "@utils/mongodb/mongoHelpers";
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
  const [ranked, setRanked] = useState();
  const [loading, setLoading] = useState(false);
  const [allSpecies, setAllSpecies] = useState(false);

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(
    (value1 && !allSpecies) || (value1 && allSpecies && go)
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
            // console.log(mapped);
            setOptions2(mapped);
          } else {
            setOptions2(results);
          }
          // console.log(results);
        }
        // setAllSpecies(false);
      }
      // console.log("test");
      // setAllSpecies(true);
      // if (results && results.length > 0) {
      //   const index = results.indexOf(null);

      //   results.splice(index, 1);
      // }
    }
    // else {

    // }
  }, [results, value1]);
  useEffect(() => {
    if (go) {
      // console.log(results);
      setLoading(true);

      if (results && results.length > 0) {
        const rankedArray = [];
        for (const result of results) {
          const rankedResult = result.unique_id.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
          }, {});

          rankedArray.push(rankedResult);
        }

        const rankedObject = {};
        rankedArray.forEach((item) => {
          for (const key in item) {
            if (!rankedObject[key]) {
              rankedObject[key] = item[key];
            } else {
              rankedObject[key] += item[key];
            }
          }
        });

        for (const ecoregion of ecoregions) {
          if (rankedObject[ecoregion.unique_id] === undefined) {
            ecoregion["rank"] = 0;
          } else {
            ecoregion["rank"] = rankedObject[ecoregion.unique_id];
          }

          // console.log(ecoregion);
        }

        const sorted = ecoregions.sort(function (a, b) {
          return b.rank - a.rank;
        });

        setRanked(sorted);
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

        // console.log(rankedObject);
        // console.log(ecoregions);

        // console.log(sorted);
        setGo(false);
        setLoading(false);
      }
    }
  }, [go, results]);

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
        <div style={{ display: "flex" }}>
          <Typography variant="h6" sx={{ marginBlock: "auto" }}>
            Rank ecoregions by:{" "}
          </Typography>

          <FormControl sx={{ marginLeft: "10px", minWidth: "200px" }}>
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
                if (newValue === "Category") {
                  setValue1("species_type");
                  setAllSpecies(false);
                } else if (!newValue) {
                  setValue1(newValue);
                  setValue2(undefined);
                  setAllSpecies(false);
                } else {
                  setValue1(newValue.toLowerCase());
                  if (newValue === "All Species") {
                    setAllSpecies(true);
                    // setOptions2(null);
                    setValue2(undefined);
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

          <FormControl sx={{ marginLeft: "10px", minWidth: "200px" }}>
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
                // console.log(newValue);
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
              //   groupBy={(option) => option}
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
            sx={{ marginLeft: "10px" }}
            disabled={
              value1 === undefined ||
              value1 === null ||
              ((value2 === undefined || value2 === null) && !allSpecies) ||
              isLoading ||
              loading
            }
          >
            GO
          </Button>
        </div>

        {loading || isLoading ? (
          <CircularProgress
            color="secondary"
            size={100}
            disableShrink={true}
            sx={{
              margin: "100px auto",
              display: "flex",
              justifySelf: "center",
            }}
          />
        ) : (
          <List>
            {ranked && (
              <>
                {ranked.map((ecoregion, index) => {
                  // console.log(ecoregion);
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
        )}
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = async () => {
  const ecoregions = await getEcoregions();

  return {
    props: {
      ecoregions: JSON.parse(JSON.stringify(ecoregions)),
    },
    revalidate: 60,
  };
};

export default stats;
