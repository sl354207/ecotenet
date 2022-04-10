// PUT IN UNIQUE_ID FOLDER EVENTUALLY
// UPDATE

import { getMammals } from "../utils/mongodb";
import Link from "next/link";

import {
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Container,
  Button,
  Typography,
  Divider,
  useMediaQuery,
} from "@material-ui/core";

import { useRef } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import SpeciesItem from "../components/SpeciesItem";
import Header from "../components/Header";
import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    // flexShrink: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    top: 60,
    marginTop: 20,
    border: "1px solid #94c9ff",
    borderRadius: "10px",
    // position: "sticky",
    // width: "100%",
    // maxWidth: 36,
    // backgroundColor: theme.palette.secondary.main,
  },
  sublist: {
    display: "flex",

    justifyContent: "center",
    // flexShrink: 1,
    // flexWrap: "wrap",

    // width: "100%",
    // maxWidth: 36,
  },
  header: {
    marginTop: 20,
  },
}));

const mammals = ({ mammals }) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // create new array containing only unique first letters of scientific name of mammals
  const uniqueFirst = [
    ...new Set(mammals.map((mammal) => mammal.Scientific_Name[0])),
  ];

  // const uniqueFirst = [
  //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  //   22, 23, 24, 25, 26, 27, 28,
  // ];

  // create object where keys equal uniqueFirst value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  const refs = uniqueFirst.reduce((acc, value) => {
    acc[value] = useRef();
    return acc;
  }, {});

  // scroll to clicked subheader section of page
  const handleClick = (id, yOffset) => {
    // set el to clicked elements ref
    const el = refs[id].current;
    // get the position of el within browser window plus an offset
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    // scroll to postion within window
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <>
      <Container>
        {/* <Typography variant="h3" align="center" className={classes.header}>
        Mammals
      </Typography> */}
        <Header title="Mammals" />
        <AppBar component="div" position="sticky" className={classes.subheader}>
          {uniqueFirst.map((item) => (
            <>
              {isMobile ? (
                <Button
                  key={item}
                  onClick={() => handleClick(item, -260)}
                  className={classes.sublist}
                  variant="outlined"
                  color="secondary"
                >
                  <Typography variant="h5" align="center">
                    {item}
                  </Typography>
                </Button>
              ) : (
                <Button
                  key={item}
                  onClick={() => handleClick(item, -140)}
                  className={classes.sublist}
                  variant="outlined"
                  color="secondary"
                >
                  <Typography variant="h5" align="center">
                    {item}
                  </Typography>
                </Button>
              )}
            </>
          ))}
        </AppBar>
        <Toolbar />
        <List>
          {uniqueFirst.map((entry) => {
            return (
              <>
                <ListItem key={entry} ref={refs[entry]}>
                  <ListItemText>
                    <Typography variant="h5" color="secondary">
                      {entry}
                    </Typography>
                  </ListItemText>
                </ListItem>
                {mammals.map((mammal) => {
                  if (mammal.Scientific_Name[0] === entry) {
                    return <SpeciesItem result={mammal} />;
                  }
                })}
                <Divider />
              </>
            );
          })}
        </List>
        <Link href="/posts" id="back-to-top-anchor">
          Go Back
        </Link>
      </Container>
      <Footer />
    </>
  );
};

// retrieve data at build time
export const getStaticProps = async () => {
  const mammals = await getMammals("Mammalia", "313");

  return {
    props: {
      mammals: JSON.parse(JSON.stringify(mammals)),
    },
  };
};

// build routing paths for each post at build time
// export const getStaticPaths = async () => {
//   const posts = await getPosts();

//   // create array of ids of each post in posts
//   const ids = posts.map((post) => post._id);

//   // create paths array with objects that follow structure given
//   const paths = ids.map((id) => ({ params: { id: id.toString() } }));

//   // return a path for each post id. If no id return 404
//   return {
//     paths,
//     fallback: false,
//   };
// };

export default mammals;
