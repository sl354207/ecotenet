import AdminDrawer from "@components/AdminDrawer";
import AdminDialog from "@components/dialogs/AdminDialog";
import Header from "@components/Header";
import {
  Button,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import { useState } from "react";
import useSWR from "swr";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  header: {
    marginTop: 20,
  },
  buttonPost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
    border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
    margin: "20px auto",
    borderRadius: "10px",
  },
  mobile: {
    display: "grid",
  },
  desktop: {
    marginTop: 4,
  },
  button: {
    marginLeft: 4,
  },
  delete: {
    color: "#fc7ebf",
    borderColor: "#fc7ebf",
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  comment: {
    display: "flow-root",
    flexGrow: 1,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminComments = () => {
  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

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
        className={classes.progress}
      />
    );
  } else if (Array.isArray(results) && results.length == 0) {
    list = (
      <Typography variant="h6" align="center" className={classes.header}>
        no results
      </Typography>
    );
  } else {
    list = (
      <List>
        {results.map((result) => {
          return <>
            <ListItem key={result._id} className={classes.buttonPost}>
              <div className={classes.comment}>
                <Link className={classes.link} underline="hover">{result.name}</Link>

                <ListItemText primary={result.text}></ListItemText>
              </div>

              {isMobile ? (
                <div className={classes.mobile}>
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
                    className={classes.desktop}
                    onClick={() =>
                      handleOpenDialog("Deny", "Comment", result)
                    }
                  >
                    Deny
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={`${classes.desktop} ${classes.delete}`}
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
                    className={classes.button}
                    onClick={() =>
                      handleOpenDialog("Deny", "Comment", result)
                    }
                  >
                    Deny
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={`${classes.button} ${classes.delete}`}
                    onClick={() =>
                      handleOpenDialog("Delete", "Comment", result)
                    }
                  >
                    Delete
                  </Button>
                </div>
              )}
            </ListItem>
          </>;
        })}
      </List>
    );
  }

  return (
    <div className={classes.root}>
      <AdminDrawer />
      <div className={classes.content}>
        <Header title="Comments" />
        {list}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          className={classes.dialog}
          result={item}
          mutate={mutate}
        />
      </div>
    </div>
  );
};

export default adminComments;
