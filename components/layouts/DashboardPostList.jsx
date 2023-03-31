import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  alpha,
  Button,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import theme from "@utils/theme";

const DashboardPostList = ({ results, handleOpenDialog, isMobile, draft }) => {
  return (
    <List>
      {results.map((result) => {
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
              {!draft && (
                <Typography
                  gutterBottom
                  color="textPrimary"
                  align="left"
                  variant="body2"
                >
                  Approved: {result.approved}
                </Typography>
              )}

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
            </div>
            <div>
              <Typography variant="h6" color="secondary" align="right">
                {result.count}
              </Typography>
            </div>
            <div
              style={{
                display: "grid",
                margin: "auto 0px auto 20px",
              }}
            >
              {isMobile ? (
                <>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="filter"
                    size="small"
                    href={`/dashboard/posts/${result._id}`}
                    sx={{ marginBottom: "20px" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="filter"
                    size="small"
                    onClick={() => handleOpenDialog("delete", "Post", result)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : (
                <>
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
                    onClick={() => handleOpenDialog("delete", "Post", result)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
};

export default DashboardPostList;
