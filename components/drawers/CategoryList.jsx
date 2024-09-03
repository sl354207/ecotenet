import Link from "@components/layouts/Link";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import CategoryPostList from "./CategoryPostList";
import CategorySpeciesList from "./CategorySpeciesList";
import DrawerPost from "./DrawerPost";
import DrawerSpecies from "./DrawerSpecies";

const CategoryList = ({
  ecoFilter,
  title,
  category,
  setCategory,
  setCategorySelected,
  description,
  handleFilterClose,
}) => {
  const [nativeToggleValue, setNativeToggleValue] = useState("observed");

  const { data, isLoading, error } = useSWR(
    category
      ? category.title
        ? `/api/${ecoFilter.unique_id}/${category.title}?sub=${category.sub}`
        : `/api/${ecoFilter.unique_id}/${category}?native=${nativeToggleValue}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const { mutate } = useSWRConfig();

  const [itemSelected, setItemSelected] = useState(false);
  const [item, setItem] = useState(null);

  const handleNativeToggleChange = (event) => {
    if (event.target.value === "native") {
      setNativeToggleValue("native");
      mutate(
        `/api/${ecoFilter.unique_id}/${category}?native=${nativeToggleValue}`
      );
    } else {
      setNativeToggleValue("observed");
      mutate(
        `/api/${ecoFilter.unique_id}/${category}?native=${nativeToggleValue}`
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress
          color="secondary"
          size={50}
          disableShrink={true}
          sx={{
            margin: "100px auto",
            display: "flex",
            justifySelf: "center",
          }}
        />
      ) : (
        <>
          {error ? (
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
                onClick={() =>
                  mutate(
                    category.title
                      ? `/api/${ecoFilter.unique_id}/${category.title}?sub=${category.sub}`
                      : `/api/${ecoFilter.unique_id}/${category}`
                  )
                }
              >
                Error Loading. Retry
              </Button>
            </div>
          ) : (
            <>
              {itemSelected ? (
                <>
                  <Container sx={{ minHeight: "auto" }}>
                    <Breadcrumbs
                      aria-label="breadcrumb"
                      sx={{
                        "& .MuiBreadcrumbs-separator": {
                          color: "rgba(255, 255, 255, 1)",
                          paddingBottom: "4px",
                        },
                      }}
                      separator={">"}
                    >
                      <Button
                        color="secondary"
                        onClick={() => {
                          setCategory(null);
                          setCategorySelected(false);
                        }}
                        sx={{ paddingRight: "0px" }}
                      >
                        Filter
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          setItem(null);
                          setItemSelected(false);
                        }}
                        sx={{ paddingRight: "0px", paddingLeft: "0px" }}
                      >
                        {title}
                      </Button>

                      <Typography
                        color="lightgray"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          lineHeight: 1.75,
                          letterSpacing: "0.02857em",
                          textTransform: "uppercase",
                        }}
                      >
                        {typeof item === "string" ? "POST" : "SPECIES"}
                      </Typography>
                    </Breadcrumbs>
                  </Container>

                  {typeof item === "string" ? (
                    <DrawerPost id={item} handleClose={handleFilterClose} />
                  ) : (
                    <DrawerSpecies
                      species={item}
                      handleClose={handleFilterClose}
                    />
                  )}
                </>
              ) : (
                <>
                  <Container sx={{ minHeight: "auto" }}>
                    <Breadcrumbs
                      aria-label="breadcrumb"
                      sx={{
                        "& .MuiBreadcrumbs-separator": {
                          color: "rgba(255, 255, 255, 1)",
                          paddingBottom: "4px",
                        },
                      }}
                      separator={">"}
                    >
                      <Button
                        color="secondary"
                        onClick={() => {
                          setCategory(null);
                          setCategorySelected(false);
                        }}
                        sx={{ paddingRight: "0px" }}
                      >
                        Filter
                      </Button>

                      <Typography
                        color="lightgray"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          lineHeight: 1.75,
                          letterSpacing: "0.02857em",
                          textTransform: "uppercase",
                        }}
                      >
                        {title}
                      </Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" align="center">
                      {title}
                    </Typography>
                    {description && (
                      <Typography align="center" sx={{ marginTop: "10px" }}>
                        {description}
                      </Typography>
                    )}
                  </Container>

                  {data && data.category.length === 0 ? (
                    <Container sx={{ minHeight: "auto" }}>
                      {data.tag === "species" ? (
                        <>
                          <FormControl
                            component="fieldset"
                            sx={{
                              marginLeft: "56px",
                            }}
                          >
                            <RadioGroup
                              aria-label="native-toggle"
                              name="native-toggle"
                              value={nativeToggleValue}
                              onChange={handleNativeToggleChange}
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
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{ marginTop: "20px" }}
                          >
                            We currently do not have data on this category
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="h6"
                          align="center"
                          sx={{ marginTop: "20px" }}
                        >
                          There currently no posts on this category. Sign in to
                          create a post.
                        </Typography>
                      )}
                    </Container>
                  ) : (
                    <>
                      {data && data.category[0].scientific_name ? (
                        <>
                          <FormControl
                            component="fieldset"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <RadioGroup
                              aria-label="native-toggle"
                              name="native-toggle"
                              value={nativeToggleValue}
                              onChange={handleNativeToggleChange}
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
                          {nativeToggleValue === "native" && (
                            <Typography
                              variant="subtitle2"
                              align="center"
                              sx={{ marginInline: "5px" }}
                            >
                              This is not by any means a complete list of native
                              species for this region. It is only the native
                              species that Ecotenet currently has data on.
                            </Typography>
                          )}
                          <CategorySpeciesList
                            category={data && data.category}
                            setItemSelected={setItemSelected}
                            setItem={setItem}
                            ecoFilter={ecoFilter && ecoFilter}
                            title={title}
                          />
                          <Container sx={{ minHeight: "auto" }}>
                            <Typography variant="subtitle2" align="left">
                              *These are the species currently present in this
                              ecoregion category based on our{" "}
                              <Link href="/data" underline="hover">
                                dataset.
                              </Link>{" "}
                              A species distribution often does not align
                              perfectly with ecoregion boundaries, therefore a
                              species may not be present throughout the entire
                              ecoregion but only in specific areas. A species
                              may also be widespread but in small numbers so
                              rarely seen.
                            </Typography>
                          </Container>
                        </>
                      ) : (
                        <>
                          <CategoryPostList
                            posts={data && data.category}
                            setItemSelected={setItemSelected}
                            setItem={setItem}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default CategoryList;
