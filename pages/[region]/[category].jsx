import Footer from "@components/Footer";
import Header from "@components/Header";
import PostList from "@components/PostList";
import SpeciesScroll from "@components/SpeciesScroll";
import { Container, Typography } from "@mui/material";
import {
  getPostsByCategoryAndRegion,
  getSpecies,
} from "@utils/mongodb/helpers";

const categoryList = ({ category, title, id }) => {
  return (
    <>
      <Container>
        <Header title={`Eco-${id} ${title}`} />
        {category.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            We currently do not have data on this category
          </Typography>
        ) : (
          <>
            {category[0].scientific_name ? (
              <SpeciesScroll category={category} />
            ) : (
              <PostList posts={category} />
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
        category = await getSpecies("mammal", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "reptile":
      try {
        category = await getSpecies("reptile", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "amphibian":
      try {
        category = await getSpecies("amphibian", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "bird":
      try {
        category = await getSpecies("bird", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "fish":
      try {
        category = await getSpecies("fish", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "arthropod":
      try {
        category = await getSpecies("arthropod", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "mollusk":
      try {
        category = await getSpecies("mollusk", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "cnidaria":
      try {
        category = await getSpecies("cnidaria", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "worm":
      try {
        category = await getSpecies("worm", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "other_animals":
      try {
        category = await getSpecies("other_animals", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "tree_shrub":
      try {
        category = await getSpecies("tree_shrub", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "vine":
      try {
        category = await getSpecies("vine", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "wildflower":
      try {
        category = await getSpecies("wildflower", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "water_master":
      try {
        category = await getSpecies("water_master", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "graminoid":
      try {
        category = await getSpecies("graminoid", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "other_plants":
      try {
        category = await getSpecies("other_plants", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "uncategorized_plants":
      try {
        category = await getSpecies("uncategorized_plants", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "gill_fungi":
      try {
        category = await getSpecies("gill_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "non_gilled_fungi":
      try {
        category = await getSpecies("non_gilled_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "gasteroid_fungi":
      try {
        category = await getSpecies("gasteroid_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "other_fungi":
      try {
        category = await getSpecies("other_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "uncategorized_fungi":
      try {
        category = await getSpecies("uncategorized_fungi", id);
      } catch (err) {
        console.error(err);
      }

      break;

    case "bacteria":
      try {
        category = await getSpecies("bacteria", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "virus":
      try {
        category = await getSpecies("virus", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "protozoa":
      try {
        category = await getSpecies("protozoa", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "chromista":
      try {
        category = await getSpecies("chromista", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "archaea":
      try {
        category = await getSpecies("archaea", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "algae":
      try {
        category = await getSpecies("algae", id);
      } catch (err) {
        console.error(err);
      }

      break;
    case "ciliate":
      try {
        category = await getSpecies("ciliate", id);
      } catch (err) {
        console.error(err);
      }

    default:
      try {
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
    },
  };
};

export default categoryList;