import AdminDrawer from "@components/AdminDrawer";
import AdminDialog from "@components/dialogs/AdminDialog";
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

// const useStyles = makeStyles((theme) => ({
//   // root: {
//   //   display: "flex",
//   // },
//   // content: {
//   //   flexGrow: 1,
//   //   padding: theme.spacing(3),
//   // },
//   // progress: {
//   //   margin: "100px auto",
//   //   display: "flex",
//   //   justifySelf: "center",
//   // },
//   // header: {
//   //   marginTop: 20,
//   // },
//   // buttonPost: {
//   //   display: "flex",
//   //   justifyContent: "start",
//   //   textTransform: "none",
//   //   border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
//   //   margin: "20px auto",
//   //   borderRadius: "10px",
//   // },
//   // mobile: {
//   //   display: "grid",
//   // },
//   // desktop: {
//   //   marginTop: 4,
//   // },
//   // button: {
//   //   marginLeft: 4,
//   // },
//   // delete: {
//   //   color: "#fc7ebf",
//   //   borderColor: "#fc7ebf",
//   // },
//   // dialog: {
//   //   backgroundColor: theme.palette.primary.light,
//   // },
//   // comment: {
//   //   display: "flow-root",
//   //   flexGrow: 1,
//   // },
// }));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminComments = () => {
  // const classes = useStyles();
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
      <Typography
        variant="h6"
        align="center"
        // className={classes.header}
        sx={{ marginTop: "20px" }}
      >
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
                  <Link underline="hover">{result.name}</Link>

                  <ListItemText primary={result.text}></ListItemText>
                </div>

                {isMobile ? (
                  <div
                    // className={classes.mobile}
                    style={{ display: "grid" }}
                  >
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
                      // className={`${classes.desktop} ${classes.delete}`}
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
                      // className={classes.button}
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
                      // className={`${classes.button} ${classes.delete}`}
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
    <div
      // className={classes.root}
      style={{ display: "flex" }}
    >
      <AdminDrawer />
      <div
        // className={classes.content}
        style={{ flexGrow: 1, padding: theme.spacing(3) }}
      >
        <Header title="Comments" />
        {list}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          // className={classes.dialog}
          result={item}
          mutate={mutate}
        />
      </div>
    </div>
  );
};

export default adminComments;
