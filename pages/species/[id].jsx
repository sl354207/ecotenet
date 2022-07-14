// PUT IN UNIQUE_ID FOLDER EVENTUALLY
import Flag from "@components/dialogs/Flag";
import Footer from "@components/Footer";
import Header from "@components/Header";
import { useUserContext } from "@components/UserContext";
import FlagIcon from "@mui/icons-material/Flag";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { getSpeciesById } from "@utils/mongodb";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useState } from "react";

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
    borderRadius: "10px",
  },
  tabBar: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: "10px",
  },
  ecoregions: {
    marginTop: 20,
    marginBottom: 20,
  },
  tab: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.light,
    minHeight: 80,
    borderRadius: "10px",
    "&:hover": {
      color: theme.text,
      opacity: 1,
    },
  },
  tableRow: {
    backgroundColor: "#001e3c!important",
    textAlign: "center",
    color: "#ffffff!important",
  },
  table: {
    [theme.breakpoints.down("sm")]: {
      margin: "auto",
      float: "none",
    },
    float: "right",
    border: "thin solid",
    marginLeft: 10,
  },
  flagBox: {
    display: "flex",
    justifyContent: "center",
  },
  spacer: {
    display: "flex",
    marginRight: "auto",
    visibility: "hidden",
    minWidth: 30,
  },
  flag: {
    display: "flex",
    marginLeft: "auto",
    marginTop: "auto",
  },
}));

