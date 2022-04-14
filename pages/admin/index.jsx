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

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState("");

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

  const handleOpenDialog = (action) => {
    setDialog(true);
    setAction(action);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const { data: results, mutate } = useSWR("/api/getFeatures", fetcher);
  console.log(results);
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
      <>
        <Typography>Feature count: {results.length}</Typography>
        <List>
          {results.map((result) => {
            return (
              <>
                <ListItem key={result._id} className={classes.buttonpost}>
                  {/* <div className={classes.post}>
                  <Link>{result.name}</Link>

                  <ListItemText primary={result.title}></ListItemText>
                  <Typography variant="body1" color="textPrimary" align="left">
                    {result.date}
                  </Typography>
                </div>
                <Typography variant="h6" color="secondary" align="left">
                  {result.count}
                </Typography>
                <Link href={`/admin/posts/${result._id}`}>View Post</Link> */}
                  <Grid container spacing={1} className={classes.spacing}>
                    <Grid item xs={4} className={classes.text}>
                      <Link href="/privacy">{result.name}</Link>
                    </Grid>

                    <Grid item xs={4} className={classes.text}>
                      <Typography>Feature: {result.feature}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Link href={`/admin/posts/${result._id}`}>View Post</Link>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography>{result.title}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography>
                        Featured: {result.featured ? "True" : "False"}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      {result.feature == "true" ? (
                        <Button variant="outlined" color="secondary">
                          placeholder
                        </Button>
                      ) : (
                        <Button variant="outlined" color="secondary">
                          Add to Features
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography>{result.date}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      <Typography variant="h6" color="secondary">
                        {result.count}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.text}>
                      {result.feature !== "true" ? (
                        <Button variant="outlined" color="secondary">
                          Remove from List
                        </Button>
                      ) : (
                        <Button variant="outlined" color="secondary">
                          Add to Features
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
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>

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
