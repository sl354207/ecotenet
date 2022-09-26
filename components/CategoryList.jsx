// import Header from "./Header";

import { Button } from "@mui/material";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const CategoryList = ({ id, title, category }) => {
  console.log(id);
  console.log(category);
  const { data } = useSWR(category ? `/api/${id}/${category}` : null, fetcher);
  console.log(data);

  return (
    <>
      <Button>test</Button>
      {data && data.tag}
      {/* <Header title={`Eco-${id} ${title}`} /> */}
      {/* {data && data.description && (
        <Typography align="center" sx={{ marginTop: "10px" }}>
          {data.description}
        </Typography>
      )}

      {data && data.category.length === 0 ? (
        <>
          {data.tag == "species" ? (
            <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
              We currently do not have data on this category
            </Typography>
          ) : (
            <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
              There currently no posts on this category. Sign in to create a
              post.
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
                *Eco-{id} {title} current species count: {data.category.length}
              </Typography>

              <SpeciesScroll category={data && data.category} />
              <Typography variant="subtitle2" align="left">
                *These are the species currently present in this ecoregion
                category based on our{" "}
                <Link href="/data" underline="hover">
                  dataset.
                </Link>{" "}
                A species distribution often does not align perfectly with
                ecoregion boundaries, therefore a species may not be present
                throughout the entire ecoregion but only in specific areas. A
                species may also be widespread but in small numbers so rarely
                seen.
              </Typography>
            </>
          ) : (
            <>
              <PostList posts={data && data.category} />
            </>
          )}
        </>
      )} */}
    </>
  );
};

export default CategoryList;
