import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/layouts/Header";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Typography,
  alpha,
} from "@mui/material";
import { updateNotification } from "@utils/apiHelpers";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import useSWR, { useSWRConfig } from "swr";

const notifications = () => {
  const { mutate } = useSWRConfig();

  const handleUpdateNotify = async (ID) => {
    const notify = {
      id: ID,
      viewed: true,
    };

    const notifyResponse = await updateNotification(notify, "admin");

    if (notifyResponse.ok) {
      mutate("/api/admin/notifications");
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

  const {
    data: results,
    isLoading,
    error,
  } = useSWR("/api/admin/notifications", fetcher, {
    shouldRetryOnError: false,
  });

  let list;

  if (isLoading) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else {
    if (error) {
      list = (
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
            onClick={() => mutate("/api/admin/notifications")}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(results) && results.length === 0) {
        list = (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        );
      } else {
        list = (
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
                      {result.date.toDateString()}
                    </Typography>
                    <Typography variant="h6" align="left" color="textPrimary">
                      {result.name} {result.text}
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
        );
      }
    }
  }
  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <div style={{ display: "flex" }}>
        <AdminDrawer />
        <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
          <Header title="Notifications" />
          {list}
        </div>
      </div>
    </>
  );
};

export default notifications;
