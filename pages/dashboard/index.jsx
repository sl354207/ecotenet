import DashboardComment from "@components/comments/DashboardComment";
import { useSnackbarContext } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import CreatePostButton from "@components/layouts/CreatePostButton";
import DashboardNotificationList from "@components/layouts/DashboardNotificationList";
import DashboardPostList from "@components/layouts/DashboardPostList";
import DashboardProfile from "@components/layouts/DashboardProfile";
import Header from "@components/layouts/Header";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { updateNotification, updateUser } from "@utils/apiHelpers";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { validEmail } from "@utils/validationHelpers";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import URISanity from "urisanity";

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

const DynamicDashboardDialog = dynamic(
  () => import("@components/dialogs/DashboardDialog"),
  {
    ssr: false,
  }
);

export default function Dashboard() {
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mutate } = useSWRConfig();

  const [tabValue, setTabValue] = useState(0);

  const [fetchApi, setFetchApi] = useState();

  useEffect(() => {
    if (user && user.status === "authenticated") {
      setFetchApi(`/api/dashboard/users/${user.name}`);
    }
  }, [user]);

  const [dialog, setDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState({ action: "", type: "" });
  const [dialogItem, setDialogItem] = useState("");
  const [error, setError] = useState({ website: false, socials: false });

  const {
    data: results,
    isLoading,
    error: resultError,
  } = useSWR(
    user && user.status === "authenticated" ? fetchApi : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
      mutate(fetchApi);
    }
    if (!notifyResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
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
  };

  const handleProfileSubmit = async () => {
    if (
      profile.website !== "" &&
      URISanity.vet(profile.website, {
        allowWebTransportURI: true,
      }) === "about:blank"
    ) {
      setError({ website: true, socials: error.socials });
    } else {
      setError({ website: false, socials: false });
      const value = {
        name: user.name,
        email: user.email,
        bio: profile.bio,
        website: profile.website,
        socials: profile.socials,
      };

      const profileUpdate = await updateUser(value, "dashboard");

      if (profileUpdate.ok) {
        mutate(fetchApi);
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: "Profile saved successfully",
        });
      }
      if (!profileUpdate.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: "There was a problem saving profile. Please try again later",
        });
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // UPDATE ONCE MUTATE USER SESSION IS IMPLEMENTED IN NEXT AUTH OR CHANGE UPDATE PERSON FUNCTIONALITY
  const handleEmailUpdate = async () => {
    if (!validEmail(email)) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: "Invalid Email",
      });
    } else {
      const value = {
        name: user.name,
        email: email,
      };
      const emailUpdate = await updateUser(value, "dashboard");

      if (emailUpdate.ok) {
        mutate(fetchApi);
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "success",
          message: "Email changed successfully",
        });
      }
      if (!emailUpdate.ok) {
        setSnackbar({
          ...snackbar,
          open: true,
          vertical: "bottom",
          horizontal: "left",
          severity: "error",
          message: "There was a problem changing email. Please try again later",
        });
      }
    }
  };

  const handleOpenDialog = (action, type, result) => {
    setDialogItem(result);
    setDialogAction({ action: action, type: type });

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
            value={tabValue}
            onChange={handleTabChange}
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

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
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
              {resultError ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(fetchApi)}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {results && (
                    <DashboardProfile
                      user={user && user}
                      results={results && results}
                      profile={profile}
                      setProfile={setProfile}
                      handleProfileSubmit={handleProfileSubmit}
                      handleProfileChange={handleProfileChange}
                      handleRemoveChip={handleRemoveChip}
                      handleOpenDialog={handleOpenDialog}
                      error={error}
                      setError={setError}
                    />
                  )}
                </>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CreatePostButton
            name={user && user.name}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
            nav={false}
            isTab={false}
          />
          {isLoading ? (
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
              {resultError ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(fetchApi)}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {results && (
                    <>
                      {results.length > 0 && (
                        <DashboardPostList
                          results={results && results}
                          handleOpenDialog={handleOpenDialog}
                          draft={false}
                          isMobile={isMobile}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CreatePostButton
            name={user && user.name}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
            nav={false}
            isTab={false}
          />
          {isLoading ? (
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
              {resultError ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(fetchApi)}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {results && (
                    <>
                      {results.length > 0 && (
                        <DashboardPostList
                          results={results && results}
                          handleOpenDialog={handleOpenDialog}
                          draft={true}
                          isMobile={isMobile}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {isLoading ? (
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
              {resultError ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(fetchApi)}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {results && (
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
                                    handleOpenDialog(
                                      "delete",
                                      "Comment",
                                      result
                                    )
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
                </>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          {isLoading ? (
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
              {resultError ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(fetchApi)}
                  >
                    Error Loading. Retry
                  </Button>
                </div>
              ) : (
                <>
                  {results && (
                    <>
                      {results.length > 0 && (
                        <DashboardNotificationList
                          results={results && results}
                          isMobile={isMobile}
                          handleUpdateNotify={handleUpdateNotify}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </TabPanel>
      </div>

      {dialog && (
        <DynamicDashboardDialog
          contentType={dialogAction.type}
          action={dialogAction.action}
          open={dialog}
          handleClose={handleCloseDialog}
          result={dialogItem}
          snackbar={snackbar}
          setSnackbar={setSnackbar}
          mutate={mutate}
          name={user && user.name}
          fetchApi={fetchApi}
        />
      )}
    </Container>
  );
}
