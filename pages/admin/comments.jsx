import AdminDialog from "@components/dialogs/AdminDialog";
import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/Header";
import Link from "@components/Link";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminComments = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const handleOpenDialog = (action, type, result) => {
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const { data: results, mutate } = useSWR("/api/admin/comments", fetcher);

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else if (Array.isArray(results) && results.length == 0) {
    list = (
      <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
        no results
      </Typography>
    );
  } else {
    list = (
      <List>
        {results.map((result) => {
          return (
            <>
              <ListItem
                key={result._id}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  textTransform: "none",
                  border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
                  margin: "20px auto",
                  borderRadius: "10px",
                }}
              >
                <div style={{ display: "flow-root", flexGrow: 1 }}>
                  <Link href={`/admin/people/${result.name}`} underline="hover">
                    {result.name}
                  </Link>

                  <ListItemText primary={result.text}></ListItemText>
                </div>

                {isMobile ? (
                  <div style={{ display: "grid" }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        handleOpenDialog("Approve", "Comment", result)
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ marginTop: "4px" }}
                      onClick={() =>
                        handleOpenDialog("Deny", "Comment", result)
                      }
                    >
                      Deny
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        marginTop: "4px",
                        color: "#fc7ebf",
                        borderColor: "#fc7ebf",
                      }}
                      onClick={() =>
                        handleOpenDialog("Delete", "Comment", result)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        handleOpenDialog("Approve", "Comment", result)
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ marginLeft: "4px" }}
                      onClick={() =>
                        handleOpenDialog("Deny", "Comment", result)
                      }
                    >
                      Deny
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        marginLeft: "4px",
                        marginTop: "4px",
                        color: "#fc7ebf",
                        borderColor: "#fc7ebf",
                      }}
                      onClick={() =>
                        handleOpenDialog("Delete", "Comment", result)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </ListItem>
            </>
          );
        })}
      </List>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminDrawer />
      <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
        <Header title="Comments" />
        {list}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          result={item}
          mutate={mutate}
        />
      </div>
    </div>
  );
};

export default adminComments;
