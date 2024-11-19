import { useUserContext } from "@components/context/UserContext";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import FlagIcon from "@mui/icons-material/Flag";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  Tab,
  Table,
  Tabs,
  Typography,
} from "@mui/material";
import { getSpeciesByScientificName } from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
import { validScientificName } from "@utils/validationHelpers";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import { ArticleJsonLd, NextSeo } from "next-seo";
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
      id={`species-tabpanel-${index}`}
      aria-labelledby={`species-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          p={3}
          sx={{
            backgroundColor: theme.palette.primary.light,
            borderRadius: "10px",
          }}
        >
          {children}
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
    id: `species-tab-${index}`,
    "aria-controls": `species-tabpanel-${index}`,
  };
}

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});
const DynamicTiedPostDialog = dynamic(
  () => import("@components/dialogs/TiedPostDialog"),
  {
    ssr: false,
  }
);

const Species = ({ species, wiki }) => {
  const router = useRouter();
  const { user } = useUserContext();

  const [value, setValue] = useState(0);

  const [dialog, setDialog] = useState(false);
  const [tiedPostDialog, setTiedPostDialog] = useState(false);

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

  const [toggleObservedEcoregions, setToggleObservedEcoregions] =
    useState(false);
  const [toggleNativeEcoregions, setToggleNativeEcoregions] = useState(false);
  const [toggleFreshwaterEcoregions, setToggleFreshwaterEcoregions] =
    useState(false);

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.children && domNode.name === "a") {
        const props = attributesToProps(domNode.attribs);
        return (
          <Link
            {...props}
            href={"https://en.wikipedia.org/wiki/" + domNode.attribs.href}
            color="secondary"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ overflowWrap: "anywhere" }}
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
          <Table
            {...props}
            sx={{
              border: "thin solid",
              margin: { xs: "auto", md: "0px 0px 0px 10px" },
              float: { xs: "none", md: "right" },
            }}
          >
            {domToReact(domNode.children, options)}
          </Table>
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
      if (domNode.attribs && domNode.children && domNode.name === "span") {
        const props = attributesToProps(domNode.attribs);
        return (
          <span
            {...props}
            style={{
              overflowWrap: "anywhere",
            }}
          >
            {domToReact(domNode.children, options)}
          </span>
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
          <Container
            sx={{
              backgroundColor: theme.palette.primary.light,
              paddingBottom: "20px",
              paddingTop: "5px",
              marginBlock: "20px",
            }}
          >
            <Header title="Something went wrong. Please try again later" />
          </Container>
          <Footer />
        </>
      ) : (
        <>
          <NextSeo
            title={species.scientific_name}
            titleTemplate="%s | Ecotenet"
            defaultTitle="Ecotenet"
            description={`General information about ${species.scientific_name} and the ecoregions it inhabits`}
            openGraph={{
              title: species.scientific_name,
              description: `General information about ${species.scientific_name} and the ecoregions it inhabits`,
              url: `https://www.ecotenet.org/species/${
                species.scientific_name.toLowerCase().split(" ")[0]
              }_${species.scientific_name.toLowerCase().split(" ")[1]}`,
              siteName: "Ecotenet",
              type: "article",
              article: {
                authors: ["Wikipedia"],
                tags: [species.common_name],
              },
              // images: [
              //   {
              //     url: "https://www.ecotenet.org/logo_social.png",
              //     width: 1200,
              //     height: 630,
              //     alt: "Ecotenet logo",
              //   },
              // ],
            }}
          />
          <ArticleJsonLd
            // type="BlogPosting"
            url={`https://www.ecotenet.org/species/${
              species.scientific_name.toLowerCase().split(" ")[0]
            }_${species.scientific_name.toLowerCase().split(" ")[1]}`}
            title={species.scientific_name}
            // images={[
            //   'https://example.com/photos/1x1/photo.jpg',
            //   'https://example.com/photos/4x3/photo.jpg',
            //   'https://example.com/photos/16x9/photo.jpg',
            // ]}

            description={`General information about ${species.scientific_name} and the ecoregions it inhabits`}
            useAppDir={false}
            authorName={[
              {
                type: "Organization",
                name: "Wikipedia",
                url: `https://en.wikipedia.org/wiki/${species.scientific_name.replace(
                  / /g,
                  "_"
                )}?redirect=true`,
              },
            ]}
            publisherName="Ecotenet"
            publisherLogo="https://www.ecotenet.org/logo_social.png"
            isAccessibleForFree={true}
          />

          <Container
            sx={{
              backgroundColor: theme.palette.primary.main,
            }}
          >
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
                title={
                  species.common_name
                    ? `${species.scientific_name}: ${species.common_name}`
                    : `${species.scientific_name}`
                }
              />
              <IconButton
                sx={{
                  display: "flex",
                  marginLeft: "auto",
                  marginTop: "40px",
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
                marginBottom: "-5px",
              }}
            >
              {species &&
              species.native_ecoregions &&
              species.native_ecoregions.length > 0
                ? "Observed Ecoregions:"
                : "Ecoregions:"}
              {toggleObservedEcoregions ? (
                <>
                  <IconButton
                    onClick={() => setToggleObservedEcoregions(false)}
                    size="small"
                  >
                    <KeyboardDoubleArrowLeftIcon
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  </IconButton>
                  {species.observed_ecoregions.map((id) => (
                    <Link
                      href={`/ecoregions/${id}`}
                      color="secondary"
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      key={id}
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      Eco-{id},{" "}
                    </Link>
                  ))}
                </>
              ) : (
                <IconButton
                  onClick={() => setToggleObservedEcoregions(true)}
                  size="small"
                >
                  <KeyboardDoubleArrowRightIcon
                    sx={{ color: theme.palette.secondary.main }}
                  />
                </IconButton>
              )}
            </Typography>
            {species &&
              species.native_ecoregions &&
              species.native_ecoregions.length > 0 && (
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "-5px",
                  }}
                >
                  Native Ecoregions:
                  {toggleNativeEcoregions ? (
                    <>
                      <IconButton
                        onClick={() => setToggleNativeEcoregions(false)}
                        size="small"
                      >
                        <KeyboardDoubleArrowLeftIcon
                          sx={{ color: theme.palette.secondary.main }}
                        />
                      </IconButton>
                      {species.native_ecoregions.map((id) => (
                        <Link
                          href={`/ecoregions/${id}`}
                          color="secondary"
                          underline="hover"
                          target="_blank"
                          rel="noopener noreferrer"
                          key={id}
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}
                        >
                          Eco-{id},{" "}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <IconButton
                      onClick={() => setToggleNativeEcoregions(true)}
                      size="small"
                    >
                      <KeyboardDoubleArrowRightIcon
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    </IconButton>
                  )}
                </Typography>
              )}
            {species &&
              species.freshwater_ecoregions &&
              species.freshwater_ecoregions.length > 0 && (
                <Typography variant="h6">
                  Freshwater Ecoregions:
                  {toggleFreshwaterEcoregions ? (
                    <>
                      <IconButton
                        onClick={() => setToggleFreshwaterEcoregions(false)}
                        size="small"
                      >
                        <KeyboardDoubleArrowLeftIcon
                          sx={{ color: theme.palette.secondary.main }}
                        />
                      </IconButton>
                      {species.freshwater_ecoregions.map((id) => (
                        <Typography
                          key={id}
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            lineHeight: 1.5,
                            display: "contents",
                          }}
                        >
                          FEOW-{id},{" "}
                        </Typography>
                      ))}
                    </>
                  ) : (
                    <IconButton
                      onClick={() => setToggleFreshwaterEcoregions(true)}
                      size="small"
                    >
                      <KeyboardDoubleArrowRightIcon
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    </IconButton>
                  )}
                </Typography>
              )}

            <Button
              variant="outlined"
              color="secondary"
              sx={{
                marginBottom: "10px",
                marginTop: "5px",
              }}
              onClick={() => {
                setTiedPostDialog(true);
              }}
            >
              Tied Posts
            </Button>
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
                  aria-label="species tabs"
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
              <TabPanel value={value} index={0} style={{ overflow: "auto" }}>
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
                          / /g,
                          "_"
                        )}?redirect=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        Wikipedia
                      </Link>
                    </Typography>
                    {parse(DOMPurify.sanitize(wiki.segmentedContent), options)}
                  </>
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <List>
                  <ListItem key={"inat"}>
                    <Link
                      variant="h6"
                      href={`https://www.inaturalist.org/search?q=${species.scientific_name.replace(
                        / /g,
                        "+"
                      )}`}
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
                      href={`https://commons.wikimedia.org/w/index.php?search=${species.scientific_name.replace(
                        / /g,
                        "+"
                      )}&title=Special:MediaSearch&go=Go&type=image`}
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
                      href={`https://www.iucnredlist.org/search?query=${species.scientific_name.replace(
                        / /g,
                        "+"
                      )}&searchType=species`}
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
            {tiedPostDialog && (
              <DynamicTiedPostDialog
                species={species.scientific_name}
                tiedPostDialog={tiedPostDialog}
                setTiedPostDialog={setTiedPostDialog}
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
  const { res, params } = context;
  const scientificName = params.scientific_name;

  if (validScientificName(scientificName)) {
    try {
      const species = await getSpeciesByScientificName(
        scientificName.replace(/_/g, " ")
      );

      if (species === null) {
        return {
          notFound: true,
        };
      } else {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/segments/${scientificName}?redirect=true`,
          {
            method: "GET",
            headers: {
              "Api-User-Agent": "ecotenet (info@ecotenet.org)",
            },
          }
        );
        let wiki;

        if (wikiRes.ok) {
          wiki = await wikiRes.json();
          res.setHeader(
            "Cache-Control",
            "public, s-maxage=604800, stale-while-revalidate=59"
          );
          return {
            props: {
              species: JSON.parse(JSON.stringify(species)),
              wiki:
                wiki === undefined || wiki.title === "Not found."
                  ? null
                  : JSON.parse(JSON.stringify(wiki)),
            },
          };
        } else if (wikiRes.status === 404) {
          res.setHeader(
            "Cache-Control",
            "public, s-maxage=604800, stale-while-revalidate=59"
          );
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
};

export default Species;
