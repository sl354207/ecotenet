import AdminDrawer from "@components/AdminDrawer";
import AdminDialog from "@components/dialogs/AdminDialog";
import Header from "@components/Header";
import Link from "@components/Link";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import theme from "@utils/theme";
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
  // progress: {
  //   margin: "100px auto",
  //   display: "flex",
  //   justifySelf: "center",
  // },
  // header: {
  //   marginTop: 20,
  // },
  // buttonPost: {
  //   display: "flex",
  //   justifyContent: "start",
  //   textTransform: "none",
  //   border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
  //   margin: "20px auto",
  //   borderRadius: "10px",
  // },
  // mobile: {
  //   display: "grid",
  // },
  // desktop: {
  //   marginTop: 4,
  // },
  // delete: {
  //   color: "#fc7ebf",
  //   borderColor: "#fc7ebf",
  // },
  // dialog: {
  //   backgroundColor: theme.palette.primary.light,
  // },
  // comment: {
  //   display: "flow-root",
  //   flexGrow: 1,
  // },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminPeople = () => {
  const classes = useStyles();

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

  const { data: results, mutate } = useSWR("/api/admin/users", fetcher);

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
                // className={classes.buttonPost}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  textTransform: "none",
                  border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
                  margin: "20px auto",
                  borderRadius: "10px",
                }}
              >
                <div
                  // className={classes.comment}
                  style={{ display: "flow-root", flexGrow: 1 }}
                >
                  <Link underline="hover">{result.name}</Link>

                  <Typography>bio: {result.bio}</Typography>
                  <Typography>email: {result.email}</Typography>
                  <Typography>
                    website:{" "}
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {result.website}
                    </Link>
                  </Typography>
                  <Typography>
                    socials:{" "}
                    {result.socials.map((social) => (
                      <>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          {social}
                        </Link>
                        ,{" "}
                      </>
                    ))}
                  </Typography>

                  <Typography>denials: {result.denials}</Typography>
                </div>

                <div
                  // className={classes.mobile}
                  style={{ display: "grid" }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleOpenDialog("Approve", "Person", result)
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    // className={classes.desktop}
                    sx={{ marginTop: "4px" }}
                    onClick={() => handleOpenDialog("Deny", "Person", result)}
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
                    onClick={() => handleOpenDialog("Delete", "Person", result)}
                  >
                    Delete
                  </Button>
                </div>
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
        <Header title="People" />
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

export default adminPeople;
