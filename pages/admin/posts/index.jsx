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
import { updatePost } from "@utils/apiHelpers";
import {
  checkLinks,
  loadImageClassifier,
  loadToxicity,
  useImageClassifier,
  useToxicity,
} from "@utils/moderation";
import {
  validImagePluginURL,
  validURL,
  validVideoPluginURL,
} from "@utils/validationHelpers";
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

  const [textModel, setTextModel] = useState();
  const [imageModel, setImageModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [toxicPosts, setToxicPosts] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      try {
        const textModel = await loadToxicity(0.7);
        const imageModel = await loadImageClassifier();

        if (textModel) {
          setTextModel(textModel);
          setModelLoading(false);
        }
        if (imageModel) {
          setImageModel(imageModel);
          setModelLoading(false);
        }
      } catch (error) {
        console.log(error);
        setModelError(true);
        setModelLoading(false);
      }
    };
    loadModel();

    // THINK ABOUT IF MODEL DOESN'T LOAD
  }, []);

  useEffect(() => {
    const moderate = async () => {
      if (
        textModel &&
        imageModel &&
        modelLoading === false &&
        modelError === false
      ) {
        if (results && results.length > 0) {
          setModelLoading(true);
          let tempProfiles = [];

          for (const result of results) {
            result.toxic = [];

            try {
              const toxicTitle = await useToxicity(textModel, result.title);

              if (toxicTitle) {
                result.toxic.push("title");

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
            try {
              const toxicDescription = await useToxicity(
                textModel,
                result.description
              );

              if (toxicDescription) {
                result.toxic.push("description");

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
            if (result.tags.length > 0) {
              for (const tag of result.tags) {
                try {
                  const toxicTag = await useToxicity(textModel, tag);

                  if (toxicTag) {
                    result.toxic.push("tag");

                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                    break;
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
            }

            const textContents = getTextContents(result, {
              lang: "en",
              cellPlugins: cellPlugins,
            });
            if (textContents.length > 0) {
              for (const line of textContents) {
                try {
                  const toxicText = await useToxicity(textModel, line);

                  if (toxicText) {
                    result.toxic.push("text");

                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                    break;
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
            }

            if (result.originalUrl && result.originalUrl !== "") {
              if (!validURL(result.originalUrl)) {
                result.toxic.push("invalidOriginalUrl");
                if (!tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
              } else {
                try {
                  const toxicLink = await handleCheckLinks(
                    [result.originalUrl],
                    result
                  );

                  if (toxicLink) {
                    result.toxic.push("toxicOriginalUrl");
                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                  }
                } catch (error) {
                  console.log(error);
                  result.toxic.push("toxicOriginalUrl");
                  if (!tempProfiles.includes(result)) {
                    tempProfiles.push(result);
                  }
                  setModelLoading(false);
                }
              }
            }
            if (result.rows.length > 0) {
              const validLinks = [];
              const validPhotos = [];
              const validVideos = [];
              for (const row of result.rows) {
                const postLinks = findPostLinks(row, []);

                for (const link of postLinks) {
                  if (validURL(link)) {
                    validLinks.push(link);
                  } else {
                    result.toxic.push("invalidLink");
                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                  }
                }

                const postPhotos = findPostPhotos(row, []);
                if (postPhotos.length > 0) {
                  result.toxic.push("photo");
                  if (!tempProfiles.includes(result)) {
                    tempProfiles.push(result);
                  }
                }
                for (const link of postPhotos) {
                  if (validImagePluginURL(link)) {
                    validPhotos.push(link);
                  } else {
                    result.toxic.push("invalidPhoto");
                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                  }
                }
                const postVideos = findPostVideoUrls(row, []);
                for (const link of postVideos) {
                  if (validVideoPluginURL(link)) {
                    validVideos.push(link);
                  } else {
                    result.toxic.push("invalidVideo");
                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                  }
                }
              }

              if (validLinks.length > 0) {
                try {
                  const toxicLink = await handleCheckLinks(validLinks, result);

                  if (toxicLink) {
                    result.toxic.push("toxicLink");
                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                  }
                } catch (error) {
                  console.log(error);
                  result.toxic.push("toxicLink");
                  if (!tempProfiles.includes(result)) {
                    tempProfiles.push(result);
                  }
                  setModelLoading(false);
                }
              }
              if (validPhotos.length > 0) {
                for (const link of validPhotos) {
                  try {
                    const toxicPhoto = await handleCheckPhoto(link);

                    if (toxicPhoto) {
                      result.toxic.push("toxicPhoto");
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
              }
              if (validVideos.length > 0) {
                try {
                  const toxicLink = await handleCheckLinks(validVideos, result);

                  if (toxicLink) {
                    result.toxic.push("toxicVideoLink");
                    if (!tempProfiles.includes(result)) {
                      tempProfiles.push(result);
                    }
                  }
                } catch (error) {
                  console.log(error);
                  result.toxic.push("toxicVideoLink");
                  if (!tempProfiles.includes(result)) {
                    tempProfiles.push(result);
                  }
                  setModelLoading(false);
                }
              }
            }
            if (result.toxic.length === 0) {
              try {
                handleUpdatePost(result, "true");
              } catch (error) {
                console.log(error);
                if (!tempProfiles.includes(result)) {
                  tempProfiles.push(result);
                }
              }
            }
          }

          setModelLoading(false);
          setToxicPosts(tempProfiles);
        }
      } else {
        setToxicPosts(results);
      }
    };

    moderate();
  }, [results, textModel, imageModel]);

  const handleCheckLinks = async (links, result) => {
    try {
      const badLinks = await checkLinks(links);

      if (badLinks.matches || badLinks.error) {
        return result;
      } else {
        return false;
      }

      // if (Object.keys(badLinks).length > 0) {
      //   return result;
      // }
    } catch (error) {
      console.log(error);

      throw new Error("failed to handle links");
    }
  };

  const handleCheckPhoto = async (url) => {
    try {
      const img = await loadImage(url);

      const inappropriateImage = await useImageClassifier(imageModel, img);

      return inappropriateImage;
    } catch (error) {
      console.log(error);

      throw new Error("failed to check photo");
    }
  };

  const loadImage = (path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // to avoid CORS if used with Canvas
      img.src = path;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
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
  const findPostPhotos = (obj, arr) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        obj.plugin &&
        obj.plugin.id === "customImage" &&
        !arr.includes(obj.dataI18n.default.image.url)
      ) {
        arr.push(obj.dataI18n.default.image.url);
      }

      if (typeof value === "object" && value !== null) {
        findPostPhotos(value, arr);
      }
    });

    return arr;
  };
  const findPostVideoUrls = (obj, arr) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        obj.plugin &&
        obj.plugin.id === "customVideo" &&
        !arr.includes(obj.dataI18n.default.src)
      ) {
        arr.push(obj.dataI18n.default.src);
      }

      if (typeof value === "object" && value !== null) {
        findPostVideoUrls(value, arr);
      }
    });

    return arr;
  };

  const handleUpdatePost = async (result, approved) => {
    const submission = {
      _id: result._id,
      approved: approved,
      feature: "false",
    };

    const postResponse = await updatePost(submission, "admin");

    if (!postResponse.ok) {
      throw new Error("failed to update post");
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
            {!modelLoading && toxicPosts && toxicPosts.length > 0 && (
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
                          {result &&
                            result.toxic &&
                            result.toxic.length > 0 && (
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
          {modelError && (
            <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
              Model Error
            </Typography>
          )}
          {list}
        </div>
      </div>
    </>
  );
};

export default adminPosts;
