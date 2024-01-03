import AdminDialog from "@components/dialogs/AdminDialog";
import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { updateUser } from "@utils/apiHelpers";
import fetcher from "@utils/fetcher";
import { checkLinks, loadToxicity, useToxicity } from "@utils/moderation";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const adminPeople = () => {
  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const { mutate } = useSWRConfig();

  const handleOpenDialog = (action, type, result) => {
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const {
    data: results,
    isLoading,
    error,
  } = useSWR("/api/admin/users", fetcher, {
    shouldRetryOnError: false,
  });

  const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [toxicProfiles, setToxicProfiles] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      try {
        const model = await loadToxicity(0.7);

        if (model) {
          setModel(model);
          setModelLoading(false);
        }
      } catch (error) {
        console.log(error);
        setModelError(true);
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    const moderate = async () => {
      if (model && modelLoading === false) {
        if (results && results.length > 0) {
          setModelLoading(true);
          let tempProfiles = [];
          for (const result of results) {
            result.toxic = [];
            if (result.bio !== "") {
              try {
                const toxicBio = await useToxicity(model, result.bio);

                if (toxicBio) {
                  result.toxic.push("bio");
                  if (!tempProfiles.includes(result)) {
                    tempProfiles.push(result);
                  }
                }
              } catch (error) {
                console.log(error);
                if (!tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
                setModelError(true);
                setModelLoading(false);
              }
            }

            if (result.socials.length > 0) {
              const socialLinks = result.socials;
              try {
                const toxicLink = await handleCheckLinks(socialLinks, result);

                if (toxicLink && !tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
              } catch (error) {
                console.log(error);
                socialLinks.forEach((link) => {
                  result.toxic.push(link);
                });
                if (!tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
                setModelLoading(false);
              }
            }
            if (result.website !== "") {
              try {
                const toxicLink = await handleCheckLinks(
                  [result.website],
                  result
                );

                if (toxicLink && !tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
              } catch (error) {
                console.log(error);

                result.toxic.push(result.website);

                if (!tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
                setModelLoading(false);
              }
            }

            if (result.toxic.length === 0) {
              try {
                handleUpdatePerson(result, "true");
              } catch (error) {
                console.log(error);
                if (!tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
              }
            }
          }

          setModelLoading(false);
          setToxicProfiles(tempProfiles);
        }
      } else {
        setToxicProfiles(results);
      }
    };
    moderate();
  }, [results, model]);

  const handleCheckLinks = async (links, result) => {
    try {
      const badLinks = await checkLinks(links);

      if (badLinks.error) {
        links.forEach((link) => {
          result.toxic.push(link);
        });
      } else if (badLinks.matches) {
        badLinks.matches.forEach((match) => {
          result.toxic.push(match.threat.url);
        });
      }

      return result;
    } catch (error) {
      throw new Error("Failed to handle links");
    }
  };

  const handleUpdatePerson = async (result, approved) => {
    const submission = {
      name: result.name,
      email: result.email,
      approved: approved,
    };

    const userResponse = await updateUser(submission, "admin");
    if (!userResponse.ok) {
      throw new Error("failed to update user");
    }
  };

  let list;

  if (isLoading) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    if (error) {
      list = (
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
            onClick={() => mutate("/api/admin/users")}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(results) && results.length === 0) {
        list = (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        );
      } else {
        list = (
          <>
            {!modelLoading && toxicProfiles && toxicProfiles.length > 0 && (
              <List>
                {toxicProfiles.map((result) => {
                  return (
                    <>
                      <ListItem
                        key={result._id}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          textTransform: "none",
                          border: `1px solid ${alpha(
                            theme.palette.secondary.main,
                            1
                          )}`,
                          margin: "20px auto",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flow-root", flexGrow: 1 }}>
                          <Link
                            href={`/admin/people/${result.name}`}
                            underline="hover"
                          >
                            {result.name}
                          </Link>

                          <Typography
                            sx={{
                              border:
                                result &&
                                result.toxic &&
                                result.toxic.includes("bio")
                                  ? `1px solid ${theme.palette.error.main}`
                                  : "none",
                            }}
                          >
                            bio: {result.bio}
                          </Typography>
                          <Typography sx={{ overflowWrap: "anywhere" }}>
                            email: {result.email}
                          </Typography>
                          <Typography>
                            website:{" "}
                            <Link
                              href={result.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                border:
                                  result &&
                                  result.toxic &&
                                  result.toxic.includes(result.website)
                                    ? `1px solid ${theme.palette.error.main}`
                                    : "none",
                              }}
                            >
                              {result.website}
                            </Link>
                          </Typography>
                          <Typography>
                            socials:{" "}
                            {result.socials.map((social) => (
                              <>
                                <Link
                                  href={social}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                  sx={{
                                    border:
                                      result &&
                                      result.toxic &&
                                      result.toxic.includes(social)
                                        ? `1px solid ${theme.palette.error.main}`
                                        : "none",
                                  }}
                                >
                                  {social}
                                </Link>
                                ,{" "}
                              </>
                            ))}
                          </Typography>

                          <Typography>denials: {result.denials}</Typography>
                        </div>

                        <div style={{ display: "grid" }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              handleOpenDialog("Approve", "Person", result)
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ marginTop: "4px" }}
                            onClick={() =>
                              handleOpenDialog("Deny", "Person", result)
                            }
                          >
                            Deny
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            sx={{
                              marginTop: "4px",
                              color: "#fc7ebf",
                              borderColor: "#fc7ebf",
                            }}
                            onClick={() =>
                              handleOpenDialog("Delete", "Person", result)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </ListItem>
                    </>
                  );
                })}
              </List>
            )}
          </>
        );
      }
    }
  }

  return (
    <>
      <NextSeo
        noindex={true}
        nofollow={true}
        title="People"
        titleTemplate="People"
      />
      <div style={{ display: "flex" }}>
        <AdminDrawer />
        <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
          <Header title="People" />
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            Moderating: {modelLoading ? "True" : "False"}
          </Typography>
          {modelError && (
            <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
              Model Error
            </Typography>
          )}
          {list}
          <AdminDialog
            contentType={action.type}
            action={action.action}
            open={dialog}
            handleClose={handleCloseDialog}
            result={item}
            mutate={mutate}
          />
        </div>
      </div>
    </>
  );
};

export default adminPeople;
