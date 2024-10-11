import { useUserContext } from "@components/context/UserContext";
import Link from "@components/layouts/Link";
import FlagIcon from "@mui/icons-material/Flag";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  Table,
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
import useSWR, { useSWRConfig } from "swr";

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});
const DynamicTiedPostDialog = dynamic(
  () => import("@components/dialogs/TiedPostDialog"),
  {
    ssr: false,
  }
);
const DrawerSpecies = ({ species, ecoFilter }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { mutate } = useSWRConfig();

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

  const {
    data: wiki,
    isLoading,
    error,
  } = useSWR(
    species
      ? `https://en.wikipedia.org/api/rest_v1/page/segments/${species.scientific_name.replace(
          / /g,
          "_"
        )}?redirect=true`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const [toggleObservedEcoregions, setToggleObservedEcoregions] =
    useState(false);
  const [toggleNativeEcoregions, setToggleNativeEcoregions] = useState(false);

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
              // margin: { xs: "auto", md: "0px 0px 0px 10px" },
              margin: { xs: "auto", md: "10px 0px 10px 0px" },
              // float: { xs: "none", md: "right" },
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
            // {...props}
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
    <Container>
      {isLoading ? (
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
                onClick={() =>
                  mutate(
                    `https://en.wikipedia.org/api/rest_v1/page/segments/${species.scientific_name.replace(
                      / /g,
                      "_"
                    )}?redirect=true`
                  )
                }
              >
                Error Loading. Retry
              </Button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginBlock: "15px" }}
                  href={`/species/${species.scientific_name.replace(
                    / /g,
                    "_"
                  )}`}
                >
                  view full page
                </Button>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      visibility: "hidden",
                      minWidth: "30px",
                    }}
                  ></div>
                  {species.common_name ? (
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ marginBottom: "5px" }}
                    >
                      {species.scientific_name}: {species.common_name}
                    </Typography>
                  ) : (
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ marginBottom: "5px" }}
                    >
                      {species.scientific_name}
                    </Typography>
                  )}

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
              {ecoFilter && ecoFilter.layer === "feow" ? (
                <Typography variant="body1">
                  {species &&
                  species.freshwater_ecoregions &&
                  species.freshwater_ecoregions.length > 0
                    ? "Freshwater Ecoregions:"
                    : "Currently no freshwater ecoregions listed."}
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
                      {species.freshwater_ecoregions.map(
                        (id) => `FEOW-${id}, `
                      )}
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
              ) : (
                <>
                  <Typography variant="body1">
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
                      <Typography variant="body1">
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginTop: "5px" }}
                    onClick={() => {
                      setTiedPostDialog(true);
                    }}
                  >
                    Tied Posts
                  </Button>
                </>
              )}

              <div
                style={{
                  flexGrow: 1,
                  backgroundColor: theme.palette.light,
                  borderRadius: "10px",
                }}
              >
                {!wiki || wiki.title === "Not found." ? (
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
                    <Typography variant="h6" sx={{ marginTop: "5px" }}>
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
              </div>
              <Divider sx={{ marginBlock: "20px" }} />
              <Typography variant="h5">Additional Resources</Typography>
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
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default DrawerSpecies;
