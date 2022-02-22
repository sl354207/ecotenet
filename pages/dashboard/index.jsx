import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Link,
  Container,
  List,
  ListItem,
  Button,
  CircularProgress,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// taken directly from material ui tabs example
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    // fontSize: 20,
    // maxWidth: 40,

    // [theme.breakpoints.down("xs")]: {
    //   fontSize: 10,
    // },
    borderRadius: "10px",
  },
  tabbar: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: "10px",
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
  },
  ecoregions: {
    marginBottom: 20,
  },
  tab: {
    // fontSize: 18,
    // minWidth: 65,
    flexGrow: 1,
    backgroundColor: theme.palette.primary.light,
    minHeight: 80,
    borderRadius: "10px",
    "&:hover": {
      color: theme.text,
      opacity: 1,
    },
  },
  tablerow: {
    backgroundColor: "#001e3c!important",
    textAlign: "center",
    color: "#ffffff!important",
  },
  table: {
    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      float: "none",
    },
    float: "right",
    border: "thin solid",
    marginLeft: 10,
  },
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    border: "1px solid #94c9ff",
    margin: "20px auto",
    borderRadius: "10px",
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  card: {
    // display: "flex",
    flex: "auto",
    marginRight: 20,
    // display: "block",
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const router = useRouter();

  const theme = useTheme();
  const classes = useStyles();

  const [value, setValue] = useState(0);
  // update to getuser initial value
  const [fetch, setFetch] = useState("getposts");

  const { data: results } = useSWR(`/api/${fetch}`, fetcher);

  const isLoading = results;

  const handleChange = (event, newValue) => {
    // console.log(typeof newValue);
    setValue(newValue);
    switch (newValue) {
      case 0:
        setFetch("getposts");
        break;
      case 1:
        setFetch("getposts");
        break;
      case 2:
        setFetch("getdrafts");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      case 3:
        setFetch("getcomments");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log(`Sorry, we are out of `);
    }
  };

  // if (!results || results == undefined) {
  //   return (
  //     <Container>
  // <CircularProgress
  //   color="secondary"
  //   size={100}
  //   disableShrink={true}
  //   // className={classes.progress}
  // />
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <Typography variant="h3" align="center" className={classes.title}>
        Dashboard
      </Typography>
      <div className={classes.tabs}>
        <AppBar position="static" elevation={0} className={classes.tabbar}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
          >
            <Tab className={classes.tab} label="Profile" {...a11yProps(0)} />
            <Tab className={classes.tab} label="Posts" {...a11yProps(1)} />
            <Tab className={classes.tab} label="Drafts" {...a11yProps(1)} />
            <Tab className={classes.tab} label="Comments" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <List>
              {results.map((result) => {
                return (
                  <ListItem key={result._id} className={classes.buttonpost}>
                    {/* <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      className={classes.buttonpost}
                      onClick={() => {
                        router.push("/mammal");
                      }}
                    > */}
                    <div className={classes.card}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="textPrimary"
                        align="left"
                      >
                        {result.title}
                      </Typography>
                      <Typography gutterBottom color="textPrimary" align="left">
                        {result.description}
                      </Typography>
                      <Typography gutterBottom color="secondary" align="left">
                        {result.author}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6" color="secondary" align="right">
                        {result.count}
                      </Typography>
                    </div>
                    <Button variant="outlined" color="secondary">
                      test
                    </Button>
                    {/* </Button> */}
                  </ListItem>
                );
              })}
            </List>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {results && (
            <List>
              {results.map((result) => {
                return (
                  <ListItem key={result._id}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      className={classes.buttonpost}
                      onClick={() => {
                        router.push("/mammal");
                      }}
                    >
                      <div className={classes.card}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          color="textPrimary"
                          align="left"
                        >
                          {result.title}
                        </Typography>
                        <Typography
                          gutterBottom
                          color="textPrimary"
                          align="left"
                        >
                          {result.description}
                        </Typography>
                        <Typography gutterBottom color="secondary" align="left">
                          {result.author}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="h6"
                          color="secondary"
                          align="right"
                        >
                          {result.count}
                        </Typography>
                      </div>
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <List>
            {/* {results.map((result) => {
              return (
                <ListItem key={result._id}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    className={classes.buttonpost}
                    onClick={() => {
                      router.push("/mammal");
                    }}
                  >
                    <div className={classes.card}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="textPrimary"
                        align="left"
                      >
                        {result.title}
                      </Typography>
                      <Typography gutterBottom color="textPrimary" align="left">
                        {result.description}
                      </Typography>
                      <Typography gutterBottom color="secondary" align="left">
                        {result.author}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6" color="secondary" align="right">
                        {result.count}
                      </Typography>
                    </div>
                  </Button>
                </ListItem>
              );
            })} */}
          </List>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <List>
            <ListItem>
              {/* <Link
                variant="h6"
                href={`https://www.inaturalist.org/search?q=${
                  mammal.Scientific_Name.toLowerCase().split(" ")[0]
                }%20${mammal.Scientific_Name.toLowerCase().split(" ")[1]}`}
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                iNaturalist
              </Link> */}
            </ListItem>
            <ListItem>
              {/* <Link
                variant="h6"
                href={`https://commons.wikimedia.org/w/index.php?search=${
                  mammal.Scientific_Name.toLowerCase().split(" ")[0]
                }+${
                  mammal.Scientific_Name.toLowerCase().split(" ")[1]
                }&title=Special:MediaSearch&go=Go&type=image`}
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikimedia Commons
              </Link> */}
            </ListItem>
            <ListItem>
              {/* <Link
                variant="h6"
                href={`https://www.iucnredlist.org/search?query=${
                  mammal.Scientific_Name.toLowerCase().split(" ")[0]
                }%20${
                  mammal.Scientific_Name.toLowerCase().split(" ")[1]
                }&searchType=species`}
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                IUCN Red List
              </Link> */}
            </ListItem>
          </List>
        </TabPanel>
      </div>
      <Button onClick={() => router.push("/dashboard/posts")}>Posts</Button>
      <Button onClick={() => router.push("/dashboard/drafts")}>Drafts</Button>
    </Container>
  );
}
