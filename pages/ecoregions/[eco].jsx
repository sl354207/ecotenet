import { useHomepageContext } from "@components/context/HomepageContext";
import { useUserContext } from "@components/context/UserContext";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import FlagIcon from "@mui/icons-material/Flag";
import { Container, IconButton, Table, Typography } from "@mui/material";
import { getEcoregionById } from "@utils/mongodb/mongoHelpers";
import { validEco } from "@utils/validationHelpers";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import { ArticleJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});

const eco = ({ wiki, eco, id }) => {
  const router = useRouter();
  const { user } = useUserContext();

  const { setEcoFilter } = useHomepageContext();

  useEffect(() => {
    if (eco) {
      sessionStorage.setItem("ecoregion", JSON.stringify(eco));

      setEcoFilter(eco);
    }
  }, []);

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

  const options = {
    replace: (domNode) => {
      // console.log(domNode);
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
      {!eco || wiki === "error" ? (
        <>
          <Container>
            <Header title="Something went wrong. Please try again later" />
          </Container>
          <Footer />
        </>
      ) : (
        <>
          <NextSeo
            title={`Eco-${id}: ${eco.name}`}
            titleTemplate="%s | Ecotenet"
            defaultTitle="Ecotenet"
            description={`General information about Eco-${id}: ${eco.name}`}
            openGraph={{
              title: `Eco-${id}: ${eco.name}`,
              description: `General information about Eco-${id}: ${eco.name}`,
              url: `https://www.ecotenet.org/ecoregions/${id}`,
              siteName: "Ecotenet",
              type: "article",
              article: {
                authors: ["Wikipedia"],
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
            url={`https://www.ecotenet.org/ecoregions/${id}`}
            title={`Eco-${id}: ${eco.name}`}
            // images={[
            //   'https://example.com/photos/1x1/photo.jpg',
            //   'https://example.com/photos/4x3/photo.jpg',
            //   'https://example.com/photos/16x9/photo.jpg',
            // ]}

            description={`General information about Eco-${id}: ${eco.name}`}
            useAppDir={false}
            authorName={[
              {
                type: "Organization",
                name: "Wikipedia",
                url: `https://en.wikipedia.org/wiki/${eco.name.replace(
                  / /g,
                  "_"
                )}?redirect=true`,
              },
            ]}
            publisherName="Ecotenet"
            publisherLogo="https://www.ecotenet.org/logo_social.png"
            isAccessibleForFree={true}
          />
          <Container sx={{ overflow: "auto" }}>
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
                title={`Eco-${id}: ${eco.name}`}
                sx={{ marginBottom: "40px" }}
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

            {!wiki ? (
              <Typography
                variant="h6"
                align="justify"
                sx={{ marginTop: "20px" }}
              >
                We currently don&apos;t have a summary of this ecoregion. If you
                want to help us out you can create a wikipedia page for the
                ecoregion.
              </Typography>
            ) : (
              <>
                <Typography variant="h5" sx={{ marginTop: "10px" }}>
                  Source:{" "}
                  <Link
                    href={`https://en.wikipedia.org/wiki/${eco.name.replace(
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
                {parse(DOMPurify.sanitize(wiki), options)}
              </>
            )}

            {dialog && (
              <DynamicFlag
                open={dialog}
                handleClose={() => handleCloseDialog()}
                contentType="ecoregion"
                result={{ _id: id }}
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

// CHANGE to static potentially
export const getServerSideProps = async (context) => {
  const { res, params } = context;
  const id = params.eco;

  if (validEco(id)) {
    try {
      const eco = await getEcoregionById(id);

      if (eco === null) {
        return {
          notFound: true,
        };
      } else {
        eco._id = id;
        eco.layer = "ecoregions";
        const corrections = { " ": "_", "/": "%2F" };
        const unSlug = eco.name.replace(
          / |\//g,
          (matched) => corrections[matched]
        );

        let wikiRes;
        let wiki;

        switch (eco.url) {
          case null:
            wikiRes = await fetch(
              `https://en.wikipedia.org/w/rest.php/v1/page/${unSlug}/html?redirect=true`,
              {
                method: "GET",
                headers: {
                  "Api-User-Agent": "ecotenet (info@ecotenet.org)",
                },
              }
            );

            if (wikiRes.ok) {
              wiki = await wikiRes.text();
              res.setHeader(
                "Cache-Control",
                "public, s-maxage=604800, stale-while-revalidate=59"
              );
            } else if (wikiRes.status === 404) {
              wiki = undefined;
            } else {
              wiki = "error";
            }

            break;
          case "undefined":
            wiki = undefined;

            break;

          default:
            wikiRes = await fetch(
              `https://en.wikipedia.org/w/rest.php/v1/page/${eco.url.replace(
                / |\//g,
                (matched) => corrections[matched]
              )}/html?redirect=true`,
              {
                method: "GET",
                headers: {
                  "Api-User-Agent": "ecotenet (info@ecotenet.org)",
                },
              }
            );

            if (wikiRes.ok) {
              wiki = await wikiRes.text();
              res.setHeader(
                "Cache-Control",
                "public, s-maxage=604800, stale-while-revalidate=59"
              );
            } else if (wikiRes.status === 404) {
              wiki = undefined;
            } else {
              wiki = "error";
            }

            break;
        }

        return {
          props: {
            wiki: wiki === undefined ? null : JSON.parse(JSON.stringify(wiki)),

            eco: JSON.parse(JSON.stringify(eco)),
            id: id,
          },
        };
      }
    } catch (error) {
      console.error(error);
      return {
        props: {
          wiki: null,
          eco: null,
          id: null,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
};

export default eco;
