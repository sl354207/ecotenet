import { getMammalById } from "../utils/mongodb";
import Nav from "../components/Nav";
import PropTypes from "prop-types";
import { useState } from "react";
import useSWR from "swr";
import parse, { domToReact, attributesToProps } from "html-react-parser";
import DOMPurify from "dompurify";
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
  List,
  ListItem,
  ListItemText,
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
  },
  table: {
    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      float: "none",
    },
    float: "right",
    border: "thin solid",
  },
}));

// const wiki = async () => {
//   const url =
//     "https://en.wikipedia.org/api/rest_v1/page/mobile-sections/Earth?redirect=false";
//   const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       // Authorization:
//       //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmMWJmYjJlYmRjMjdjNDMxYjdiZDIzNjI0MWZhMGZkOSIsImp0aSI6IjdkMmI3NmZkNDFjNWU4NTcwZDgwYzY2MTgwOGMyZDI2Y2NjNzE0YjMwODJkODI1N2M5N2Q0NjVhZWQwMGMwNmZiOTljYTY5OGFkZWY4ZWY2IiwiaWF0IjoxNjQzMzA5NDAyLCJuYmYiOjE2NDMzMDk0MDIsImV4cCI6MzMyMDAyMTgyMDIsInN1YiI6IjY4Nzc3MDgxIiwiaXNzIjoiaHR0cHM6XC9cL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.bIwXFgnWnc3_DNAkcBucrzwVnMAmQHKt_eoZuAwmYMZ7dvobReLNxP28D8C_VfAP7EOSSP7PmrkHAeQUDlY_qOXpLLe8Ls1FdTVmjFeXAQFm3dBtVDJe9FDc_Lnkqfb0zqV_OYZRdm_oDIqu16sItrhqQEkxAGQxdpaObWPQO4A8XcRhe0YrE82uFxTydTOO2RG910x9AkctxeyslzItr-qB5Gdz7pgua3YLaNSB0zcK0_D98_oSw61r7OQDT0L2xI_3DbIBbPlI1Lz0hbQVpzlEDxXp9v6GHFWu4VXaO27Mrr3XRegyo0tstid-wLtvjSdxphd8mdnrYhxT3PX9UZV5gotqC3BCnJlDdev_4q9QZjY-5n7aJbPSHC43aauZfUHrKDCp5y_ocxxS5eisG7ptqMRE1kflWIzLpzdDi1_UkBz-xqMuTnBVKNCf7aY45boDYI-aNfJt0nF2ujKSB76gsSI0-AyKJUBYj7PDvGcc5tyx4jK0EZzihCK3itTwhJE7JBfgCCyvgXtpQ8hGHSJyMnYBZci_ejwOK4-HwSIGhZV2QF0sJZat80LPq6vzt5omYnNZ9qUO02n7t_zegCZM-kwf0roOXhBgMSVkhbzConYTvh4sQPi1_LP77rbnPM96rWMF9hpCICB6Z2-e2KvSIJZwgA8rRx-nhJBAvq8",
//       "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
//     },
//   });
//   // res.json().then(console.log).catch(console.error);
//   const resp = res.json().then(console.log).catch(console.error);
//   // const resp = JSON.parse(JSON.stringify(res));
//   // console.log(resp);
//   return resp;
// };

const fetcher = (url) => fetch(url).then((r) => r.json());

const mammal = ({ mammal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const ecoIds = mammal.unique_id.map((id) => <Link href="#">Eco-{id}</Link>);

  // const ecoLink = () => {
  //   const scientificName = mammal.Scientific_Name.toLowerCase().split(" ");
  //   // console.log(scientificName);
  //   return scientificName;
  // };
  // ecoLink();

  // wiki();
  const options = {
    replace: (domNode) => {
      console.log(domNode);
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
        // const props = attributesToProps(domNode.attribs);
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.role === "presentation") {
        // const props = attributesToProps(domNode.attribs);
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.role === "navigation") {
        // const props = attributesToProps(domNode.attribs);
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "noviewer") {
        // const props = attributesToProps(domNode.attribs);
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
      // if (domNode.attribs && domNode.children && domNode.name === "p") {
      //   const props = attributesToProps(domNode.attribs);
      //   return <div {...props}>{domToReact(domNode.children, options)}</div>;
      // }

      if (domNode.attribs && domNode.children && domNode.name === "figure") {
        // const props = attributesToProps(domNode.attribs);
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "thumbinner") {
        // const props = attributesToProps(domNode.attribs);
        return <></>;
      }
    },
  };

  // retrieve drafts from drafts api. convert swr data to name posts.
  const { data: post } = useSWR(
    "https://en.wikipedia.org/api/rest_v1/page/mobile-sections/blarina_brevicauda?redirect=false",
    fetcher
  );

  // loading state until draft is retrieved
  if (!post || post == undefined) return "Loading...";
  console.log(post);
  // const parser = new DOMParser();
  // const htmlDoc = parser.parseFromString(
  //   post.lead.sections[0].text,
  //   "text/html"
  // );
  // console.log(htmlDoc);
  return (
    <>
      <Nav />

      {/* TODO fix iframe resizing */}
      {/* {isMobile ? (
        <Container>
          <Typography variant="h3" align="center" className={classes.title}>
            {mammal.Scientific_Name}: {mammal.COMMON_NAME}
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
            <AppBar position="static" elevation={0} className={classes.tabbar}>
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
              {/* <iframe
                id="questionnaire"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://en.m.wikipedia.org/wiki/Northern_short-tailed_shrew"
              // ></iframe> */}
      {/* {parse(DOMPurify.sanitize(post.lead.sections[0].text), options)}
              {post.remaining.sections.map((section) => {
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
              <iframe
                id="questionnaire1"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://commons.m.wikimedia.org/wiki/Category:Quality_images_of_Sciurus_carolinensis"
              ></iframe>
            </TabPanel> */}
      {/* <TabPanel value={value} index={2}>
              <Typography>Links:</Typography>
              
                <li>link</li>
                <li>link</li>
                <li>link</li>
              </List>
            </TabPanel> */}
      {/* </div>
        </Container> */}
      {/* // ) : ( */}
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
              {/* <Tab
                    className={classes.tab}
                    label="More Resources"
                    {...a11yProps(2)}
                  /> */}
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {/* <iframe
                id="questionnaire"
                title="Inline Frame Example"
                width="100%"
                height="7300px"
                src="https://en.m.wikipedia.org/wiki/Northern_short-tailed_shrew"
              ></iframe> */}
            {parse(DOMPurify.sanitize(post.lead.sections[0].text), options)}
            {post.remaining.sections.map((section) => {
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
          {/* <TabPanel value={value} index={2}>
                <Typography>Links:</Typography>
                <ul>
                  <li>link</li>
                  <li>link</li>
                  <li>link</li>
                  <li>link</li>
                </ul>
              </TabPanel> */}
        </div>
      </Container>
      {/* // )} */}
    </>
  );
};

// fetch mammal data at build time
export const getStaticProps = async () => {
  const mammal = await getMammalById("61706ddadbe0fa4daeb7a6f7");
  // console.log(mammal);
  return {
    props: {
      mammal: JSON.parse(JSON.stringify(mammal)),
    },
  };
};

export default mammal;
