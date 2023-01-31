import { useSnackbarContext } from "@components/context/SnackbarContext";
import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import useSWR from "swr";

const admin = () => {
  const { snackbar, setSnackbar } = useSnackbarContext();

  const { data: stats } = useSWR("/api/admin/stats", fetcher);
  const { data: posts, mutate } = useSWR("/api/admin/posts", fetcher);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const updateFeature = async (action, post) => {
    switch (action) {
      case "addFeature":
        const submission = {
          _id: post._id,
          featured: true,
          feature: "true",
        };

        const res = await fetch(`/api/admin/posts/${post._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission),
        });

        if (res.ok) {
          const notify = {
            name: post.name,
            reason: "feature",
            text: "A post of yours was selected as a featured post",
            ref: post._id,
            date: new Date().toUTCString(),
            viewed: false,
          };

          const res1 = await fetch("/api/admin/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notify),
          });

          if (res1.ok) {
            if (mutate) {
              mutate();
            }

            setSnackbar({
              ...snackbar,
              open: true,
              severity: "success",
              message: "Feature added successfully",
            });
          }
          if (!res1.ok) {
            setSnackbar({
              ...snackbar,
              open: true,
              severity: "error",
              message:
                "There was a problem adding feature. Please try again later",
            });
          }
        }
        if (!res.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message:
              "There was a problem adding feature. Please try again later",
          });
        }
        break;
      case "removeFeature":
        const submission1 = {
          _id: post._id,
          featured: true,
          feature: "pending",
        };

        const res1 = await fetch(`/api/admin/posts/${post._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission1),
        });

        if (res1.ok) {
          mutate();
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message:
              "Feature removed successfully and has been put back on pending list",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message:
              "There was a problem submitting feature. Please try again later",
          });
        }
        break;
      case "removeList":
        const submission2 = {
          _id: post._id,
          featured: true,
          feature: "false",
        };

        const res2 = await fetch(`/api/admin/posts/${post._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission2),
        });

        if (res2.ok) {
          mutate();
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "success",
            message: "Feature removed from list",
          });
        }
        if (!res2.ok) {
          setSnackbar({
            ...snackbar,
            open: true,
            severity: "error",
            message:
              "There was a problem removing feature. Please try again later",
          });
        }
        break;

      default:
        break;
    }
  };

  let count = 0;

  let list;

  if (!posts || posts == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else if (Array.isArray(posts) && posts.length == 0) {
    list = (
      <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
        no results
      </Typography>
    );
  } else {
    for (const item of posts) {
      if (item.feature == "true") {
        count += 1;
      }
    }
    list = (
      <>
        <Typography>Feature count: {count}</Typography>
        <List>
          {posts.map((post) => {
            return (
              <>
                <ListItem
                  key={post._id}
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    textTransform: "none",
                    border: `1px solid ${theme.palette.secondary.main}`,
                    margin: "20px auto",
                    borderRadius: "10px",
                  }}
                >
                  <Grid container spacing={1} sx={{ marginTop: "20px" }}>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Link
                        href={`/admin/people/${post.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        {post.name}
                      </Link>
                    </Grid>

                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Typography>Current Feature: {post.feature}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Link
                        href={`/posts/${post._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        View Post
                      </Link>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Typography>{post.title}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Typography>
                        Featured Before: {post.featured ? "true" : "false"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      {post.feature == "true" ? (
                        <Button variant="outlined" color="secondary" disabled>
                          {isMobile ? (
                            <>
                              <AddIcon></AddIcon>
                            </>
                          ) : (
                            <>Add to Features</>
                          )}
                        </Button>
                      ) : (
                        <>
                          {count >= 10 ? (
                            <Button
                              variant="outlined"
                              color="secondary"
                              disabled
                            >
                              {isMobile ? (
                                <AddIcon></AddIcon>
                              ) : (
                                <>Add to Features</>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => updateFeature("addFeature", post)}
                            >
                              {isMobile ? (
                                <AddIcon></AddIcon>
                              ) : (
                                <>Add to Features</>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Typography>{post.date}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Typography variant="h6" color="secondary">
                        {post.count}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ textAlign: "center", alignSelf: "center" }}
                    >
                      {post.feature !== "true" ? (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => updateFeature("removeList", post)}
                          size={isMobile ? "small" : "medium"}
                        >
                          {isMobile ? <>Delist</> : <>Remove from List</>}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => updateFeature("removeFeature", post)}
                        >
                          {isMobile ? (
                            <RemoveIcon></RemoveIcon>
                          ) : (
                            <>Remove from Features</>
                          )}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
              </>
            );
          })}
        </List>
      </>
    );
  }
  let statSection;

  if (!stats || stats == undefined) {
    statSection = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    statSection = (
      <>
        <Typography align="center">Species: {stats.species}</Typography>
        <Typography align="center">People: {stats.people}</Typography>
        <Typography align="center">Posts: {stats.posts}</Typography>
        <Typography align="center">Comments: {stats.comments}</Typography>
        <Typography align="center">Flags: {stats.flags}</Typography>
      </>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminDrawer />
      <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
        <Header title="Stats" />
        {statSection}
        <Header title="Feature Candidates" />
        {list}
      </div>
    </div>
  );
};

export default admin;
