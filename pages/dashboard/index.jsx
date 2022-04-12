import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import DashboardComments from "../../components/DashboardComments";
import SureComment from "../../components/SureComment";
import TextBox from "../../components/TextBox";

import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Container,
  List,
  ListItem,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import SurePost from "../../components/SurePost";
import Header from "../../components/Header";

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
    marginTop: 20,
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
  items: {
    display: "flex",
    flexGrow: 1,
  },
  label: {
    color: `${theme.palette.text.primary}!important`,
    position: "relative",
    transform: "none",
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const router = useRouter();

  const theme = useTheme();
  const classes = useStyles();

  const [value, setValue] = useState(0);
  // change to get user profile
  const [fetch, setFetch] = useState(`/api/getposts?q1=Muskrat&q2=published`);
  const [deleteFetch, setDeleteFetch] = useState();

  const [dialog, setDialog] = useState({ comment: false, post: false });

  const [resultID, setResultID] = useState();

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

  const handleOpenDialog = (ID, dialog) => {
    if (dialog == "comment") {
      setDialog({ comment: true, post: false });
    } else {
      setDialog({ comment: false, post: true });
    }
    setResultID(ID);
  };

  const handleCloseDialog = (dialog) => {
    if (dialog == "comment") {
      setDialog({ comment: false, post: false });
    } else {
      setDialog({ comment: false, post: false });
    }
  };

  const { data: results, mutate } = useSWR(fetch, fetcher);
  // mutate();

  // const isLoading = results;

  const handleChange = (event, newValue) => {
    // console.log(typeof newValue);
    setValue(newValue);
    switch (newValue) {
      case 0:
        setFetch(`/api/getposts?q1=Muskrat&q2=published`);
        break;
      case 1:
        setFetch(`/api/getposts?q1=Muskrat&q2=published`);
        setDeleteFetch("deletePost");
        break;
      case 2:
        setFetch(`/api/getposts?q1=Muskrat&q2=draft`);
        setDeleteFetch("deleteDraft");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      case 3:
        // update comments request
        setFetch(`/api/getDashboardComments?q=Muskrat`);
        setDeleteFetch("deleteComment");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log(`Sorry, we are out of `);
    }
  };

  return (
    <Container>
      {/* <Typography variant="h3" align="center" className={classes.title}>
        Dashboard
      </Typography> */}
      <Header title="Dashboard" />
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
            <>
              {/* <Typography variant="body1">Bio:</Typography> */}
              <FormControl className={classes.items}>
                <InputLabel
                  htmlFor="bio"
                  classes={{
                    root: classes.label,
                    formControl: classes.label,
                    focused: classes.label,
                  }}
                >
                  Bio:
                </InputLabel>

                <TextBox
                  defaultValue={null}
                  placeHolder="Tell us about yourself..."
                  id="bio"
                  autoFocus={true}
                  // handleChange={handleChange}
                  // handleSubmit={handleSubmit}
                  rows={10}
                  // className={comment_ref != "" ? classes.cref : classes.noref}
                />
              </FormControl>
            </>
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
                        color="textPrimary"
                        align="left"
                        variant="body2"
                      >
                        Approved: {result.approved}
                      </Typography>

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
                      {/* <Typography gutterBottom color="secondary" align="left">
                        {result.name}
                      </Typography> */}
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
                        onClick={() => handleOpenDialog(result._id, "post")}
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
                        onClick={() => handleOpenDialog(result._id, "post")}
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
        <TabPanel value={value} index={3}>
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
                    <DashboardComments
                      result={result}
                      handleClickOpen={() =>
                        handleOpenDialog(result._id, "comment")
                      }
                      setSnackbar={setSnackbar}
                      mutate={mutate}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </TabPanel>
      </div>

      <SureComment
        open={dialog.comment}
        handleClose={handleCloseDialog}
        ariaLabeledBy="alert-dialog-title"
        ariaDescribedBy="alert-dialog-description"
        id="alert-dialog-description"
        className={classes.dialog}
        sure="Are you sure you want to permanently delete item?"
        action="delete"
        resultID={resultID}
        setSnackbar={setSnackbar}
        mutate={mutate}
      />
      <SurePost
        open={dialog.post}
        handleClose={handleCloseDialog}
        ariaLabeledBy="alert-dialog-title"
        ariaDescribedBy="alert-dialog-description"
        id="alert-dialog-description"
        className={classes.dialog}
        sure="Are you sure you want to permanently delete item?"
        action="delete"
        resultID={resultID}
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
    </Container>
  );
}
