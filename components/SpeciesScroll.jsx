import SpeciesItem from "@components/SpeciesItem";
import {
  AppBar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { createRef } from "react";

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

const SpeciesScroll = ({ category }) => {
  // console.log(category);
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const uniqueFirst = [
    ...new Set(category.map((item) => item.Scientific_Name[0])),
  ];

  // create object where keys equal uniqueFirst value and values equal an object with key equal to current and value of undefined. useRef allows you to access specific dom elements and change their state without rerendering page.
  const refs = uniqueFirst.reduce((acc, value) => {
    acc[value] = createRef();
    console.log(acc);
    return acc;
  }, {});
  console.log(refs);

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
              {category.map((item) => {
                if (item.Scientific_Name[0] === entry) {
                  return <SpeciesItem result={item} />;
                }
              })}
              <Divider />
            </>
          );
        })}
      </List>
    </>
  );
};

export default SpeciesScroll;
