import {
  AppBar,
  Button,
  CircularProgress,
  Divider,
  Drawer,
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

import useSWR from "swr";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

import { useRouter } from "next/router";

import Header from "../../components/Header";

import { useState } from "react";
import { Alert } from "@material-ui/lab";

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
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  header: {
    marginTop: 20,
  },
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
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
  comment: {
    display: "flow-root",
    flexGrow: 1,
  },
  link: {
    color: theme.palette.secondary.light,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminFlags = () => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Comment submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (action) => {
    setDialog(true);
    setAction(action);
  };

  const handleResolve = async (ID) => {
    const flag = {
      _id: ID,
      status: "resolved",
    };

    const res = await fetch("/api/updateFlag", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flag),
    });

    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Flag resolved",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem resolving flag. Please try again later",
      });
    }
  };

  const { data: results, mutate } = useSWR("/api/getFlags", fetcher);

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        className={classes.progress}
      />
    );
  } else if (Array.isArray(results) && results.length == 0) {
    list = (
      <Typography variant="h6" align="center" className={classes.header}>
        no results
      </Typography>
    );
  } else {
    list = (
      <List>
        {results.map((result) => {
          return (
            <>
              <ListItem key={result._id} className={classes.buttonpost}>
                <div className={classes.comment}>
                  <Typography>
                    Flagged by: <Link>{result.name}</Link>
                  </Typography>
                  <Typography>Flag type: {result.type}</Typography>
                  <Typography>Flag text: {result.text}</Typography>
                  <Typography>
                    Name flagged: <Link>{result.flagged}</Link>
                  </Typography>
                </div>

                <div className={classes.buttonmobile}>
                  {result.type == "post" || result.type == "comment" ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={
                        result.type == "post"
                          ? `/admin/posts/${result.content_id}`
                          : `/admin/posts/${result.ref}?q=${result.content_id}`
                      }
                    >
                      View Post
                    </Button>
                  ) : (
                    <Button variant="outlined" color="secondary" disabled>
                      View Post
                    </Button>
                  )}

                  {result.type == "profile" ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpenDialog("Approve")}
                    >
                      View Profile
                    </Button>
                  ) : (
                    <Button variant="outlined" color="secondary" disabled>
                      View Profile
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.buttonup}
                    onClick={() => handleResolve(result._id)}
                  >
                    Resolve
                  </Button>
                </div>
              </ListItem>
            </>
          );
        })}
      </List>
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
        <Header title="Flags" />
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

export default adminFlags;
