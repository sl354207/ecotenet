// PUT IN UNIQUE_ID FOLDER EVENTUALLY
// UPDATE

import { getMammals } from "../utils/mongodb";
import Nav from "../components/Nav";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
} from "@material-ui/core";

import { useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";

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
  list: {
    marginTop: 50,
  },
}));

const mammals = ({ mammals }) => {
  const classes = useStyles();
  const router = useRouter();

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
  const handleClick = (id, yOffset = -160) => {
    // set el to clicked elements ref
    const el = refs[id].current;
    // get the position of el within browser window plus an offset
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    // scroll to postion within window
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <>
      {/* <Nav /> */}
      <Typography variant="h3" align="center">
        Mammals
      </Typography>
      <AppBar component="div" position="sticky" className={classes.subheader}>
        {uniqueFirst.map((item) => (
          <Button
            key={item}
            onClick={() => handleClick(item)}
            className={classes.sublist}
          >
            {item}
          </Button>
        ))}
      </AppBar>
      <Toolbar />
      <Container>
        <List className={classes.list}>
          {uniqueFirst.map((entry) => {
            return (
              <>
                <ListItem key={entry} ref={refs[entry]}>
                  <ListItemText>{entry}</ListItemText>
                </ListItem>
                {mammals.map((mammal) => {
                  if (mammal.Scientific_Name[0] === entry) {
                    return (
                      <ListItem
                        key={mammal._id}
                        button
                        onClick={() => {
                          router.push("/mammal");
                        }}
                      >
                        <a href="/mammal">{mammal.Scientific_Name}</a>
                      </ListItem>
                    );
                  }
                })}
              </>
            );
          })}
        </List>
        <Link href="/posts" id="back-to-top-anchor">
          Go Back
        </Link>
      </Container>
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
