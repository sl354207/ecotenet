import {
  AppBar,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

import { useRouter } from "next/router";
import Header from "../../components/Header";
import { Alert } from "@material-ui/lab";
import { useState } from "react";
import useSWR from "swr";

const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    zIndex: 0,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  header: {
    marginTop: 20,
  },
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${theme.palette.secondary.main}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  buttonmobile: {
    display: "grid",
  },
  buttonup: {
    marginTop: 4,
  },
  button: {
    marginLeft: 4,
  },
  delete: {
    color: "#fc7ebf",
    borderColor: "#fc7ebf",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  post: {
    display: "flow-root",
    flexGrow: 1,
  },
  spacing: {
    marginTop: 20,
  },
  text: {
    textAlign: "center",
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const Admin = () => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [featureCount, setFeatureCount] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const { data: stats } = useSWR("/api/getStats", fetcher);
  const { data: posts, mutate } = useSWR("/api/getFeatures", fetcher);
  // console.log(posts);
  const updateFeature = async (action, post) => {
    switch (action) {
      case "addFeature":
        const submission = {
          title: post.title,
          description: post.description,
          category: post.category,
          tags: post.tags,
          ecoregions: post.ecoregions,
          _id: post._id,
          id: post.id,
          version: post.version,
          rows: post.rows,
          status: post.status,
          approved: post.approved,
          updated: post.updated,
          featured: true,
          date: post.date,
          feature: "true",
        };

        const res = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission),
        });

        if (res.ok) {
          mutate();
          setSnackbar({
            open: true,
            severity: "success",
            message: "Feature added successfully",
          });
        }
        if (!res.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem submitting post. Please try again later",
          });
        }
        break;
      case "removeFeature":
        const submission1 = {
          title: post.title,
          description: post.description,
          category: post.category,
          tags: post.tags,
          ecoregions: post.ecoregions,
          _id: post._id,
          id: post.id,
          version: post.version,
          rows: post.rows,
          status: post.status,
          approved: post.approved,
          updated: post.updated,
          featured: true,
          date: post.date,
          feature: "pending",
        };

        const res1 = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission1),
        });

        if (res1.ok) {
          mutate();
          setSnackbar({
            open: true,
            severity: "success",
            message:
              "Feature removed successfully and has been put back on pending list",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem submitting post. Please try again later",
          });
        }
        break;
      case "removeList":
        const submission2 = {
          title: post.title,
          description: post.description,
          category: post.category,
          tags: post.tags,
          ecoregions: post.ecoregions,
          _id: post._id,
          id: post.id,
          version: post.version,
          rows: post.rows,
          status: post.status,
          approved: post.approved,
          updated: post.updated,
          featured: true,
          date: post.date,
          feature: "false",
        };

        const res2 = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission2),
        });

        if (res2.ok) {
          mutate();
          setSnackbar({
            open: true,
            severity: "success",
            message: "Feature removed from list",
          });
        }
        if (!res2.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem submitting post. Please try again later",
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
        className={classes.progress}
      />
    );
  } else if (Array.isArray(posts) && posts.length == 0) {
    list = (
      <Typography variant="h6" align="center" className={classes.header}>
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
                <ListItem key={post._id} className={classes.buttonpost}>
                  <Grid container spacing={1} className={classes.spacing}>
                    <Grid item xs={4} className={classes.text}>
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.name}
                      </Link>
                    </Grid>

                    <Grid item xs={4} className={classes.text}>
                      <Typography>Current Feature: {post.feature}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Link
                        href={`/posts/${post._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Post
                      </Link>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography>{post.title}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography>
                        Featured Before: {post.featured ? "true" : "false"}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      {post.feature == "true" ? (
                        <Button variant="outlined" color="secondary" disabled>
                          Add to Features
                        </Button>
                      ) : (
                        <>
                          {count >= 10 ? (
                            <Button
                              variant="outlined"
                              color="secondary"
                              disabled
                            >
                              Add to Features
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => updateFeature("addFeature", post)}
                            >
                              Add to Features
                            </Button>
                          )}
                        </>
                      )}
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography>{post.date}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography variant="h6" color="secondary">
                        {post.count}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      {post.feature !== "true" ? (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => updateFeature("removeList", post)}
                        >
                          Remove from List
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => updateFeature("removeFeature", post)}
                        >
                          Remove from Features
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
        className={classes.progress}
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
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button key="home" onClick={() => router.push("/admin")}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              key="people"
              onClick={() => router.push("/admin/people")}
            >
              <ListItemText primary="People" />
            </ListItem>
            <ListItem
              button
              key="posts"
              onClick={() => router.push("/admin/posts")}
            >
              <ListItemText primary="Posts" />
            </ListItem>
            <ListItem
              button
              key="comments"
              onClick={() => router.push("/admin/comments")}
            >
              <ListItemText primary="Comments" />
            </ListItem>
            <ListItem
              button
              key="flags"
              onClick={() => router.push("/admin/flags")}
            >
              <ListItemText primary="Flags" />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
      <div className={classes.content}>
        <Header title="Stats" />
        {statSection}
        <Header title="Feature Candidates" />
        {list}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Admin;
