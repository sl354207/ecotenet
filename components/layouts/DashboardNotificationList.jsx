import CloseIcon from "@mui/icons-material/Close";
import { alpha, IconButton, List, ListItem, Typography } from "@mui/material";
import theme from "@utils/theme";

const DashboardNotificationList = ({
  results,
  handleUpdateNotify,
  isMobile,
}) => {
  return (
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
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
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
              <Typography variant="h6" align="left" color="textPrimary">
                {result.text}
              </Typography>
              {result.add_info && (
                <Typography variant="body1" align="left" color="textPrimary">
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
};

export default DashboardNotificationList;
