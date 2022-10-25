// import Header from "./Header";

import Link from "@components/layouts/Link";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import CategoryPostList from "./CategoryPostList";
import CategorySpeciesList from "./CategorySpeciesList";
import DrawerPost from "./DrawerPost";
import DrawerSpecies from "./DrawerSpecies";

const fetcher = (url) => fetch(url).then((r) => r.json());

const CategoryList = ({
  ecoFilter,
  title,
  category,
  dispatch,
  state,
  setCategory,
  setCategorySelect,
  setTab,
}) => {
  const { data } = useSWR(
    category ? `/api/${ecoFilter.unique_id}/${category}` : null,
    fetcher
  );

  const [itemSelect, setItemSelect] = useState(false);
  const [item, setItem] = useState(null);
  console.log(typeof item);

  return (
    <>
      {data ? (
        <>
          {itemSelect ? (
            <>
              <Container sx={{ minHeight: "auto" }}>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{
                    "& .MuiBreadcrumbs-separator": {
                      color: "rgba(255, 255, 255, 1)",
                    },
                  }}
                  separator={">"}
                >
                  <Button
                    color="secondary"
                    onClick={() => {
                      setCategory(null);
                      setCategorySelect(false);
                    }}
                    sx={{ paddingRight: "0px" }}
                  >
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => {
                      setItem(null);
                      setItemSelect(false);
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
                    {typeof item == "string" ? "POST" : "SPECIES"}
                  </Typography>
                </Breadcrumbs>
              </Container>

              {typeof item == "string" ? (
                <DrawerPost id={item} />
              ) : (
                <DrawerSpecies species={item} />
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
                    },
                  }}
                  separator={">"}
                >
                  <Button
                    color="secondary"
                    onClick={() => {
                      setCategory(null);
                      setCategorySelect(false);
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
                <Typography
                  variant="h4"
                  align="center"
                  // sx={{ marginBottom: "15px" }}
                >
                  {title}
                </Typography>
                {data && data.description && (
                  <Typography align="center" sx={{ marginTop: "10px" }}>
                    {data.description}
                  </Typography>
                )}
              </Container>

              {data && data.category.length === 0 ? (
                <Container sx={{ minHeight: "auto" }}>
                  {data.tag == "species" ? (
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ marginTop: "20px" }}
                    >
                      We currently do not have data on this category
                    </Typography>
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
                      <Container sx={{ minHeight: "auto" }}>
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{ marginTop: "20px" }}
                        >
                          *Eco-{ecoFilter.unique_id} {title} current species
                          count: {data.category.length}
                        </Typography>
                      </Container>

                      <CategorySpeciesList
                        category={data && data.category}
                        dispatch={dispatch}
                        state={state}
                        setItemSelect={setItemSelect}
                        setItem={setItem}
                        setTab={setTab}
                      />
                      <Container sx={{ minHeight: "auto" }}>
                        <Typography variant="subtitle2" align="left">
                          *These are the species currently present in this
                          ecoregion category based on our{" "}
                          <Link href="/data" underline="hover">
                            dataset.
                          </Link>{" "}
                          A species distribution often does not align perfectly
                          with ecoregion boundaries, therefore a species may not
                          be present throughout the entire ecoregion but only in
                          specific areas. A species may also be widespread but
                          in small numbers so rarely seen.
                        </Typography>
                      </Container>
                    </>
                  ) : (
                    <>
                      <CategoryPostList
                        posts={data && data.category}
                        dispatch={dispatch}
                        state={state}
                        setItemSelect={setItemSelect}
                        setItem={setItem}
                        setTab={setTab}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
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
      )}
    </>
  );
};

export default CategoryList;
