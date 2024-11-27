import Link from "@components/layouts/Link";
import { Button, CircularProgress, Table, Typography } from "@mui/material";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import useSWR, { useSWRConfig } from "swr";
// Salt flats, Glacier, Inland water or ocean, Dunes or shifting sands, Rock debris or desert detritus
const DsmwSummary = ({ ecoFilter }) => {
  let wikiUrl;
  const { mutate } = useSWRConfig();

  if (ecoFilter && ecoFilter.layer === "dsmw" && ecoFilter.dominant_soil_name) {
    switch (ecoFilter.dominant_soil_name) {
      case null:
        wikiUrl = undefined;

        break;

      case undefined:
        wikiUrl = undefined;

        break;

      case "Salt flats":
        wikiUrl = `https://en.wikipedia.org/w/rest.php/v1/page/Salt_pan_(geology)/html?redirect=true`;
        break;

      case "Dunes or shifting sands":
        wikiUrl = `https://en.wikipedia.org/w/rest.php/v1/page/Dune/html?redirect=true`;
        break;

      case "Rock debris or desert detritus":
        wikiUrl = undefined;
        break;

      case "NITOSOLS":
        wikiUrl = `https://en.wikipedia.org/w/rest.php/v1/page/Nitisol/html?redirect=true`;
        break;

      case "PODZOLUVISOLS":
        wikiUrl = `https://en.wikipedia.org/w/rest.php/v1/page/Podzoluvisols/html?redirect=true`;
        break;

      case "RANKERS":
        wikiUrl = `https://en.wikipedia.org/w/rest.php/v1/page/Rankers/html?redirect=true`;
        break;

      default:
        // name equals ecoFilter.dominant_soil_name in all lowercase letters except the first letter is capitalized and if there is an s at the end then remove it
        const str = ecoFilter.dominant_soil_name;
        const name =
          str.charAt(0).toUpperCase() +
          (str.endsWith("S") ? str.slice(1, -1) : str.slice(1)).toLowerCase();

        wikiUrl = `https://en.wikipedia.org/w/rest.php/v1/page/${name}/html?redirect=true`;

        break;
    }
  }

  const wikipediaFetcher = async (url) => {
    const options = {
      method: "GET",
      headers: {
        "Api-User-Agent": "ecotenet (info@ecotenet.org)",
      },
    };

    const res = await fetch(url, options);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      } else {
        const error = new Error("An error occurred while fetching the data.");
        // Attach extra info to the error object.
        // error.info = await res.json();
        error.status = res.status;
        throw error;
      }
    }

    return res.text();
  };

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(wikiUrl ? wikiUrl : null, wikipediaFetcher, {
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
      {ecoFilter && ecoFilter.layer === "dsmw" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ marginTop: "20px", marginBottom: "15px" }}
            >
              {ecoFilter.dominant_soil_name &&
                ecoFilter.dominant_soil_name.charAt(0).toUpperCase() +
                  ecoFilter.dominant_soil_name.slice(1).toLowerCase()}
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
                  {!wikiUrl || results === null ? (
                    <Typography
                      variant="h6"
                      align="justify"
                      sx={{ marginTop: "20px" }}
                    >
                      We currently don&apos;t have a summary of this region. If
                      you want to help us out you can create a wikipedia page
                      for the region.
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ marginTop: "10px" }}>
                        Source:{" "}
                        <Link
                          href={wikiUrl && wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          Wikipedia
                        </Link>
                      </Typography>
                      {parse(DOMPurify.sanitize(results && results), options)}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Typography variant="h5" align="center" sx={{ marginTop: "20px" }}>
          Please select a region from the map or ecoregions tab to view a
          summary
        </Typography>
      )}
    </>
  );
};

export default DsmwSummary;
