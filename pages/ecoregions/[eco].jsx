import { useHomepageContext } from "@components/context/HomepageContext";
import { useUserContext } from "@components/context/UserContext";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import FlagIcon from "@mui/icons-material/Flag";
import { Container, IconButton, Typography } from "@mui/material";
import { getEcoregionById } from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
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

  let status;
  if (user === undefined) {
    status = "loading";
  } else {
    status = user.status;
  }

  const { setEcoFilter } = useHomepageContext();

  useEffect(() => {
    sessionStorage.setItem("ecoregion", JSON.stringify(eco));
    setEcoFilter(eco);
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
              //     url: "https://www.ecotenet.org/logo.svg",
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
            publisherLogo="https://www.ecotenet.org/logo.svg"
            isAccessibleForFree={true}
          />
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
                title={`Eco-${id}: ${eco.name}`}
                sx={{ marginBottom: "40px" }}
              />
              <IconButton
                sx={{
                  display: "flex",
                  marginLeft: "auto",
                  marginTop: "auto",
                  marginBottom: "auto",
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
                {parse(DOMPurify.sanitize(wiki.lead.sections[0].text), options)}
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

            {/* UPDATE */}
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
  // console.log(context);
  const id = context.params.eco;

  if (validEco(id)) {
    try {
      const eco = await getEcoregionById(id);

      if (eco === null) {
        return {
          notFound: true,
        };
      } else {
        const unSlug = eco.name.replace(/ /g, "_");

        let wikiRes;
        let wiki;

        switch (eco.url) {
          case undefined:
            wikiRes = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${unSlug}?redirect=true`,
              {
                method: "GET",
                headers: {
                  "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
                },
              }
            );
            if (wikiRes.ok) {
              wiki = await wikiRes.json();
            } else {
              wiki = "error";
            }

            break;
          case "undefined":
            wiki = undefined;

            break;

          default:
            wikiRes = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${eco.url.replace(
                / /g,
                "_"
              )}?redirect=true`,
              {
                method: "GET",
                headers: {
                  "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
                },
              }
            );

            if (wikiRes.ok) {
              wiki = await wikiRes.json();
            } else {
              wiki = "error";
            }

            break;
        }

        return {
          props: {
            wiki:
              wiki === undefined || wiki.title === "Not found."
                ? null
                : JSON.parse(JSON.stringify(wiki)),

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
