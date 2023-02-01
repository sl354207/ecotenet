import { useUserContext } from "@components/context/UserContext";
import Link from "@components/layouts/Link";
import FlagIcon from "@mui/icons-material/Flag";
import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"));
const DrawerSpecies = ({ species }) => {
  const router = useRouter();
  const { user } = useUserContext();

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
  // console.log(species);
  const { data: wiki } = useSWR(
    species
      ? `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${
          species.scientific_name.toLowerCase().split(" ")[0]
        }_${species.scientific_name.toLowerCase().split(" ")[1]}?redirect=true`
      : null,
    fetcher
  );

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
    <Container>
      {wiki ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginBlock: "15px" }}
              href={`/species/${species._id}`}
            >
              view full page
            </Button>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  marginRight: "auto",
                  visibility: "hidden",
                  minWidth: "30px",
                }}
              ></div>
              <Typography
                variant="h4"
                align="center"
                sx={{ marginBottom: "5px" }}
              >
                {species.scientific_name}: {species.common_name}
              </Typography>
              <div>
                <IconButton
                  sx={{ marginLeft: 2 }}
                  color="inherit"
                  aria-label="flag"
                  size="small"
                  onClick={() => handleOpenDialog()}
                >
                  <FlagIcon />
                </IconButton>
              </div>
            </div>
          </div>

          <Typography
            variant="h6"
            sx={{
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
              backgroundColor: theme.palette.light,
              borderRadius: "10px",
            }}
          >
            {!wiki || wiki.title == "Not found." ? (
              <Typography
                variant="h6"
                align="justify"
                sx={{ marginTop: "20px" }}
              >
                We currently don&apos;t have a summary of this species. If you
                want to help us out you can create a wikipedia page for the
                species.
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
                {parse(DOMPurify.sanitize(wiki.lead.sections[0].text), options)}
                {wiki.remaining.sections.map((section, index) => {
                  if (section.anchor == "Gallery") {
                    return <></>;
                  } else if (section.toclevel == 2) {
                    return (
                      <>
                        <h2 key={index}>{section.line}</h2>
                        {parse(DOMPurify.sanitize(section.text), options)}
                      </>
                    );
                  } else {
                    return (
                      <>
                        <h1 key={index}>{section.line}</h1>
                        {parse(DOMPurify.sanitize(section.text), options)}
                      </>
                    );
                  }
                })}
              </>
            )}
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
        </>
      ) : (
        <CircularProgress
          color="secondary"
          size={50}
          disableShrink={true}
          sx={{
            margin: "100px auto",
            display: "flex",
            justifySelf: "center",
          }}
        />
      )}
    </Container>
  );
};

export default DrawerSpecies;
