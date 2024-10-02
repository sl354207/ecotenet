import Link from "@components/layouts/Link";
import { Button, CircularProgress, Table, Typography } from "@mui/material";
import fetcher from "@utils/fetcher";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import useSWR, { useSWRConfig } from "swr";

const EcoSummary = ({ wiki, setWiki, ecoFilter, isMobile }) => {
  let wikiUrl;
  const { mutate } = useSWRConfig();

  if (ecoFilter && ecoFilter.layer === "Ecoregions" && !wiki) {
    const res = fetch(`/api/ecoregions/${ecoFilter._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setWiki(data))
      .catch((error) => console.log(error));
  }

  if (wiki) {
    switch (wiki.url) {
      case undefined:
        const corrections = { " ": "_", "/": "%2F" };

        wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/segments/${wiki.name.replace(
          / |\//g,
          (matched) => corrections[matched]
        )}?redirect=true`;

        break;

      case "undefined":
        wikiUrl = undefined;

        break;

      default:
        wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/segments/${wiki.url.replace(
          / |\//g,
          (matched) => corrections[matched]
        )}?redirect=true`;
        break;
    }
  }

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(wiki ? wikiUrl : null, fetcher, {
    shouldRetryOnError: false,
  });

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
            // {...props}
            sx={{
              border: "thin solid",
              margin: { xs: "auto", md: "10px 0px 10px 0px" },
              float: { xs: "none", md: "right" },
              // width: "max-content",
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
      {ecoFilter && ecoFilter.layer === "Ecoregions" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginBottom: "15px", marginTop: isMobile ? 0 : 3 }}
              href={`/ecoregions/${ecoFilter._id}`}
            >
              view full page
            </Button>
            <Typography variant="h5" align="center">
              Eco-{ecoFilter._id}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ marginBottom: "15px" }}
            >
              {wiki && wiki.name}
            </Typography>
          </div>

          {isLoading ? (
            <CircularProgress
              color="secondary"
              size={50}
              disableShrink={true}
              sx={{
                margin: "10px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              {error ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(wikiUrl)}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {!wikiUrl ||
                  (results && results.title === "Not found.") ||
                  results === null ? (
                    <Typography
                      variant="h6"
                      align="justify"
                      sx={{ marginTop: "20px" }}
                    >
                      We currently don&apos;t have a summary of this ecoregion.
                      If you want to help us out you can create a wikipedia page
                      for the ecoregion.
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ marginTop: "10px" }}>
                        Source:{" "}
                        <Link
                          href={`https://en.wikipedia.org/wiki/${wiki.name.replace(
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
                      {parse(
                        DOMPurify.sanitize(results && results.segmentedContent),
                        options
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          {/* </>
          )} */}
        </>
      ) : (
        <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
          Please select an ecoregion from the map or ecoregions tab to view a
          summary
        </Typography>
      )}
    </>
  );
};

export default EcoSummary;
