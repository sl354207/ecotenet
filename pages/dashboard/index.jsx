import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

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
  InputBase,
  FormHelperText,
  Chip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import { Alert, Autocomplete, createFilterOptions } from "@material-ui/lab";

import Header from "../../components/Header";
import DashboardDialog from "../../components/dialogs/DashboardDialog";
import DashboardComment from "../../components/comments/DashboardComment";
import TextBox from "../../components/TextBox";

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
    margin: "10px 0 10px 0",
  },
  label: {
    color: `${theme.palette.text.primary}!important`,
    position: "relative",
    transform: "none",
  },
  search: {
    position: "relative",
    // border: "2px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,

    "&:focus-within": {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    // marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginTop: 6,
    marginBottom: 10,
    // marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },
  inputRoot: {
    color: theme.palette.text.primary,
  },
  inputInput: {
    padding: 18,
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em)`,
    // transition: theme.transitions.create("width"),
    // width: "100%",
    // [theme.breakpoints.up("xs")]: {
    //   width: "0ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },
  popper: {
    backgroundColor: theme.palette.primary.light,
  },
  chipDelete: {
    WebkitTapHighlightColor: "transparent",
    color: theme.palette.secondary.main,
    height: 22,
    width: 22,
    cursor: "pointer",
    margin: "0 5px 0 -6px",
    "&:hover": {
      color: alpha(theme.palette.secondary.main, 0.7),
    },
  },
  chip: {
    borderColor: theme.palette.secondary.main,
    borderWidth: 2,
    color: theme.palette.text.primary,
    // fontSize: 16,
    height: 40,
    margin: "0px 5px 10px 5px",
  },
  save: {
    display: "flex",
    justifyContent: "space-between",
  },
  helper: {
    color: theme.palette.text.primary,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const router = useRouter();

  const theme = useTheme();
  const classes = useStyles();

  // set filter for autocomplete options
  const filter = createFilterOptions();

  const [value, setValue] = useState(0);
  // change to get user profile

  const [fetchApi, setFetchApi] = useState("/api/getPerson?q=Muskrat");
  const [deleteFetch, setDeleteFetch] = useState();

  // const [dialog, setDialog] = useState({ comment: false, post: false });
  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const [resultID, setResultID] = useState();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const { data: results, mutate } = useSWR(fetchApi, fetcher);

  const [profile, setProfile] = useState({
    bio: "",
    website: "",
    socials: "",
    approved: "",
  });

  useEffect(() => {
    if (results) {
      setProfile({
        bio: results.bio,
        website: results.website,
        socials: results.socials,
        approved: results.approved,
      });
    }
  }, [results]);

  const handleChange = (event, newValue) => {
    // console.log(typeof newValue);
    setValue(newValue);
    switch (newValue) {
      case 0:
        setFetchApi(`/api/getPerson?q=Muskrat`);
        break;
      case 1:
        setFetchApi(`/api/getposts?q1=Muskrat&q2=published`);
        setDeleteFetch("deletePost");
        break;
      case 2:
        setFetchApi(`/api/getposts?q1=Muskrat&q2=draft`);
        setDeleteFetch("deleteDraft");

        break;
      case 3:
        // update comments request
        setFetchApi(`/api/getDashboardComments?q=Muskrat`);
        setDeleteFetch("deleteComment");

        break;
      case 4:
        // update comments request
        setFetchApi(`/api/getNotifications?q=Muskrat`);
        setDeleteFetch("deleteNotification");

        break;
      default:
        break;
    }
  };

  const handleNotify = async (ID) => {
    const notify = {
      _id: ID,
      viewed: true,
    };
    console.log(notify);

    const res = await fetch("/api/updateNotification", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notify),
    });

    if (res.ok) {
      mutate();
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "There was a problem resolving notification. Please try again later",
      });
    }
  };

  const handleRemoveChip = (socials, chip) => {
    setProfile((profile) => ({
      ...profile,
      socials: socials.filter((tag) => tag !== chip),
    }));
  };

  const handleProfileChange = (e) => {
    //set name and value from targeted form props
    const { id, value } = e.target;

    // Set new values on form change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
    setProfile((profile) => ({
      ...profile,
      [id]: value,
    }));

    // set errors
    // const error = formValidation(name, value, fieldsValidation) || ""

    // setFormErrors({
    //   [name]: error
    // })
  };

  const handleProfileSubmit = async () => {
    const silentObject = {
      _id: results._id,
      email: results.email,
      flags: results.flags,
      denials: results.denials,
      approved: "pending",
    };

    const changes = {
      bio: profile.bio,
      website: profile.website,
      socials: profile.socials,
    };

    const value = Object.assign(silentObject, changes);

    const res = await fetch("/api/updatePerson", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    if (res.ok) {
      mutate();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Profile saved successfully",
      });
    }
    if (!res.ok) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem saving profile. Please try again later",
      });
    }
  };

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

  return (
    <Container>
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
            <Tab className={classes.tab} label="Drafts" {...a11yProps(2)} />
            <Tab className={classes.tab} label="Comments" {...a11yProps(3)} />
            <Tab
              className={classes.tab}
              label="Notifications"
              {...a11yProps(4)}
            />
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
              <div className={classes.save}>
                <Typography variant="h5" gutterBottom>
                  Public Profile: optional
                </Typography>
                {results.bio == profile.bio &&
                results.website == profile.website &&
                results.socials == profile.socials ? (
                  <Button variant="contained" color="secondary" disabled>
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleProfileSubmit()}
                  >
                    Save Changes
                  </Button>
                )}
              </div>

              <Typography variant="body1" gutterBottom>
                Approved: {results.approved}
              </Typography>
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
                  defaultValue={results.bio}
                  placeHolder="Tell us about yourself..."
                  id="bio"
                  autoFocus={false}
                  handleChange={handleProfileChange}
                  // handleSubmit={handleSubmit}
                  rows={10}
                  // inputProps={{ "aria-label": "description" }}
                  // className={comment_ref != "" ? classes.cref : classes.noref}
                />
              </FormControl>
              <FormControl className={classes.items}>
                <InputLabel
                  htmlFor="website"
                  classes={{
                    root: classes.label,
                    formControl: classes.label,
                    focused: classes.label,
                  }}
                >
                  Personal Website:
                </InputLabel>

                <TextBox
                  defaultValue={results.website}
                  placeHolder="Share your personal website (example.com)"
                  id="website"
                  autoFocus={false}
                  handleChange={handleProfileChange}
                  // handleSubmit={handleSubmit}
                  rows={1}
                  inputProps={{ type: "url" }}
                  // className={comment_ref != "" ? classes.cref : classes.noref}
                />
              </FormControl>
              <FormControl className={classes.items}>
                <InputLabel
                  htmlFor="socials"
                  classes={{
                    root: classes.label,
                    formControl: classes.label,
                    focused: classes.label,
                  }}
                >
                  Socials:
                </InputLabel>
                <Autocomplete
                  className={classes.search}
                  classes={{ paper: classes.popper }}
                  autoHighlight
                  disabled={
                    profile.socials && profile.socials.length > 2 ? true : false
                  }
                  disableClearable={true}
                  value={profile.socials}
                  onChange={(event, newValue) => {
                    setProfile((profile) => ({
                      ...profile,
                      socials: [...profile.socials, newValue.inputValue],
                    }));
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    // Suggest the creation of a new value
                    if (params.inputValue !== "") {
                      filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="socials"
                  name="socials"
                  options={[]}
                  renderOption={(option) => option.title}
                  freeSolo
                  filterSelectedOptions={false}
                  renderInput={(params) => (
                    <InputBase
                      {...params}
                      placeholder="example.com"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                    />
                  )}
                />
                <FormHelperText className={classes.helper}>
                  Add social media links (3 max)
                </FormHelperText>
              </FormControl>
              <div>
                {profile.socials &&
                  profile.socials.map((social) => (
                    <Chip
                      label={social}
                      variant="outlined"
                      className={classes.chip}
                      classes={{
                        deleteIcon: classes.chipDelete,
                      }}
                      onDelete={() => handleRemoveChip(profile.socials, social)}
                    ></Chip>
                  ))}
              </div>
              <Typography variant="h5" gutterBottom>
                Private Settings:
              </Typography>
              <FormControl className={classes.items}>
                <InputLabel
                  htmlFor="email"
                  classes={{
                    root: classes.label,
                    formControl: classes.label,
                    focused: classes.label,
                  }}
                >
                  Email:
                </InputLabel>

                <TextBox
                  defaultValue={results.email}
                  placeHolder="email@site.com"
                  id="email"
                  autoFocus={false}
                  // handleChange={handleChange}
                  // handleSubmit={handleSubmit}
                  rows={1}
                  inputProps={{ type: "email" }}
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
            <>
              {results.length > 0 && (
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
                          <Typography
                            gutterBottom
                            color="textPrimary"
                            align="left"
                          >
                            {result.description}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            color="secondary"
                            align="right"
                          >
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
                            onClick={() =>
                              handleOpenDialog("Delete", "post", result)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </>
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
            <>
              {results.length > 0 && (
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
                          <Typography
                            gutterBottom
                            color="textPrimary"
                            align="left"
                          >
                            {result.description}
                          </Typography>
                          <Typography
                            gutterBottom
                            color="secondary"
                            align="left"
                          >
                            {result.author}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            color="secondary"
                            align="right"
                          >
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
                            onClick={() =>
                              handleOpenDialog("Delete", "draft", result)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </>
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
            <>
              {results.length > 0 && (
                <List>
                  {results.map((result) => {
                    return (
                      <ListItem key={result._id} className={classes.buttonpost}>
                        <DashboardComment
                          result={result}
                          handleDeleteOpen={() =>
                            handleOpenDialog("Delete", "comment", result)
                          }
                          setSnackbar={setSnackbar}
                          mutate={mutate}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={value} index={4}>
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              className={classes.progress}
            />
          ) : (
            <>
              {results.length > 0 && (
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
                            {result.date}
                          </Typography>
                          <Typography
                            variant="h6"
                            align="left"
                            color="textPrimary"
                          >
                            {result.text}
                          </Typography>
                        </div>

                        <div className={classes.buttongroup}>
                          <IconButton onClick={() => handleNotify(result._id)}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </>
          )}
        </TabPanel>
      </div>

      <DashboardDialog
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
    </Container>
  );
}
