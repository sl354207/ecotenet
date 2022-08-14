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
            no results
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
  const categorySub = context.params.category;
  const categoryTitle = context.query.title;
  // console.log(id);
  // console.log(categorySub);
  // console.log(categoryTitle);
  let category;

  // const getCategory = async () => {
  //   if (
  //     categoryTitle == "Animals" ||
  //     categoryTitle == "Plants" ||
  //     categoryTitle == "Fungi" ||
  //     categoryTitle == "Arthropods"
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

  switch (categoryTitle) {
    case "Animals":
      switch (categorySub) {
        case "Mammals":
          try {
            category = await getSpecies("mammal", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Reptiles":
          try {
            category = await getSpecies("reptile", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Amphibians":
          try {
            category = await getSpecies("amphibian", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Birds":
          try {
            category = await getSpecies("bird", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Fish":
          try {
            category = await getSpecies("fish", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Arthropods":
          try {
            category = await getSpecies("arthropod", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Mollusks":
          try {
            category = await getSpecies("mollusk", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Cnidaria":
          try {
            category = await getSpecies("cnidaria", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Wormish":
          try {
            category = await getSpecies("worm", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "The Rest":
          try {
            category = await getSpecies("other_animals", id);
          } catch (err) {
            console.error(err);
          }

          break;

        default:
          break;
      }

      break;
    case "Plants":
      switch (categorySub) {
        case "Trees and Shrubs":
          try {
            category = await getSpecies("tree_shrub", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Vines":
          try {
            category = await getSpecies("vine", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Wildflowers":
          try {
            category = await getSpecies("wildflower", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Water Masters":
          try {
            category = await getSpecies("water_master", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Grassish":
          try {
            category = await getSpecies("graminoid", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "The Rest":
          try {
            category = await getSpecies("other_plants", id);
          } catch (err) {
            console.error(err);
          }

          break;

        case "Unplaced":
          try {
            category = await getSpecies("uncategorized_plants", id);
          } catch (err) {
            console.error(err);
          }

          break;

        default:
          break;
      }

      break;
    case "Fungi":
      switch (categorySub) {
        case "Gilled":
          try {
            category = await getSpecies("gill_fungi", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Non-Gilled":
          try {
            category = await getSpecies("non_gilled_fungi", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Gasteroid":
          try {
            category = await getSpecies("gasteroid_fungi", id);
          } catch (err) {
            console.error(err);
          }

          break;

        case "The Rest":
          try {
            category = await getSpecies("other_fungi", id);
          } catch (err) {
            console.error(err);
          }

          break;

        case "Unplaced":
          try {
            category = await getSpecies("uncategorized_fungi", id);
          } catch (err) {
            console.error(err);
          }

          break;

        default:
          break;
      }

      break;
    case "The Rest":
      switch (categorySub) {
        case "Bacteria":
          try {
            category = await getSpecies("bacteria", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Viruses":
          try {
            category = await getSpecies("virus", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Protozoa":
          try {
            category = await getSpecies("protozoa", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Chromista":
          try {
            category = await getSpecies("chromista", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Archaea":
          try {
            category = await getSpecies("archaea", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Algae":
          try {
            category = await getSpecies("algae", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Ciliates":
          try {
            category = await getSpecies("ciliate", id);
          } catch (err) {
            console.error(err);
          }

          break;

        default:
          break;
      }

      break;
    case "Hunt":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;
    case "Gather":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;
    case "Travel":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;
    case "Survival":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;
    case "Agriculture":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;
    case "Building":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;
    case "Culture":
      try {
        // console.log("test");
        category = await getPostsByCategoryAndRegion(
          { title: categoryTitle, sub: categorySub },
          id
        );
      } catch (err) {
        console.error(err);
      }

      break;

    default:
      break;
  }

  // const species = await getMammals("Mammalia", "313");
  // console.log(category);

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      title: categorySub,
      id: id,
    },
  };
};

export default categoryList;
