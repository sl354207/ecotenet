import AdminDialog from "@components/dialogs/AdminDialog";
import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { updateComment } from "@utils/apiHelpers";
import fetcher from "@utils/fetcher";
import { loadToxicity, useToxicity } from "@utils/moderation";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const adminComments = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { mutate } = useSWRConfig();

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

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
  } = useSWR("/api/admin/comments", fetcher, {
    shouldRetryOnError: false,
  });

  const [model, setModel] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [toxicComments, setToxicComments] = useState([]);

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
          let tempComments = [];
          for (const result of results) {
            try {
              const toxic = await useToxicity(model, result.text);

              if (toxic) {
                if (!tempComments.includes(result)) {
                  tempComments.push(result);
                }
              } else {
                handleUpdateComment(result, "true");
              }
            } catch (error) {
              console.log(error);
              setModelError(true);
              setModelLoading(false);
            }
          }
          setModelLoading(false);
          setToxicComments(tempComments);
        }
      } else {
        setToxicComments(results);
      }
    };
    moderate();
  }, [results, model]);

  const handleUpdateComment = async (result, approved) => {
    const submission = {
      id: result._id,
      approved: approved,
    };

    const commentResponse = await updateComment(submission, "admin");
    if (!commentResponse.ok) {
      setToxicComments([...toxicComments, result]);
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
            onClick={() => mutate("/api/admin/comments")}
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
            {!modelLoading && toxicComments && toxicComments.length > 0 && (
              <List>
                {toxicComments.map((result) => {
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

                          <ListItemText primary={result.text}></ListItemText>
                          <Link
                            href={`/posts/${result.post_id}`}
                            underline="hover"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {result.post_id}
                          </Link>
                        </div>

                        {isMobile ? (
                          <div style={{ display: "grid" }}>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() =>
                                handleOpenDialog("Approve", "Comment", result)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              sx={{ marginTop: "4px" }}
                              onClick={() =>
                                handleOpenDialog("Deny", "Comment", result)
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
                                handleOpenDialog("Delete", "Comment", result)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() =>
                                handleOpenDialog("Approve", "Comment", result)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              sx={{ marginLeft: "4px" }}
                              onClick={() =>
                                handleOpenDialog("Deny", "Comment", result)
                              }
                            >
                              Deny
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              sx={{
                                marginLeft: "4px",
                                marginTop: "4px",
                                color: "#fc7ebf",
                                borderColor: "#fc7ebf",
                              }}
                              onClick={() =>
                                handleOpenDialog("Delete", "Comment", result)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        )}
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
        title="Comments"
        titleTemplate="Comments"
      />
      <div style={{ display: "flex" }}>
        <AdminDrawer />
        <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
          <Header title="Comments" />
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

export default adminComments;
