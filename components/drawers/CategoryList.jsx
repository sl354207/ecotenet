// import Header from "./Header";

import Header from "@components/Header";
import Link from "@components/Link";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
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
  id,
  title,
  category,
  dispatch,
  state,
  setCategory,
  setCategorySelect,
}) => {
  // console.log(id);
  console.log(state);
  const { data } = useSWR(category ? `/api/${id}/${category}` : null, fetcher);

  const [itemSelect, setItemSelect] = useState(false);
  const [item, setItem] = useState(null);
  // console.log(data);

  return (
    <>
      {/* <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "rgba(255, 255, 255, 1)",
          },
        }}
        separator={">"}
      > */}
      {/* <Button
        color="secondary"
        onClick={() => {
          setCategory(null);
          setCategorySelect(false);
        }}
      >
        Back to Filter
      </Button> */}
      {/* <Button color="secondary">Filter</Button>

        <Typography color="secondary">{title.toUpperCase()}</Typography>
      </Breadcrumbs> */}
      {data ? (
        <>
          {itemSelect ? (
            <>
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
                >
                  Filter
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    setItem(null);
                    setItemSelect(false);
                  }}
                >
                  {title}
                </Button>

                {/* <Typography color="secondary">{title.toUpperCase()}</Typography> */}
              </Breadcrumbs>
              {state[1].scientific_name ? (
                <DrawerSpecies item={item} />
              ) : (
                <DrawerPost item={item} />
              )}
            </>
          ) : (
            <>
              {/* <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "rgba(255, 255, 255, 1)",
          },
        }}
        separator={">"}
      > */}
              <Button
                color="secondary"
                onClick={() => {
                  setCategory(null);
                  setCategorySelect(false);
                }}
              >
                Back to Filter
              </Button>
              {/* <Button color="secondary">Filter</Button>

        <Typography color="secondary">{title.toUpperCase()}</Typography>
      </Breadcrumbs> */}
              <Header title={title} />
              {data && data.description && (
                <Typography align="center" sx={{ marginTop: "10px" }}>
                  {data.description}
                </Typography>
              )}

              {data && data.category.length === 0 ? (
                <>
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
                </>
              ) : (
                <>
                  {data && data.category[0].scientific_name ? (
                    <>
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{ marginTop: "20px" }}
                      >
                        *Eco-{id} {title} current species count:{" "}
                        {data.category.length}
                      </Typography>

                      <CategorySpeciesList
                        category={data && data.category}
                        dispatch={dispatch}
                        state={state}
                        setItemSelect={setItemSelect}
                        setItem={setItem}
                      />
                      <Typography variant="subtitle2" align="left">
                        *These are the species currently present in this
                        ecoregion category based on our{" "}
                        <Link href="/data" underline="hover">
                          dataset.
                        </Link>{" "}
                        A species distribution often does not align perfectly
                        with ecoregion boundaries, therefore a species may not
                        be present throughout the entire ecoregion but only in
                        specific areas. A species may also be widespread but in
                        small numbers so rarely seen.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CategoryPostList
                        posts={data && data.category}
                        dispatch={dispatch}
                        state={state}
                        setItemSelect={setItemSelect}
                        setItem={setItem}
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
