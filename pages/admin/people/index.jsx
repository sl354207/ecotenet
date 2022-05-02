import {
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
} from "@material-ui/core";

import useSWR from "swr";

import { alpha, makeStyles } from "@material-ui/core/styles";

import { useRouter } from "next/router";

import Header from "../../../components/Header";

import { useState } from "react";
import { Alert } from "@material-ui/lab";
import AdminDialog from "../../../components/dialogs/AdminDialog";

const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  paper: {
    width: drawerWidth,
    zIndex: 0,
  },
  container: {
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
  mobile: {
    display: "grid",
  },
  desktop: {
    marginTop: 4,
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
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminPeople = () => {
  const classes = useStyles();
  const router = useRouter();

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

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

  const handleOpenDialog = (action, type, result) => {
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const { data: results, mutate } = useSWR("/api/getPeople", fetcher);

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
                  <Link>{result.name}</Link>

                  <Typography>bio: {result.bio}</Typography>
                  <Typography>email: {result.email}</Typography>
                  <Typography>
                    website:{" "}
                    <Link target="_blank" rel="noopener noreferrer">
                      {result.website}
                    </Link>
                  </Typography>
                  <Typography>
                    socials:{" "}
                    {result.socials.map((social) => (
                      <>
                        <Link target="_blank" rel="noopener noreferrer">
                          {social}
                        </Link>
                        ,{" "}
                      </>
                    ))}
                  </Typography>

                  <Typography>denials: {result.denials}</Typography>
                </div>

                <div className={classes.mobile}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleOpenDialog("Approve", "person", result)
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.desktop}
                    onClick={() => handleOpenDialog("Deny", "person", result)}
                  >
                    Deny
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={`${classes.desktop} ${classes.delete}`}
                    onClick={() => handleOpenDialog("Delete", "person", result)}
                  >
                    Delete
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
          paper: classes.paper,
        }}
      >
        <Toolbar />
        <div className={classes.container}>
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
        <Header title="People" />
        {list}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          className={classes.dialog}
          result={item}
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

export default adminPeople;