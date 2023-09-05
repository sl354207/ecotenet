import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Autocomplete,
  Button,
  Container,
  FormControl,
  List,
  ListItem,
  ListItemText,
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

const stats = ({ ecoregions }) => {
  const { mutate } = useSWRConfig();

  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [options2, setOptions2] = useState();
  const [go, setGo] = useState(false);
  const [rank, setRank] = useState();

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(value1 ? `/api/rank?v1=${value1}&v2=${value2}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (results && results.length > 0) {
      const index = results.indexOf(null);

      results.splice(index, 1);
      if (results.every((i) => typeof i === "string")) {
        setOptions2(results);
        console.log(results);
      }
    }
    // console.log(results);
  }, [results]);
  useEffect(() => {
    if (go) {
      console.log(results);
      const rankedArray = [];
      for (const result of results) {
        const rankedResult = result.unique_id.reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        }, {});

        rankedArray.push(rankedResult);
      }

      const testObject = {};
      rankedArray.forEach((item) => {
        for (const key in item) {
          if (!testObject[key]) {
            testObject[key] = item[key];
          } else {
            testObject[key] += item[key];
          }
        }
      });

      for (const ecoregion of ecoregions) {
        ecoregion["rank"] = testObject[ecoregion.unique_id];
        console.log(ecoregion);
      }

      const sorted = ecoregions.sort(function (a, b) {
        return a.rank - b.rank;
      });

      setRank(sorted);
      console.log(testObject);
      console.log(ecoregions);

      console.log(sorted);
      setGo(false);
    }
  }, [go]);

  //   const sorted = ecoregions.sort(function (a, b) {
  //     return a.unique_id - b.unique_id;
  //   });

  const ecoregionsSEO = ecoregions.map((eco) => {
    const seo = {
      name: eco.name,
    };
    return seo;
  });

  const options1 = [
    "Kingdom",
    "Phylum",
    "Class",
    "Order",
    "Family",
    "Genus",
    "Category",
  ];

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
                // console.log(newValue);
                if (newValue === "Category") {
                  setValue1("species_type");
                } else if (!newValue) {
                  setValue1(newValue);
                } else {
                  setValue1(newValue.toLowerCase());
                }
              }}
              //   defaultValue={value || ""}
              value={value1}
              options={options1}
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
                setValue2(newValue);
              }}
              //   defaultValue={value || ""}
              value={value2}
              options={options2}
              disabled={!value1}
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
              value2 === undefined ||
              value2 === null
            }
          >
            GO
          </Button>
        </div>

        <List>
          {rank && (
            <>
              {rank.map((ecoregion) => {
                return (
                  <ListItem key={ecoregion.unique_id}>
                    Eco-{ecoregion.unique_id}:{" "}
                    <Link
                      sx={{ marginLeft: "5px" }}
                      href={`/ecoregions/${ecoregion.unique_id}`}
                    >
                      {ecoregion.name}
                    </Link>
                    <ListItemText>{ecoregion.rank}</ListItemText>
                  </ListItem>
                );
              })}
            </>
          )}
          {/* {sorted.map((ecoregion) => {
            return (
              <ListItem key={ecoregion.unique_id}>
                Eco-{ecoregion.unique_id}:{" "}
                <Link
                  sx={{ marginLeft: "5px" }}
                  href={`/ecoregions/${ecoregion.unique_id}`}
                >
                  {ecoregion.name}
                </Link>
              </ListItem>
            );
          })} */}
        </List>
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
