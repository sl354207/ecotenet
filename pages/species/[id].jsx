import { useUserContext } from "@components/context/UserContext";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import FlagIcon from "@mui/icons-material/Flag";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { getSpeciesById } from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
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

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});

const species = ({ species, wiki }) => {
  const router = useRouter();
  const { user } = useUserContext();

  const [value, setValue] = useState(0);

  const [dialog, setDialog] = useState(false);

  const handleOpenDialog = () => {
    if (user.status === "unauthenticated" || user.status === "loading") {
      signIn();
    }
    if (user.status === "authenticated") {
      if (user.name === null || user.name === "" || user.name === undefined) {
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
      if (domNode.attribs && domNode.attribs.class === "gallerybox") {
        return <></>;
      }
      if (domNode.attribs && domNode.attribs.class === "metadata mbox-small") {
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
          <table
            {...props}
            style={{
              [theme.breakpoints.down("sm")]: {
                margin: "auto",
                float: "none",
              },
              float: "right",
              border: "thin solid",
              marginLeft: 10,
            }}
          >
            {domToReact(domNode.children, options)}
          </table>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "th") {
        const props = attributesToProps(domNode.attribs);
        return (
          <th
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
            {domToReact(domNode.children, options)}
          </th>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "tr") {
        const props = attributesToProps(domNode.attribs);
        return (
          <tr
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
            {domToReact(domNode.children, options)}
          </tr>
        );
      }
      if (domNode.attribs && domNode.children && domNode.name === "td") {
        const props = attributesToProps(domNode.attribs);
        return (
          <td
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
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
          <div
            {...props}
            style={{
              backgroundColor: "#001e3c!important",
              textAlign: "center",
              color: "#ffffff!important",
            }}
          >
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
      {!species || wiki === "error" ? (
        <>
          <Container>
            <Header title="Something went wrong. Please try again later" />
          </Container>
          <Footer />
        </>
      ) : (
        <>
          <Container>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  marginRight: "auto",
                  visibility: "hidden",
                  minWidth: 30,
                }}
              ></div>
              <Header
                title={`${species.scientific_name}: ${species.common_name}`}
              />
              <IconButton
                sx={{
                  display: "flex",
                  marginLeft: "auto",
                  marginTop: "auto",
                }}
                color="inherit"
                aria-label="flag"
                size="small"
                onClick={() => handleOpenDialog()}
              >
                <FlagIcon />
              </IconButton>
            </div>

            <Typography
              variant="h6"
              sx={{
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              Ecoregions:{" "}
              {species.unique_id.map((id) => (
                <Link
                  href={`/ecoregions/${id}`}
                  color="secondary"
                  underline="hover"
                  key={id}
                >
                  Eco-{id}
                  {", "}
                </Link>
              ))}
            </Typography>

            <div
              style={{
                flexGrow: 1,
                backgroundColor: theme.palette.background.paper,
                borderRadius: "10px",
              }}
            >
              <AppBar
                position="static"
                elevation={0}
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: "10px",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                  centered
                  indicatorColor="secondary"
                  textColor="inherit"
                >
                  <Tab
                    sx={{
                      flexGrow: 1,
                      backgroundColor: theme.palette.primary.light,
                      minHeight: 80,
                      borderRadius: "10px",
                      "&:hover": {
                        color: theme.text,
                        opacity: 1,
                      },
                    }}
                    label="General Info"
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{
                      flexGrow: 1,
                      backgroundColor: theme.palette.primary.light,
                      minHeight: 80,
                      borderRadius: "10px",
                      "&:hover": {
                        color: theme.text,
                        opacity: 1,
                      },
                    }}
                    label="Additional Resources"
                    {...a11yProps(1)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                {!wiki ? (
                  <Typography
                    variant="h6"
                    align="justify"
                    sx={{ marginTop: "20px" }}
                  >
                    We currently don&apos;t have a summary of this species. If
                    you want to help us out you can create a wikipedia page for
                    the species.
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ marginTop: "10px" }}>
                      Source:{" "}
                      <Link
                        href={`https://en.wikipedia.org/wiki/${species.scientific_name.replace(
                          " ",
                          "_"
                        )}?redirect=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        Wikipedia
                      </Link>
                    </Typography>
                    {parse(
                      DOMPurify.sanitize(wiki.lead.sections[0].text),
                      options
                    )}
                    {wiki.remaining.sections.map((section) => {
                      if (section.anchor === "Gallery") {
                        return <></>;
                      } else if (section.toclevel === 2) {
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
                  </>
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <List>
                  <ListItem key={"inat"}>
                    <Link
                      variant="h6"
                      href={`https://www.inaturalist.org/search?q=${
                        species.scientific_name.toLowerCase().split(" ")[0]
                      }%20${
                        species.scientific_name.toLowerCase().split(" ")[1]
                      }`}
                      color="secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      iNaturalist
                    </Link>
                  </ListItem>
                  <ListItem key={"wiki"}>
                    <Link
                      variant="h6"
                      href={`https://commons.wikimedia.org/w/index.php?search=${
                        species.scientific_name.toLowerCase().split(" ")[0]
                      }+${
                        species.scientific_name.toLowerCase().split(" ")[1]
                      }&title=Special:MediaSearch&go=Go&type=image`}
                      color="secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      Wikimedia Commons
                    </Link>
                  </ListItem>
                  <ListItem key={"iucn"}>
                    <Link
                      variant="h6"
                      href={`https://www.iucnredlist.org/search?query=${
                        species.scientific_name.toLowerCase().split(" ")[0]
                      }%20${
                        species.scientific_name.toLowerCase().split(" ")[1]
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
            {dialog && (
              <DynamicFlag
                open={dialog}
                handleClose={() => handleCloseDialog()}
                contentType="species"
                result={species}
                name={user && user.name}
              />
            )}
          </Container>
          <Footer />
        </>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const speciesId = context.params.id;
  const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
  if (speciesId.length === 24 && !regex.test(speciesId)) {
    try {
      const species = await getSpeciesById(speciesId);

      if (species === null) {
        return {
          notFound: true,
        };
      } else {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${
            species.scientific_name.toLowerCase().split(" ")[0]
          }_${
            species.scientific_name.toLowerCase().split(" ")[1]
          }?redirect=true`,
          {
            method: "GET",
            headers: {
              "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
            },
          }
        );
        let wiki;
        if (wikiRes.ok) {
          wiki = await wikiRes.json();
          return {
            props: {
              species: JSON.parse(JSON.stringify(species)),
              wiki:
                wiki === undefined || wiki.title === "Not found."
                  ? null
                  : JSON.parse(JSON.stringify(wiki)),
            },
          };
        } else {
          return {
            props: {
              species: JSON.parse(JSON.stringify(species)),
              wiki: "error",
            },
          };
        }
      }
    } catch (error) {
      console.error(error);
      return {
        props: {
          species: null,
          wiki: null,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }

  // console.log(species);
};

export default species;
