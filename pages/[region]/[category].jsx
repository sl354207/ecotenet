import Footer from "@components/Footer";
import Header from "@components/Header";
import Link from "@components/Link";
import PostList from "@components/PostList";
import SpeciesScroll from "@components/SpeciesScroll";
import { Container, Typography } from "@mui/material";
import {
  getPostsByCategoryAndRegion,
  getSpecies,
} from "@utils/mongodb/helpers";

const categoryList = ({ category, title, id, description }) => {
  return (
    <>
      <Container>
        <Header title={`Eco-${id} ${title}`} />
        {description == "other" && (
          <Typography align="center" sx={{ marginTop: "10px" }}>
            These are species that either may not fit well into other categories
            or occur in small numbers in our dataset so they have been grouped
            together
          </Typography>
        )}
        {description == "uncategorized" && (
          <Typography align="center" sx={{ marginTop: "10px" }}>
            These are species that we just haven't gotten to placing in their
            proper category yet, but rather than leave them out we placed them
            all here until they get categorized
          </Typography>
        )}
        {description == "guide" && (
          <Typography align="center" sx={{ marginTop: "10px" }}>
            This category is for posts that may be more in depth and complete
            than the general info given for that species(id guides, lifecycle
            guides, etc.) or for posts that share information on several species
            within the category e.g. a comparison of species of oak trees within
            an ecoregion
          </Typography>
        )}

        {category.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            We currently do not have data on this category
          </Typography>
        ) : (
          <>
            {category[0].scientific_name ? (
              <>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ marginTop: "10px" }}
                >
                  These are the species currently present in this ecoregion
                  category based on our{" "}
                  <Link href="/data" underline="hover">
                    dataset.
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ marginTop: "20px" }}
                >
                  *Eco-{id} {title} current species count: {category.length}
                </Typography>

                <SpeciesScroll category={category} />
                <Typography variant="subtitle2" align="left">
                  *A species distribution often does not align perfectly with
                  ecoregion boundaries, therefore a species may not be present
                  throughout the entire ecoregion but only in specific areas. A
                  species may also be widespread but in small numbers so rarely
                  seen.
                </Typography>
              </>
            ) : (
              <>
                <PostList posts={category} />
              </>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

// UPDATE
// retrieve data at build time
export const getServerSideProps = async (context) => {
  const id = context.params.region;
  const categoryQuery = context.params.category;
  const categoryTitle = context.query.title;
  // console.log(id);
  // console.log(categorySub);
  // console.log(categoryTitle);
  let category;
  let description;

  // const getCategory = async () => {
  //   if (
  //     categoryQuery == "" ||
  //     categoryQuery == "Plants" ||
  //     categoryQuery == "Fungi" ||
  //     categoryQuery == "Arthropods"
  //   ) {
  //     if (categorySub == "Guides") {
  //       try {
  //         return await getPostsByCategoryAndRegion(
  //           { title: categoryTitle, sub: categorySub },
  //           id
  //         );
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     } else {
  //       try {
  //         console.log("test");
  //         const category = await getSpecies(categorySub, id);
  //         console.log(category);
  //         return category;
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   } else {
  //     try {
  //       category = await getPostsByCategoryAndRegion(
  //         { title: categoryTitle, sub: categorySub },
  //         id
  //       );
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // };

  // const category = await getCategory();

  switch (categoryQuery) {
    case "mammal":
      try {
        description = null;
        category = await getSpecies("mammal", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "reptile":
      try {
        description = null;
        category = await getSpecies("reptile", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "amphibian":
      try {
        description = null;
        category = await getSpecies("amphibian", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "bird":
      try {
        description = null;
        category = await getSpecies("bird", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "fish":
      try {
        description = null;
        category = await getSpecies("fish", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "arthropod":
      try {
        description = null;
        category = await getSpecies("arthropod", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "mollusk":
      try {
        description = null;
        category = await getSpecies("mollusk", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "cnidaria":
      try {
        description = null;
        category = await getSpecies("cnidaria", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "worm":
      try {
        description = null;
        category = await getSpecies("worm", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "other_animals":
      try {
        description = "other";
        category = await getSpecies("other_animals", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "animal_guide":
      try {
        description = "guide";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "tree_shrub":
      try {
        description = null;
        category = await getSpecies("tree_shrub", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "vine":
      try {
        description = null;
        category = await getSpecies("vine", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "wildflower":
      try {
        description = null;
        category = await getSpecies("wildflower", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "water_master":
      try {
        description = null;
        category = await getSpecies("water_master", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "graminoid":
      try {
        description = null;
        category = await getSpecies("graminoid", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "other_plants":
      try {
        description = "other";
        category = await getSpecies("other_plants", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "uncategorized_plants":
      try {
        description = "uncategorized";
        category = await getSpecies("uncategorized_plants", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "plant_guide":
      try {
        description = "guide";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "gill_fungi":
      try {
        description = null;
        category = await getSpecies("gill_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "non_gilled_fungi":
      try {
        description = null;
        category = await getSpecies("non_gilled_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "gasteroid_fungi":
      try {
        description = null;
        category = await getSpecies("gasteroid_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "other_fungi":
      try {
        description = "other";
        category = await getSpecies("other_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "uncategorized_fungi":
      try {
        description = "uncategorized";
        category = await getSpecies("uncategorized_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "fungi_guide":
      try {
        description = "guide";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "bacteria":
      try {
        description = null;
        category = await getSpecies("bacteria", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "virus":
      try {
        description = null;
        category = await getSpecies("virus", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "protozoa":
      try {
        description = null;
        category = await getSpecies("protozoa", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "chromista":
      try {
        description = null;
        category = await getSpecies("chromista", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "archaea":
      try {
        description = null;
        category = await getSpecies("archaea", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "algae":
      try {
        description = null;
        category = await getSpecies("algae", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "ciliate":
      try {
        description = null;
        category = await getSpecies("ciliate", id);
      } catch (err) {
        console.error(err);
      }

    case "the_rest_guide":
      try {
        description = "guide";
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;

    default:
      try {
        description = null;
        category = await getPostsByCategoryAndRegion(categoryQuery, id);
      } catch (err) {
        console.error(err);
      }

      break;
  }

  // const species = await getMammals("Mammalia", "313");
  // console.log(category);

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      title: categoryTitle,
      id: id,
      description: description,
    },
  };
};

export default categoryList;
