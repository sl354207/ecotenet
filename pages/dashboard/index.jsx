import DashboardComment from "@components/comments/DashboardComment";
import { useSnackbarContext } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import DashboardDialog from "@components/dialogs/DashboardDialog";
import TextBox from "@components/inputFields/TextBox";
import CreatePostButton from "@components/layouts/CreatePostButton";
import Header from "@components/layouts/Header";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputBase,
  InputLabel,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createFilterOptions } from "@mui/material/useAutocomplete";
import { updateNotification, updateUser } from "@utils/apiHelpers";
import theme from "@utils/theme";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useSWR from "swr";

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

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // set filter for autocomplete options
  const filter = createFilterOptions();

  const [value, setValue] = useState(0);

  const [fetchApi, setFetchApi] = useState();
  useEffect(() => {
    if (user) {
      setFetchApi(`/api/dashboard/users/${user.name}`);
    }
  }, [user]);
  // console.log(fetchApi);

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const { data: results, mutate } = useSWR(user ? fetchApi : null, fetcher);
  // console.log(results);

  const [profile, setProfile] = useState({
    bio: "",
    website: "",
    socials: "",
    approved: "",
  });

  const [email, setEmail] = useState(user && user.email);

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
    setValue(newValue);
    switch (newValue) {
      case 0:
        setFetchApi(`/api/dashboard/users/${user.name}`);
        break;
      case 1:
        setFetchApi(`/api/dashboard/posts?name=${user.name}&status=published`);

        break;
      case 2:
        setFetchApi(`/api/dashboard/posts?name=${user.name}&status=draft`);

        break;
      case 3:
        // update comments request
        setFetchApi(`/api/dashboard/comments?name=${user.name}`);

        break;
      case 4:
        setFetchApi(`/api/dashboard/notifications?name=${user.name}`);

        break;
      default:
        break;
    }
  };

  const handleUpdateNotify = async (ID) => {
    const notify = {
      id: ID,
      name: user.name,
      viewed: true,
    };

    const notifyResponse = await updateNotification(notify);

    if (notifyResponse.ok) {
      mutate();
    }
    if (!notifyResponse.ok) {
      setSnackbar({
        ...snackbar,
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
    const value = {
      name: user.name,
      email: user.email,
      bio: profile.bio,
      website: profile.website,
      socials: profile.socials,
      approved: "pending",
    };

    const profileUpdate = await updateUser(value, "dashboard");

    if (profileUpdate.ok) {
      mutate();
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: "Profile saved successfully",
      });
    }
    if (!profileUpdate.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: "There was a problem saving profile. Please try again later",
      });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // UPDATE ONCE MUTATE USER SESSION IS IMPLEMENTED IN NEXT AUTH OR CHANGE UPDATE PERSON FUNCTIONALITY
  const handleEmailUpdate = async () => {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (!regex.test(email)) {
      setError({ on: true, message: "Invalid Email Address" });
    } else {
      const value = {
        name: user.name,
        email: email,
      };
      const emailUpdate = await updateUser(value, "dashboard");

      if (emailUpdate.ok) {
        mutate();
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "success",
          message: "Email changed successfully",
        });
      }
      if (!emailUpdate.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          severity: "error",
          message: "There was a problem changing email. Please try again later",
        });
      }
    }
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
      <div
        style={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.paper,
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: theme.palette.primary.light,
            borderRadius: "10px",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab
              sx={{
                flexGrow: 1,
                backgroundColor: theme.palette.primary.light,
                minHeight: "80px",
                minWidth: "inherit",
                padding: "inherit",
                borderRadius: "10px",
                "&:hover": {
                  color: theme.text,
                  opacity: 1,
                },
              }}
              label="Profile"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                flexGrow: 1,
                backgroundColor: theme.palette.primary.light,
                minHeight: "80px",
                minWidth: "inherit",
                padding: "inherit",
                borderRadius: "10px",
                "&:hover": {
                  color: theme.text,
                  opacity: 1,
                },
              }}
              label="Posts"
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                flexGrow: 1,
                backgroundColor: theme.palette.primary.light,
                minHeight: "80px",
                minWidth: "inherit",
                padding: "inherit",
                borderRadius: "10px",
                "&:hover": {
                  color: theme.text,
                  opacity: 1,
                },
              }}
              label="Drafts"
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                flexGrow: 1,
                backgroundColor: theme.palette.primary.light,
                minHeight: "80px",
                minWidth: "inherit",
                padding: "inherit",
                borderRadius: "10px",
                "&:hover": {
                  color: theme.text,
                  opacity: 1,
                },
              }}
              label="Comments"
              {...a11yProps(3)}
            />
            {isMobile ? (
              <Tab
                sx={{
                  flexGrow: 1,
                  backgroundColor: theme.palette.primary.light,
                  minHeight: "80px",
                  minWidth: "inherit",
                  padding: "inherit",
                  borderRadius: "10px",
                  "&:hover": {
                    color: theme.text,
                    opacity: 1,
                  },
                }}
                label={<NotificationsNoneIcon />}
                {...a11yProps(4)}
              />
            ) : (
              <Tab
                sx={{
                  flexGrow: 1,
                  backgroundColor: theme.palette.primary.light,
                  minHeight: "80px",
                  minWidth: "inherit",
                  padding: "inherit",
                  borderRadius: "10px",
                  "&:hover": {
                    color: theme.text,
                    opacity: 1,
                  },
                }}
                label="Notifications"
                {...a11yProps(4)}
              />
            )}
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              sx={{
                margin: "100px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
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
              <FormControl
                sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
              >
                <InputLabel htmlFor="bio">Bio:</InputLabel>

                <TextBox
                  defaultValue={results.bio}
                  placeHolder="Tell us about yourself..."
                  id="bio"
                  autoFocus={false}
                  handleChange={handleProfileChange}
                  rows={10}
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
              >
                <InputLabel htmlFor="website">Personal Website:</InputLabel>

                <TextBox
                  defaultValue={results.website}
                  placeHolder="Share your personal website (example.com)"
                  id="website"
                  autoFocus={false}
                  handleChange={handleProfileChange}
                  rows={1}
                  inputProps={{ type: "url" }}
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
              >
                <InputLabel htmlFor="socials">Socials:</InputLabel>
                <Autocomplete
                  sx={{
                    position: "relative",
                    border: `1px solid ${alpha(
                      theme.palette.secondary.main,
                      0.5
                    )}`,
                    borderRadius: "4px",
                    backgroundColor: theme.palette.primary.main,
                    "&:focus-within": {
                      backgroundColor: theme.palette.primary.main,
                      border: `1px solid ${alpha(
                        theme.palette.secondary.main,
                        1
                      )}`,
                      borderRadius: "4px",
                    },

                    width: "auto",
                  }}
                  autoHighlight
                  disabled={
                    profile.socials && profile.socials.length > 2 ? true : false
                  }
                  disableClearable={true}
                  value={[]}
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
                  renderOption={(props, option) => (
                    <li {...props}>{option.title}</li>
                  )}
                  freeSolo
                  filterSelectedOptions={false}
                  renderInput={(params) => (
                    <InputBase
                      {...params}
                      placeholder="example.com"
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "20px 10px 20px 10px",
                        },
                      }}
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                    />
                  )}
                />
                <FormHelperText sx={{ color: theme.palette.text.primary }}>
                  Add social media links (3 max)
                </FormHelperText>
              </FormControl>
              <div>
                {profile.socials &&
                  profile.socials.map((social) => (
                    <Chip
                      label={social}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.secondary.main,
                        borderWidth: 2,
                        color: theme.palette.text.primary,
                        height: 40,
                        margin: "0px 5px 10px 5px",

                        "& .MuiChip-deleteIcon": {
                          WebkitTapHighlightColor: "transparent",
                          color: theme.palette.secondary.main,
                          fontSize: 22,
                          cursor: "pointer",
                          margin: "0 5px 0 -6px",
                          "&:hover": {
                            color: alpha(theme.palette.secondary.main, 0.7),
                          },
                        },
                      }}
                      onDelete={() => handleRemoveChip(profile.socials, social)}
                    ></Chip>
                  ))}
              </div>
              <Typography variant="h5" gutterBottom>
                Private Settings:
              </Typography>
              <div style={{ display: "flex" }}>
                <FormControl
                  sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
                >
                  <InputLabel htmlFor="email">Email:</InputLabel>
                  {/* <div style={{ display: "flex", flexGrow: 1 }}> */}
                  <TextBox
                    defaultValue={results.email}
                    placeHolder="email@site.com"
                    id="email"
                    autoFocus={false}
                    handleChange={handleEmailChange}
                    rows={1}
                    multiline={false}
                    inputProps={{ type: "email" }}
                  />

                  {/* </div> */}
                </FormControl>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginLeft: 2,
                    marginTop: "32px",
                    marginBottom: "10px",
                  }}
                  onClick={() => handleEmailUpdate()}
                  disabled={
                    email == "" || email == user.email || email == undefined
                  }
                >
                  Update Email
                </Button>
              </div>
            </>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CreatePostButton
            name={user && user.name}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
          />
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              sx={{
                margin: "100px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              {results.length > 0 && (
                <List>
                  {results.map((result) => {
                    return (
                      <ListItem
                        key={result._id}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          textTransform: "none",
                          border: `1px solid ${alpha(
                            theme.palette.secondary.main,
                            0.5
                          )}`,
                          margin: "20px auto",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ flex: "auto", marginRight: "20px" }}>
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
                        <div
                          style={{
                            display: "grid",
                            margin: "auto 0px auto 20px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              margin: "4px 0px",
                              minWidth: "fit-content",
                              justifyContent: "start",
                            }}
                            startIcon={<EditIcon />}
                            size="small"
                            href={`/dashboard/posts/${result._id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              margin: "4px 0px",
                              minWidth: "fit-content",
                              justifyContent: "start",
                            }}
                            startIcon={<DeleteIcon />}
                            size="small"
                            onClick={() =>
                              handleOpenDialog("delete", "Post", result)
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
          <CreatePostButton
            name={user && user.name}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
          />
          {!results ? (
            <CircularProgress
              color="secondary"
              size={100}
              disableShrink={true}
              sx={{
                margin: "100px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              {results.length > 0 && (
                <List>
                  {results.map((result) => {
                    return (
                      <ListItem
                        key={result._id}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          textTransform: "none",
                          border: `1px solid ${alpha(
                            theme.palette.secondary.main,
                            0.5
                          )}`,
                          margin: "20px auto",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ flex: "auto", marginRight: "20px" }}>
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
                        <div
                          style={{
                            display: "grid",
                            margin: "auto 0px auto 20px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              margin: "4px 0px",
                              minWidth: "fit-content",
                              justifyContent: "start",
                            }}
                            startIcon={<EditIcon />}
                            size="small"
                            href={`/dashboard/posts/${result._id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              margin: "4px 0px",
                              minWidth: "fit-content",
                              justifyContent: "start",
                            }}
                            startIcon={<DeleteIcon />}
                            size="small"
                            onClick={() =>
                              handleOpenDialog("delete", "Post", result)
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
              sx={{
                margin: "100px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              {results.length > 0 && (
                <List>
                  {results.map((result) => {
                    return (
                      <ListItem
                        key={result._id}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          textTransform: "none",
                          border: `1px solid ${alpha(
                            theme.palette.secondary.main,
                            0.5
                          )}`,
                          margin: "20px auto",
                          borderRadius: "10px",
                        }}
                      >
                        <DashboardComment
                          result={result}
                          handleDeleteOpen={() =>
                            handleOpenDialog("delete", "Comment", result)
                          }
                          snackbar={snackbar}
                          setSnackbar={setSnackbar}
                          mutate={mutate}
                          name={user && user.name}
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
              sx={{
                margin: "100px auto",
                display: "flex",
                justifySelf: "center",
              }}
            />
          ) : (
            <>
              {results.length > 0 && (
                <List>
                  {results.map((result) => {
                    result.date = new Date(result.date);
                    return (
                      <ListItem
                        key={result._id}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          textTransform: "none",
                          border: `1px solid ${alpha(
                            theme.palette.secondary.main,
                            0.5
                          )}`,
                          margin: "20px auto",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ flex: "auto", marginRight: "20px" }}>
                          <Typography
                            gutterBottom
                            color="textPrimary"
                            align="left"
                            variant="body2"
                          >
                            {isMobile
                              ? result.date.toLocaleDateString()
                              : result.date.toDateString()}
                          </Typography>
                          <Typography
                            variant="h6"
                            align="left"
                            color="textPrimary"
                          >
                            {result.text}
                          </Typography>
                          {result.add_info && (
                            <Typography
                              variant="body1"
                              align="left"
                              color="textPrimary"
                            >
                              additional info: {result.add_info}
                            </Typography>
                          )}
                        </div>

                        <div
                          style={{
                            display: "grid",
                            margin: "auto 0px auto 20px",
                          }}
                        >
                          <IconButton
                            onClick={() => handleUpdateNotify(result._id)}
                            size="large"
                          >
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
        result={item}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
        mutate={mutate}
        name={user && user.name}
      />
    </Container>
  );
}