const species = ({ species, wiki }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUserContext();

  const [value, setValue] = useState(0);

  const [dialog, setDialog] = useState(false);

  const handleOpenDialog = () => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        setDialog(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.children && domNode.name === "a") {
        const props = attributesToProps(domNode.attribs);
        return (
          <Link
            {...props}
            href={"https://en.wikipedia.org/" + domNode.attribs.href}
            color="secondary"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            {domToReact(domNode.children, options)}
          </Link>
        );
      }
      if (domNode.attribs && domNode.attribs.role === "note") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.role === "presentation") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.role === "navigation") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "noviewer") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class == "gallerybox") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class == "metadata mbox-small") {
        return <></>;
      }
      if (
        domNode.attribs &&
        domNode.attribs.class === "wikitable mw-collapsible"
      ) {
        return <></>;
      }
      if (domNode.attribs && domNode.children && domNode.name === "table") {
        const props = attributesToProps(domNode.attribs);
        return (
          <table {...props} className={classes.table}>
            {domToReact(domNode.children, options)}
          </table>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "th") {
        const props = attributesToProps(domNode.attribs);
        return (
          <th {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </th>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "tr") {
        const props = attributesToProps(domNode.attribs);
        return (
          <tr {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </tr>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "td") {
        const props = attributesToProps(domNode.attribs);
        return (
          <td {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </td>
        );
      }
      if (
        domNode.attribs &&
        domNode.children &&
        domNode.attribs.class === "plainlist"
      ) {
        const props = attributesToProps(domNode.attribs);
        return (
          <div {...props} className={classes.tableRow}>
            {domToReact(domNode.children, options)}
          </div>
        );
      }

      if (domNode.attribs && domNode.children && domNode.name === "figure") {
        return <></>;
      }
      if (domNode.attribs && domNode.children && domNode.name === "style") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "thumbinner") {
        return <></>;
      }
    },
  };

  return (
    <>
      <Container>
        <div className={classes.flagBox}>
          <div className={classes.spacer}></div>
          <Header
            title={`${species.Scientific_Name}: ${species.COMMON_NAME}`}
          />
          <IconButton
            className={classes.flag}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenDialog()}
          >
            <FlagIcon />
          </IconButton>
        </div>

        <Typography variant="h6" className={classes.ecoregions}>
          Ecoregions:{" "}
          {species.unique_id.map((id) => (
            <Link href="#" color="secondary" underline="hover">
              Eco-{id}
              {", "}
            </Link>
          ))}
        </Typography>

        <div className={classes.tabs}>
          <AppBar position="static" elevation={0} className={classes.tabBar}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              centered
              indicatorColor="secondary"
              textColor="inherit"
            >
              <Tab
                className={classes.tab}
                label="General Info"
                {...a11yProps(0)}
              />
              <Tab
                className={classes.tab}
                label="Additional Resources"
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {parse(DOMPurify.sanitize(wiki.lead.sections[0].text), options)}
            {wiki.remaining.sections.map((section) => {
              if (section.anchor == "Gallery") {
                return <></>;
              } else if (section.toclevel == 2) {
                return (
                  <>
                    <h2>{section.line}</h2>
                    {parse(DOMPurify.sanitize(section.text), options)}
                  </>
                );
              } else {
                return (
                  <>
                    <h1>{section.line}</h1>
                    {parse(DOMPurify.sanitize(section.text), options)}
                  </>
                );
              }
            })}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <List>
              <ListItem>
                <Link
                  variant="h6"
                  href={`https://www.inaturalist.org/search?q=${
                    species.Scientific_Name.toLowerCase().split(" ")[0]
                  }%20${species.Scientific_Name.toLowerCase().split(" ")[1]}`}
                  color="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  iNaturalist
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  variant="h6"
                  href={`https://commons.wikimedia.org/w/index.php?search=${
                    species.Scientific_Name.toLowerCase().split(" ")[0]
                  }+${
                    species.Scientific_Name.toLowerCase().split(" ")[1]
                  }&title=Special:MediaSearch&go=Go&type=image`}
                  color="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  Wikimedia Commons
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  variant="h6"
                  href={`https://www.iucnredlist.org/search?query=${
                    species.Scientific_Name.toLowerCase().split(" ")[0]
                  }%20${
                    species.Scientific_Name.toLowerCase().split(" ")[1]
                  }&searchType=species`}
                  color="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  IUCN Red List
                </Link>
              </ListItem>
            </List>
          </TabPanel>
        </div>
        <Flag
          open={dialog}
          handleClose={() => handleCloseDialog()}
          contentType="species"
          result={species}
          name={user && user.name}
        />
      </Container>
      <Footer />
    </>
  );
};

// fetch species data at build time
export const getServerSideProps = async (context) => {
  const speciesId = context.params.id;
  const species = await getSpeciesById(speciesId);

  const wikiRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${
      species.Scientific_Name.toLowerCase().split(" ")[0]
    }_${species.Scientific_Name.toLowerCase().split(" ")[1]}?redirect=true`,
    {
      method: "GET",
      headers: {
        // Authorization:
        //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmMWJmYjJlYmRjMjdjNDMxYjdiZDIzNjI0MWZhMGZkOSIsImp0aSI6IjdkMmI3NmZkNDFjNWU4NTcwZDgwYzY2MTgwOGMyZDI2Y2NjNzE0YjMwODJkODI1N2M5N2Q0NjVhZWQwMGMwNmZiOTljYTY5OGFkZWY4ZWY2IiwiaWF0IjoxNjQzMzA5NDAyLCJuYmYiOjE2NDMzMDk0MDIsImV4cCI6MzMyMDAyMTgyMDIsInN1YiI6IjY4Nzc3MDgxIiwiaXNzIjoiaHR0cHM6XC9cL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.bIwXFgnWnc3_DNAkcBucrzwVnMAmQHKt_eoZuAwmYMZ7dvobReLNxP28D8C_VfAP7EOSSP7PmrkHAeQUDlY_qOXpLLe8Ls1FdTVmjFeXAQFm3dBtVDJe9FDc_Lnkqfb0zqV_OYZRdm_oDIqu16sItrhqQEkxAGQxdpaObWPQO4A8XcRhe0YrE82uFxTydTOO2RG910x9AkctxeyslzItr-qB5Gdz7pgua3YLaNSB0zcK0_D98_oSw61r7OQDT0L2xI_3DbIBbPlI1Lz0hbQVpzlEDxXp9v6GHFWu4VXaO27Mrr3XRegyo0tstid-wLtvjSdxphd8mdnrYhxT3PX9UZV5gotqC3BCnJlDdev_4q9QZjY-5n7aJbPSHC43aauZfUHrKDCp5y_ocxxS5eisG7ptqMRE1kflWIzLpzdDi1_UkBz-xqMuTnBVKNCf7aY45boDYI-aNfJt0nF2ujKSB76gsSI0-AyKJUBYj7PDvGcc5tyx4jK0EZzihCK3itTwhJE7JBfgCCyvgXtpQ8hGHSJyMnYBZci_ejwOK4-HwSIGhZV2QF0sJZat80LPq6vzt5omYnNZ9qUO02n7t_zegCZM-kwf0roOXhBgMSVkhbzConYTvh4sQPi1_LP77rbnPM96rWMF9hpCICB6Z2-e2KvSIJZwgA8rRx-nhJBAvq8",
        "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
      },
    }
  );

  const wiki = await wikiRes.json();

  return {
    props: {
      species: JSON.parse(JSON.stringify(species)),
      wiki: JSON.parse(JSON.stringify(wiki)),
    },
  };
};

export default species;
