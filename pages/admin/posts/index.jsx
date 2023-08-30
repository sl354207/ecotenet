import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getTextContents } from "@react-page/editor";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

import customImage from "@plugins/customImage";
import customVideo from "@plugins/customVideo";
// The editor core
// import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-video/lib/index.css";
import { checkLinks, loadToxicity, useToxicity } from "@utils/moderation";
import { validURL } from "@utils/validationHelpers";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

const cellPlugins = [slate(), customImage, customVideo, spacer, divider];

const adminPosts = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const {
    data: results,
    isLoading,
    error,
  } = useSWR("/api/admin/posts?q1=published&q2=pending", fetcher, {
    shouldRetryOnError: false,
  });

  console.log(results);

  const [notifications, setNotifications] = useState(0);
  const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [pusher, setPusher] = useState();
  const [toxicPosts, setToxicPosts] = useState([]);

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
          let tempProfiles = [];

          for (const result of results) {
            result.toxic = [];

            try {
              const toxicTitle = await useToxicity(model, result.title);

              if (toxicTitle) {
                result.toxic.push("title");

                tempProfiles.push(result);
              }
            } catch (error) {
              console.log(error);
              tempProfiles.push(result);
              setModelLoading(false);
            }
            try {
              const toxicDescription = await useToxicity(
                model,
                result.description
              );

              if (toxicDescription) {
                result.toxic.push("description");

                tempProfiles.push(result);
              }
            } catch (error) {
              console.log(error);
              tempProfiles.push(result);
              setModelLoading(false);
            }
            if (result.tags.length > 0) {
              for (const tag of result.tags) {
                try {
                  const toxicTag = await useToxicity(model, tag);

                  if (toxicTag) {
                    result.toxic.push("tag");

                    tempProfiles.push(result);
                    break;
                  }
                } catch (error) {
                  console.log(error);
                  tempProfiles.push(result);
                  setModelLoading(false);
                }
              }
            }

            const textContents = getTextContents(result, {
              lang: "en",
              cellPlugins: cellPlugins,
            });
            if (textContents.length > 0) {
              for (const line of textContents) {
                try {
                  const toxicText = await useToxicity(model, line);

                  if (toxicText) {
                    result.toxic.push("text");

                    tempProfiles.push(result);
                    break;
                  }
                } catch (error) {
                  console.log(error);
                  tempProfiles.push(result);
                  setModelLoading(false);
                }
              }
            }
            // console.log(textContents);
            if (result.originalUrl && result.originalUrl !== "") {
              try {
                const toxicLink = await handleCheckLinks(
                  [result.originalUrl],
                  result
                );

                if (toxicLink) {
                  result.toxic.push("originalUrl");
                  tempProfiles.push(result);
                }
              } catch (error) {
                console.log(error);
                tempProfiles.push(result);
                setModelLoading(false);
              }
            }
            if (result.rows.length > 0) {
              const validLinks = [];
              for (const row of result.rows) {
                const postLinks = findPostLinks(row, []);
                for (const link of postLinks) {
                  if (validURL(link)) {
                    validLinks.push(link);
                  } else {
                    result.toxic.push("invalidLink");
                    tempProfiles.push(result);
                  }
                }
                // console.log(postLinks);
              }
              // console.log(validLinks);

              if (validLinks.length > 0) {
                // let validLinks = true;

                try {
                  const toxicLink = await handleCheckLinks(validLinks, result);

                  if (toxicLink) {
                    result.toxic.push("toxicLink");
                    tempProfiles.push(result);
                  }
                } catch (error) {
                  console.log(error);
                  tempProfiles.push(result);
                  setModelLoading(false);
                }
              }
            }
          }
          // contents.push(result.title, result.description, ...result.tags);
          setModelLoading(false);
          setToxicPosts(tempProfiles);
        }
        // let tempProfiles = [];
        // for (const result of results) {
        //   result.toxic = [];
        //   if (result.bio !== "") {
        //     try {
        //       const toxicBio = await useToxicity(model, result.bio);

        //       if (toxicBio) {
        //         result.toxic.push("bio");

        //         tempProfiles.push(result);
        //       }
        //     } catch (error) {
        //       console.log(error);
        //       tempProfiles.push(result);
        //       setModelLoading(false);
        //     }
        //   }
        //   let links = [];
        //   if (result.socials.length > 0) {
        //     links = result.socials;
        //   }
        //   if (result.website !== "") {
        //     links = [...links, result.website];
        //   }
        //   if (links.length > 0) {
        //     try {
        //       const toxicLink = await handleCheckLinks(links, result);

        //       if (toxicLink && !tempProfiles.includes(result)) {
        //         tempProfiles.push(result);
        //       }
        //     } catch (error) {
        //       console.log(error);
        //       tempProfiles.push(result);
        //       setModelLoading(false);
        //     }
        //   }
        //   if (result.toxic.length === 0) {
        //     handleUpdatePerson(result, "true");
        //   }
        // }
      }
    };

    moderate();
  }, [results, model]);

  useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe("ecotenet");

      channel.bind("post", () => {
        setNotifications(notifications + 1);
      });
      mutate("/api/admin/posts?q1=published&q2=pending");

      return () => {
        pusher.unsubscribe("ecotenet");
      };
    }
  }, [notifications]);

  const handleCheckLinks = async (links, result) => {
    try {
      const badLinks = await checkLinks(links);

      if (Object.keys(badLinks).length > 0) {
        return result;
      }
    } catch (error) {
      console.log(error);

      throw new Error("failed to check links");
    }
  };

  const findPostLinks = (obj, arr) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value === "LINK/LINK" && !arr.includes(obj.data.href)) {
        arr.push(obj.data.href);
      }

      if (typeof value === "object" && value !== null) {
        findPostLinks(value, arr);
      }
    });

    return arr;
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
            onClick={() => mutate("/api/admin/posts?q1=published&q2=pending")}
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
            {toxicPosts.length > 0 && (
              <List>
                {toxicPosts.map((result) => {
                  return (
                    <>
                      <ListItemButton
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
                        onClick={() =>
                          router.push(`/admin/posts/${result._id}`)
                        }
                      >
                        <div style={{ display: "flow-root", flexGrow: 1 }}>
                          <Link
                            href={`/admin/people/${result.name}`}
                            underline="hover"
                          >
                            {result.name}
                          </Link>

                          <ListItemText primary={result.title}></ListItemText>
                          {result.toxic.length > 0 && (
                            <Typography>
                              toxic:{" "}
                              {result.toxic.map((reason) => (
                                <>{reason}, </>
                              ))}
                            </Typography>
                          )}
                        </div>

                        <Link
                          href={`/admin/posts/${result._id}`}
                          underline="hover"
                        >
                          View Post
                        </Link>
                      </ListItemButton>
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
        title="Posts"
        titleTemplate="Posts"
      />
      <div style={{ display: "flex" }}>
        <AdminDrawer />
        <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
          <Header title="Posts" />
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            Moderating: {modelLoading ? "True" : "False"}
          </Typography>
          {list}
        </div>
      </div>
    </>
  );
};

export default adminPosts;
