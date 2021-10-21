import { getMammalById } from "../utils/mongodb";
import Nav from "../components/Nav";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  useMediaQuery,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Link,
  Container,
} from "@material-ui/core";
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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
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

    // [theme.breakpoints.down("xs")]: {
    //   fontSize: 10,
    // },
  },

  title: {
    marginBottom: 20,
  },
  ecoregions: {
    marginBottom: 20,
  },
  tab: {
    // fontSize: 18,
    // minWidth: 65,
    flexGrow: 1,
  },
}));

const mammal = ({ mammal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ecoIds = mammal.unique_id.map((id) => <Link href="#">Eco-{id}</Link>);

  return (
    <>
      <Nav />
      {/* TODO fix iframe resizing */}
      {isMobile ? (
        <Container>
          <Typography variant="h3" align="center" className={classes.title}>
            Blarina brevicauda: Northern Short-tailed Shrew
          </Typography>
          <Typography variant="h5" className={classes.ecoregions}>
            Ecoregions:{" "}
            {mammal.unique_id.map((id) => (
              <Link href="#" color="secondary">
                Eco-{id}
                {", "}
              </Link>
            ))}
          </Typography>
          <div className={classes.tabs}>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                centered
              >
                <Tab
                  className={classes.tab}
                  label="General"
                  {...a11yProps(0)}
                />
                <Tab className={classes.tab} label="Photos" {...a11yProps(1)} />
                <Tab className={classes.tab} label="More" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <iframe
                id="questionnaire"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://en.m.wikipedia.org/wiki/Northern_short-tailed_shrew"
              ></iframe>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <iframe
                id="questionnaire1"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://commons.m.wikimedia.org/wiki/Category:Blarina_brevicauda"
              ></iframe>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography>Links:</Typography>
              <ul>
                <li>link</li>
                <li>link</li>
                <li>link</li>
                <li>link</li>
              </ul>
            </TabPanel>
          </div>
        </Container>
      ) : (
        <Container>
          <Typography variant="h3" align="center" className={classes.title}>
            Blarina brevicauda: Northern Short-tailed Shrew
          </Typography>
          <Typography variant="h5" className={classes.ecoregions}>
            Ecoregions:{" "}
            {mammal.unique_id.map((id) => (
              <Link href="#" color="secondary">
                Eco-{id}
                {", "}
              </Link>
            ))}
          </Typography>

          <div className={classes.tabs}>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                centered
              >
                <Tab
                  className={classes.tab}
                  label="General Info"
                  {...a11yProps(0)}
                />
                <Tab className={classes.tab} label="Photos" {...a11yProps(1)} />
                <Tab
                  className={classes.tab}
                  label="More Resources"
                  {...a11yProps(2)}
                />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <iframe
                id="questionnaire"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://en.m.wikipedia.org/wiki/Northern_short-tailed_shrew"
              ></iframe>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <iframe
                id="questionnaire1"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://commons.m.wikimedia.org/wiki/Category:Blarina_brevicauda"
              ></iframe>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography>Links:</Typography>
              <ul>
                <li>link</li>
                <li>link</li>
                <li>link</li>
                <li>link</li>
              </ul>
            </TabPanel>
          </div>
        </Container>
      )}
    </>
  );
};

// fetch mammal data at build time
export const getStaticProps = async () => {
  const mammal = await getMammalById("61706ddadbe0fa4daeb7a6f7");

  return {
    props: {
      mammal: JSON.parse(JSON.stringify(mammal)),
    },
  };
};

export default mammal;
