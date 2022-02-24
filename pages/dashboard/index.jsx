import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Link,
  Container,
  List,
  ListItem,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputBase,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

// taken directly from material ui tabs example
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    // fontSize: 20,
    // maxWidth: 40,

    // [theme.breakpoints.down("xs")]: {
    //   fontSize: 10,
    // },
    borderRadius: "10px",
  },
  tabbar: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: "10px",
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
  },
  ecoregions: {
    marginBottom: 20,
  },
  tab: {
    // fontSize: 18,
    // minWidth: 65,
    flexGrow: 1,
    backgroundColor: theme.palette.primary.light,
    minHeight: 80,
    borderRadius: "10px",
    "&:hover": {
      color: theme.text,
      opacity: 1,
    },
  },
  tablerow: {
    backgroundColor: "#001e3c!important",
    textAlign: "center",
    color: "#ffffff!important",
  },
  table: {
    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      float: "none",
    },
    float: "right",
    border: "thin solid",
    marginLeft: 10,
  },
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    // border: "1px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  card: {
    // display: "flex",
    flex: "auto",
    marginRight: 20,
    // display: "block",
  },
  buttongroup: {
    // flexDirection: "column",
    display: "grid",
    margin: "auto 0px auto 20px",
  },
  buttonedit: {
    margin: "4px 0px",
    minWidth: "fit-content",
    justifyContent: "start",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  profile: {
    // border: "thin solid",
    // borderRadius: "10px",
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const router = useRouter();

  const theme = useTheme();
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const [fetch, setFetch] = useState("getposts");
  const [deleteFetch, setDeleteFetch] = useState();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data: results } = useSWR(`/api/${fetch}`, fetcher);

  // const isLoading = results;

  const handleChange = (event, newValue) => {
    // console.log(typeof newValue);
    setValue(newValue);
    switch (newValue) {
      case 0:
        setFetch("getposts");
        break;
      case 1:
        setFetch("getposts");
        setDeleteFetch("deletePost");
        break;
      case 2:
        setFetch("getdrafts");
        setDeleteFetch("deleteDraft");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      case 3:
        setFetch("getcomments");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log(`Sorry, we are out of `);
    }
  };

  // function to delete post by id
  const deletePost = async (_id, deleteFetch) => {
    const res = await fetch(`/api/${deleteFetch}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_id),
    });
    setOpen(false);
    // reload page after deletion
    router.reload();
  };

  return (
    <Container>
      <Typography variant="h3" align="center" className={classes.title}>
        Dashboard
      </Typography>
      <div className={classes.tabs}>
        <AppBar position="static" elevation={0} className={classes.tabbar}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
          >
            <Tab className={classes.tab} label="Profile" {...a11yProps(0)} />
            <Tab className={classes.tab} label="Posts" {...a11yProps(1)} />
            <Tab className={classes.tab} label="Drafts" {...a11yProps(1)} />
            <Tab className={classes.tab} label="Comments" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <TextField
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              rows={4}
              defaultValue="Default Value"
              color="secondary"
              variant="outlined"
              fullWidth
              className={classes.profile}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Button
            href="/dashboard/editor"
            variant="contained"
            color="secondary"
            size="large"
          >
            Create New Post
          </Button>
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <List>
              {results.map((result) => {
                return (
                  <ListItem key={result._id} className={classes.buttonpost}>
                    <div className={classes.card}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="textPrimary"
                        align="left"
                      >
                        {result.title}
                      </Typography>
                      <Typography gutterBottom color="textPrimary" align="left">
                        {result.description}
                      </Typography>
                      <Typography gutterBottom color="secondary" align="left">
                        {result.author}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6" color="secondary" align="right">
                        {result.count}
                      </Typography>
                    </div>
                    <div className={classes.buttongroup}>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.buttonedit}
                        startIcon={<EditIcon />}
                        size="small"
                        href={`/dashboard/posts/${result._id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.buttonedit}
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={handleClickOpen}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Button
            href="/dashboard/editor"
            variant="contained"
            color="secondary"
            size="large"
          >
            Create New Post
          </Button>
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <List>
              {results.map((result) => {
                return (
                  <ListItem key={result._id} className={classes.buttonpost}>
                    <div className={classes.card}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="textPrimary"
                        align="left"
                      >
                        {result.title}
                      </Typography>
                      <Typography gutterBottom color="textPrimary" align="left">
                        {result.description}
                      </Typography>
                      <Typography gutterBottom color="secondary" align="left">
                        {result.author}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6" color="secondary" align="right">
                        {result.count}
                      </Typography>
                    </div>
                    <div className={classes.buttongroup}>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.buttonedit}
                        startIcon={<EditIcon />}
                        size="small"
                        href={`/dashboard/drafts/${result._id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.buttonedit}
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={handleClickOpen}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          )}
        </TabPanel>
        <TabPanel value={value} index={3}></TabPanel>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={classes.dialog}>
          <DialogContentText id="alert-dialog-description" color="textPrimary">
            Are you sure you want to permanently delete item?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialog}>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={deletePost} color="secondary" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
