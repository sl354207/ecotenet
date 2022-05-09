// PUT IN UNIQUE_ID FOLDER EVENTUALLY
import Footer from "@components/Footer";
import Header from "@components/Header";
import SpeciesItem from "@components/SpeciesItem";
import {
  AppBar,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { getMammals } from "@utils/mongodb";
import { useRef } from "react";

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

const mammals = ({ mammals }) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // create new array containing only unique first letters of scientific name of mammals
  const uniqueFirst = [
    ...new Set(mammals.map((mammal) => mammal.Scientific_Name[0])),
  ];

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
        <Header title="Mammals" />
        <AppBar component="div" position="sticky" className={classes.subHeader}>
          {uniqueFirst.map((item) => (
            <>
              {isMobile ? (
                <Button
                  key={item}
                  onClick={() => handleClick(item, -260)}
                  className={classes.subList}
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
                  className={classes.subList}
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

export default mammals;
