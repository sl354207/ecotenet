import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import PostList from "@components/layouts/PostList";
import CategoriesAutoComplete from "@data/categories_autocomplete.json";
import ecoregions from "@data/eco_coord.json";
import {
  Autocomplete,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 10;

const ecoOptions = ecoregions
  .map((ecoregion) => {
    const eco = {
      name: ecoregion.name,
      id: ecoregion.unique_id,
    };

    return eco;
  })
  .sort(function (a, b) {
    return a.id - b.id;
  });

const categoryOptions = CategoriesAutoComplete;
const Latest = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [radio, setRadio] = useState("All Posts");
  const [ecoregion, setEcoregion] = useState();
  const [category, setCategory] = useState({
    title: undefined,
    sub: undefined,
  });

  const { data, error, mutate, size, setSize, isLoading } = useSWRInfinite(
    radio === "All Posts" ||
      (radio === "Eco-ID" && ecoregion) ||
      (radio === "Category" && category.title)
      ? (index) =>
          `/api/latest?page=${index + 1}&ecoregion=${ecoregion}&title=${
            category.title
          }&sub=${category.sub}`
      : null,
    fetcher,
    { revalidateFirstPage: false, shouldRetryOnError: false }
  );

  const posts = data ? [].concat(...data) : [];

  const isEmpty = data && data?.[size - 1]?.length === 0;

  const underPageSize = data && data?.[size - 1]?.length < PAGE_SIZE;

  const isReachingEnd = isEmpty || underPageSize;

  const [autoValue, setAutoValue] = useState();

  const handleRadioChange = (event) => {
    setRadio(event.target.value);
    setAutoValue();

    if (event.target.value === "All Posts") {
      setEcoregion();
      setCategory({
        title: undefined,
        sub: undefined,
      });
    }

    if (event.target.value === "Eco-ID") {
      setCategory({
        title: undefined,
        sub: undefined,
      });
    }

    if (event.target.value === "Category") {
      setEcoregion();
    }
  };

  let list;

  if (error) {
    list = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button variant="outlined" color="error" onClick={() => mutate()}>
          Error Loading. Retry
        </Button>
      </div>
    );
  } else {
    list = (
      <>
        {data && posts.length > 0 ? (
          <div style={{ minHeight: `30vh` }}>
            <PostList posts={data && posts} />
          </div>
        ) : (
          <div style={{ height: `30vh` }}>
            {((ecoregion && posts.length === 0) ||
              (category.title && posts.length === 0)) && (
              <Typography
                variant="h6"
                align="center"
                sx={{ paddingTop: "20px" }}
              >
                {!isLoading && "No posts yet"}
              </Typography>
            )}
          </div>
        )}
        <Button
          disabled={
            isLoading ||
            isReachingEnd ||
            (!ecoregion && radio === "Eco-ID") ||
            (!category.title && radio === "Category")
          }
          onClick={() => {
            setSize(size + 1);
          }}
          variant="outlined"
          color="secondary"
          sx={{ display: "block", marginInline: "auto" }}
        >
          {isLoading
            ? "loading..."
            : isReachingEnd
            ? "no more posts"
            : "load more"}
        </Button>
      </>
    );
  }

  return (
    <>
      <NextSeo
        title="Latest Posts"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="List of latest posts that people have shared on the site"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/latest",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo_social.png",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />

      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="Latest Posts" />
        <FormControl sx={{ display: "flex", justifyContent: "center" }}>
          <FormLabel id="radio-buttons-group-label"></FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue="All Posts"
            row
            value={radio}
            onChange={handleRadioChange}
            name="radio-buttons-group"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <FormControlLabel
              value="All Posts"
              control={
                <Radio
                  color="secondary"
                  sx={{
                    color: `${theme.palette.secondary.main}!important`,
                  }}
                  size={isMobile ? "small" : "medium"}
                />
              }
              label={isMobile ? "All" : "All Posts"}
            />
            <FormControlLabel
              value="Eco-ID"
              control={
                <Radio
                  color="secondary"
                  sx={{
                    color: `${theme.palette.secondary.main}!important`,
                  }}
                  size={isMobile ? "small" : "medium"}
                />
              }
              label="Eco-ID"
            />
            <FormControlLabel
              value="Category"
              control={
                <Radio
                  color="secondary"
                  sx={{
                    color: `${theme.palette.secondary.main}!important`,
                  }}
                  size={isMobile ? "small" : "medium"}
                />
              }
              label="Category"
            />
          </RadioGroup>
        </FormControl>
        <FormControl sx={{ display: "flex", flexGrow: 1 }}>
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
            disabled={radio === "All Posts"}
            id="eco-auto"
            name="eco"
            onChange={(event, newValue) => {
              if (newValue && newValue !== null && newValue !== "") {
                if (newValue.id) {
                  setEcoregion(newValue.id);
                }
                if (newValue["sub"]) {
                  setCategory({
                    title: newValue["title"],
                    sub: newValue["sub"],
                  });
                }

                setAutoValue(newValue);
              } else {
                setEcoregion();
                setCategory({
                  title: undefined,
                  sub: undefined,
                });
                setAutoValue();
              }
            }}
            value={autoValue || ""}
            options={radio === "Eco-ID" ? ecoOptions : categoryOptions}
            noOptionsText={
              <Typography
                sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
              >
                no options
              </Typography>
            }
            groupBy={(option) => {
              if (option && option.title) {
                return option.title;
              }
            }}
            getOptionLabel={(option) => {
              if (option && option["sub"]) {
                return option["sub"];
              } else if (option && option.id) {
                return `Eco-${option.id}: ${option.name}`;
              } else {
                return "";
              }
            }}
            renderInput={(params) => (
              // ...params is causing error check dashboard index on how to log params
              <TextField
                {...params}
                id="eco"
                placeholder="Select Ecoregion"
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
        {list}
      </Container>
      <Footer />
    </>
  );
};

export default Latest;
