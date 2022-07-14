import Footer from "@components/Footer";
import Header from "@components/Header";
import PostList from "@components/PostList";
import SpeciesScroll from "@components/SpeciesScroll";
import { Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { getPostsByCategoryAndRegion, getSpecies } from "@utils/mongodb";

const useStyles = makeStyles(() => ({
  subHeader: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    top: 60,
    marginTop: 20,
    border: "1px solid #94c9ff",
    borderRadius: "10px",
  },
  subList: {
    display: "flex",
    justifyContent: "center",
  },
}));

const categoryList = ({ category, title }) => {
  // console.log(category);
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // let uniqueFirst;
  // let refs;

  // if (category[0].Scientific_Name) {
  //   // create new array containing only unique first letters of scientific name of mammals
  //   uniqueFirst = [...new Set(category.map((item) => item.Scientific_Name[0]))];

  //   // create object where keys equal uniqueFirst value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  //   refs = uniqueFirst.reduce((acc, value) => {
  //     acc[value] = useRef();
  //     return acc;
  //   }, {});
  // }

  // const uniqueFirst = [
  //   ...new Set(category.map((item) => item.Scientific_Name[0])),
  // ];

  // // create object where keys equal uniqueFirst value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  // const refs = uniqueFirst.reduce((acc, value) => {
  //   acc[value] = useRef();
  //   return acc;
  // }, {});

  // // scroll to clicked subheader section of page
  // const handleClick = (id, yOffset) => {
  //   // set el to clicked elements ref
  //   const el = refs[id].current;
  //   // get the position of el within browser window plus an offset
  //   const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  //   // scroll to postion within window
  //   window.scrollTo({ top: y, behavior: "smooth" });
  // };
  return (
    <>
      <Container>
        <Header title={title} />
        {category[0].Scientific_Name ? (
          // <>
          //   <AppBar
          //     component="div"
          //     position="sticky"
          //     className={classes.subHeader}
          //   >
          //     {uniqueFirst.map((item) => (
          //       <>
          //         {isMobile ? (
          //           <Button
          //             key={item}
          //             onClick={() => handleClick(item, -260)}
          //             className={classes.subList}
          //             variant="outlined"
          //             color="secondary"
          //           >
          //             <Typography variant="h5" align="center">
          //               {item}
          //             </Typography>
          //           </Button>
          //         ) : (
          //           <Button
          //             key={item}
          //             onClick={() => handleClick(item, -140)}
          //             className={classes.subList}
          //             variant="outlined"
          //             color="secondary"
          //           >
          //             <Typography variant="h5" align="center">
          //               {item}
          //             </Typography>
          //           </Button>
          //         )}
          //       </>
          //     ))}
          //   </AppBar>
          //   <Toolbar />
          //   <List>
          //     {uniqueFirst.map((entry) => {
          //       return (
          //         <>
          //           <ListItem key={entry} ref={refs[entry]}>
          //             <ListItemText>
          //               <Typography variant="h5" color="secondary">
          //                 {entry}
          //               </Typography>
          //             </ListItemText>
          //           </ListItem>
          //           {category.map((item) => {
          //             if (item.Scientific_Name[0] === entry) {
          //               return <SpeciesItem result={item} />;
          //             }
          //           })}
          //           <Divider />
          //         </>
          //       );
          //     })}
          //   </List>
          // </>
          <SpeciesScroll category={category} />
        ) : (
          <PostList posts={category} />
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
