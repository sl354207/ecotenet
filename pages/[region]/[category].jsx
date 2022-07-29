import Footer from "@components/Footer";
import Header from "@components/Header";
import PostList from "@components/PostList";
import SpeciesScroll from "@components/SpeciesScroll";
import { Container, Typography } from "@mui/material";
import { getPostsByCategoryAndRegion, getSpecies } from "@utils/mongodb";

const categoryList = ({ category, title }) => {
  return (
    <>
      <Container>
        <Header title={title} />
        {category.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        ) : (
          <>
            {category[0].Scientific_Name ? (
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
            category = await getSpecies("Mammalia", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Reptiles":
          try {
            category = await getSpecies("Reptilia", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Amphibians":
          try {
            category = await getSpecies("Amphibia", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Birds":
          try {
            category = await getSpecies("Aves", id);
          } catch (err) {
            console.error(err);
          }

          break;
        case "Fish/Mollusk":
          // try {
          //   category = await getSpecies("Aves", id);
          // } catch (err) {
          //   console.error(err);
          // }

          break;

        default:
          break;
      }

      break;
    case "Plants":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Fungi":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Arthropods":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

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
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Travel":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Survival":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Agriculture":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Building":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

      break;
    case "Culture":
      // try {
      //   category = await getSpecies(categorySub, id);
      // } catch (err) {
      //   console.error(err);
      // }

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
    },
  };
};

export default categoryList;
