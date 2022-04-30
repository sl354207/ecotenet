import { getMammalById } from "../utils/mongodb";
import PropTypes from "prop-types";
import { useState } from "react";
import parse, { domToReact, attributesToProps } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
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
  IconButton,
  Snackbar,
} from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Alert } from "@material-ui/lab";
import Flag from "../components/dialogs/Flag";

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
    marginTop: 20,
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

const mammal = ({ mammal, wiki }) => {
  const theme = useTheme();

  const classes = useStyles();
  const [value, setValue] = useState(0);

  const [dialog, setDialog] = useState(false);
  // console.log(dialog);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = () => {
    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = {
    replace: (domNode) => {
      // console.log(domNode);
      if (domNode.attribs && domNode.children && domNode.name === "a") {
        const props = attributesToProps(domNode.attribs);
        return (
          <Link
            {...props}
            href={"https://en.wikipedia.org/" + domNode.attribs.href}
            color="secondary"
            target="_blank"
            rel="noopener noreferrer"
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
          <th {...props} className={classes.tablerow}>
            {domToReact(domNode.children, options)}
          </th>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "tr") {
        const props = attributesToProps(domNode.attribs);
        return (
          <tr {...props} className={classes.tablerow}>
            {domToReact(domNode.children, options)}
          </tr>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "td") {
        const props = attributesToProps(domNode.attribs);
        return (
          <td {...props} className={classes.tablerow}>
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
          <div {...props} className={classes.tablerow}>
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
          <Header title={`${mammal.Scientific_Name}: ${mammal.COMMON_NAME}`} />
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
          {mammal.unique_id.map((id) => (
            <Link href="#" color="secondary">
              Eco-{id}
              {", "}
            </Link>
          ))}
        </Typography>

        <div className={classes.tabs}>
          <AppBar position="static" elevation={0} className={classes.tabbar}>
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
                    mammal.Scientific_Name.toLowerCase().split(" ")[0]
                  }%20${mammal.Scientific_Name.toLowerCase().split(" ")[1]}`}
                  color="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  iNaturalist
                </Link>
              </ListItem>
              <ListItem>
                <Link
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
                </Link>
              </ListItem>
              <ListItem>
                <Link
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
                </Link>
              </ListItem>
            </List>
          </TabPanel>
        </div>
        <Flag
          open={dialog}
          handleClose={() => handleCloseDialog()}
          contentType="species"
          result={mammal}
          setSnackbar={setSnackbar}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

// fetch mammal data at build time
export const getServerSideProps = async () => {
  const mammal = await getMammalById("61706ddadbe0fa4daeb7a6f7");
  // console.log(mammal);
  const wikiRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${
      mammal.Scientific_Name.toLowerCase().split(" ")[0]
    }_${mammal.Scientific_Name.toLowerCase().split(" ")[1]}?redirect=true`,
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
  // console.log(wiki);

  return {
    props: {
      mammal: JSON.parse(JSON.stringify(mammal)),
      wiki: JSON.parse(JSON.stringify(wiki)),
    },
  };
};

export default mammal;
