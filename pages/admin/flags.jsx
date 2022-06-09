import AdminDrawer from "@components/AdminDrawer";
import Resolve from "@components/dialogs/Resolve";
import Header from "@components/Header";
import {
  Button,
  CircularProgress,
  Link,
  List,
  ListItem,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { useState } from "react";
import useSWR from "swr";

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
  mobile: {
    display: "grid",
  },
  desktop: {
    marginTop: 4,
  },
  comment: {
    display: "flow-root",
    flexGrow: 1,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminFlags = () => {
  const classes = useStyles();

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ name: "", ID: "" });

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

  const handleOpenResolve = (name, ID) => {
    setDialog(true);
    setAction({ name: name, ID: ID });
  };

  const handleCloseResolve = () => {
    setDialog(false);
  };

  const { data: results, mutate } = useSWR("/api/admin/flags", fetcher);

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
              <ListItem key={result._id} className={classes.buttonPost}>
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

                <div className={classes.mobile}>
                  {result.type == "comment" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`/admin/posts/${result.ref}?q=${result.content_id}&flag=${result._id}&flagee=${result.name}`}
                    >
                      View Post
                    </Button>
                  )}
                  {result.type == "post" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`/admin/posts/${result.content_id}?q=flag&flag=${result._id}&flagee=${result.name}`}
                    >
                      View Post
                    </Button>
                  )}

                  {result.type == "profile" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`/admin/people/${result.flagged}?flag=${result._id}&flagee=${result.name}`}
                    >
                      View Profile
                    </Button>
                  )}
                  {result.type == "ecoregion" && (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`/ecoregions/${result.content_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Page
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.desktop}
                        onClick={() =>
                          handleOpenResolve(result.name, result._id)
                        }
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {result.type == "species" && (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`/species/${result.content_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Page
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.desktop}
                        onClick={() =>
                          handleOpenResolve(result.name, result._id)
                        }
                      >
                        Resolve
                      </Button>
                    </>
                  )}
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
      <AdminDrawer />
      <div className={classes.content}>
        <Header title="Flags" />
        {list}
        <Resolve
          open={dialog}
          handleClose={handleCloseResolve}
          name={action.name}
          ID={action.ID}
          setSnackbar={setSnackbar}
          mutate={mutate}
        />
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
