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
import { checkLinks, loadToxicity } from "@utils/moderation";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import Pusher from "pusher-js";
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

  const [notifications, setNotifications] = useState(0);
  const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [pusher, setPusher] = useState();
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

        setModelLoading(false);
      }
    };
    loadModel();
    setPusher(
      new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      })
    );
  }, []);

  useEffect(() => {
    const moderate = async () => {
      if (model && modelLoading === false) {
        if (results && results.length > 0) {
          setModelLoading(true);
          for (const result of results) {
            let links = [];
            if (result.socials.length > 0) {
              links = result.socials;
            }
            if (result.website !== "") {
              links = [...links, result.website];
            }
            // console.log(links);
            if (links.length > 0) {
              try {
                handleCheckLinks(links);
              } catch (error) {
                console.log(error);
              }
            }
            // try {
            //   const toxic = await useToxicity(model, result.bio);

            //   if (toxic) {
            //     setToxicProfiles([...toxicProfiles, result]);
            //   } else {
            //     handleUpdatePerson(result, "true");
            //   }
            // } catch (error) {
            //   console.log(error);
            //   setModelLoading(false);
            // }
          }
          setModelLoading(false);
        }
      }
    };
    moderate();
    console.log(results);
  }, [results, model]);

  useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe("ecotenet");

      channel.bind("profile", () => {
        setNotifications(notifications + 1);
      });
      mutate("/api/admin/users");

      return () => {
        pusher.unsubscribe("ecotenet");
      };
    }
  }, [notifications]);

  const handleCheckLinks = async (links, result) => {
    try {
      const badLinks = await checkLinks(links);
      console.log(badLinks);
    } catch (error) {
      console.log(error);
      setToxicProfiles([...toxicProfiles, result]);
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
      setToxicProfiles([...toxicProfiles, result]);
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
            {toxicProfiles.length > 0 && (
              <List>
                {results.map((result) => {
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

                          <Typography>bio: {result.bio}</Typography>
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
