import { getMammals } from "../utils/mongodb";

import Link from "next/link";

import {
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  AppBar,
  Toolbar,
} from "@material-ui/core";

import { useRef, createRef } from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    // position: "sticky",
    // width: "100%",
    // maxWidth: 36,
    // backgroundColor: theme.palette.secondary.main,
  },
  list: {
    // display: "flex",
    // width: "100%",
    // maxWidth: 36,
  },
}));

const mammals = ({ mammals }) => {
  const classes = useStyles();

  const uniqueFirst = [
    ...new Set(mammals.map((mammal) => mammal.Scientific_Name[0])),
  ];
  // console.log(uniqueFirst);
  const refs = uniqueFirst.reduce((acc, value) => {
    acc[value] = useRef();
    return acc;
  }, {});
  // console.log(refs);

  const handleClick = (id) =>
    refs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <List component="div" className={classes.subheader}>
            {uniqueFirst.map((item) => (
              <ListItem
                className={classes.list}
                key={item}
                button
                onClick={() => handleClick(item)}
              >
                <ListItemText>{item}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Toolbar>
      </AppBar>

      <List>
        {uniqueFirst.map((entry) => {
          return (
            <>
              <ListItem ref={refs[entry]}>
                <a href="/mammal">{entry}</a>
              </ListItem>
              {mammals.map((mammal) => {
                if (mammal.Scientific_Name[0] === entry) {
                  return (
                    <ListItem>
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
    </>
  );
};

// retrieve data at build time
export const getStaticProps = async () => {
  const mammals = await getMammals(313);

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
