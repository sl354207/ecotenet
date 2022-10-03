import { Typography } from "@mui/material";
import theme from "@utils/theme";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import useSWR from "swr";
import Header from "./Header";
import Link from "./Link";

const fetcher = (url) => fetch(url).then((r) => r.json());

const EcoSummary = ({ wiki, setWiki, ecoFilter }) => {
  let wikiUrl;

  if (ecoFilter && !wiki) {
    const res = fetch(`/api/ecoregions/${ecoFilter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setWiki(data));
  }

  if (wiki) {
    switch (wiki.url) {
      case undefined:
        wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${wiki.name.replace(
          " ",
          "_"
        )}?redirect=true`;

        break;

      case "undefined":
        wikiUrl = undefined;

        break;

      default:
        wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${wiki.url.replace(
          " ",
          "_"
        )}?redirect=true`;
        break;
    }
  }

  const { data: results } = useSWR(wiki ? wikiUrl : null, fetcher);
  // console.log(results);
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
      <div
        style={{
          // display: "flex",
          justifyContent: "center",
        }}
      >
        <Header title={`Eco-${ecoFilter} `} sx={{ marginBottom: "40px" }} />
        <Typography variant="h4" align="center">
          {wiki && wiki.name}
        </Typography>
      </div>

      {!wikiUrl || (results && results.title == "Not found.") ? (
        <Typography variant="h6" align="justify" sx={{ marginTop: "20px" }}>
          We currently don't have a summary of this ecoregion. If you want to
          help us out you can create a wikipedia page for the ecoregion.
        </Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ marginTop: "10px" }}>
            Source:{" "}
            <Link
              href={`https://en.wikipedia.org/wiki/${wiki.name.replace(
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
            DOMPurify.sanitize(results && results.lead.sections[0].text),
            options
          )}
          {results &&
            results.remaining.sections.map((section) => {
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
        </>
      )}
      {/* </>
      )} */}
    </>
  );
};

export default EcoSummary;
