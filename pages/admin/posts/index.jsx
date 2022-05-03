import {
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
} from "@material-ui/core";

import useSWR from "swr";

import { alpha, makeStyles } from "@material-ui/core/styles";

import { useRouter } from "next/router";

import { useState } from "react";
import { Alert } from "@material-ui/lab";
import Header from "../../../components/Header";
import AdminDrawer from "../../../components/AdminDrawer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
  buttonPost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  post: {
    display: "flow-root",
    flexGrow: 1,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminPosts = () => {
  const classes = useStyles();
  const router = useRouter();

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

  const { data: results } = useSWR(
    "/api/getAllPosts?q1=published&q2=pending",
    fetcher
  );

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
              <ListItem
                key={result._id}
                className={classes.buttonPost}
                button
                onClick={() => router.push(`/admin/posts/${result._id}`)}
              >
                <div className={classes.post}>
                  <Link>{result.name}</Link>

                  <ListItemText primary={result.title}></ListItemText>
                </div>

                <Link href={`/admin/posts/${result._id}`}>View Post</Link>
              </ListItem>
            </>
          );
        })}
      </List>
    );
  }

  return (
    <div className={classes.root}>
      <AdminDrawer />
      <div className={classes.content}>
        <Header title="Posts" />
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

export default adminPosts;
