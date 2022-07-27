import AdminDrawer from "@components/AdminDrawer";
import Resolve from "@components/dialogs/Resolve";
import Header from "@components/Header";
import {
  Button,
  CircularProgress,
  Link,
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
  // root: {
  //   display: "flex",
  // },
  // content: {
  //   flexGrow: 1,
  //   padding: theme.spacing(3),
  // },
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
  // comment: {
  //   display: "flow-root",
  //   flexGrow: 1,
  // },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminFlags = () => {
  const classes = useStyles();

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ name: "", ID: "" });

  const handleOpenResolve = (name, ID) => {
    setDialog(true);
    setAction({ name: name, ID: ID });
  };

  const handleCloseResolve = () => {
    setDialog(false);
  };

  const { data: results, mutate } = useSWR("/api/admin/flags", fetcher);

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        // className={classes.progress}
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
                  <Typography>
                    Flagged by: <Link underline="hover">{result.name}</Link>
                  </Typography>
                  <Typography>Flag type: {result.type}</Typography>
                  <Typography>Flag text: {result.text}</Typography>
                  <Typography>
                    Name flagged:{" "}
                    <Link underline="hover">{result.flagged}</Link>
                  </Typography>
                </div>

                <div
                  // className={classes.mobile}
                  style={{ display: "grid" }}
                >
                  {result.type == "comment" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`/admin/posts/${result.ref}?q=${result.content_id}&flag=${result._id}&flagee=${result.name}`}
                    >
                      View Post
                    </Button>
                  )}
                  {result.type == "post" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`/admin/posts/${result.content_id}?q=flag&flag=${result._id}&flagee=${result.name}`}
                    >
                      View Post
                    </Button>
                  )}

                  {result.type == "profile" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      href={`/admin/people/${result.flagged}?flag=${result._id}&flagee=${result.name}`}
                    >
                      View Profile
                    </Button>
                  )}
                  {result.type == "ecoregion" && (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`/ecoregions/${result.content_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Page
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        // className={classes.desktop}
                        sx={{ marginTop: "4px" }}
                        onClick={() =>
                          handleOpenResolve(result.name, result._id)
                        }
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {result.type == "species" && (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`/species/${result.content_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Page
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ marginTop: "4px" }}
                        onClick={() =>
                          handleOpenResolve(result.name, result._id)
                        }
                      >
                        Resolve
                      </Button>
                    </>
                  )}
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
        <Header title="Flags" />
        {list}
        <Resolve
          open={dialog}
          handleClose={handleCloseResolve}
          name={action.name}
          ID={action.ID}
          mutate={mutate}
        />
      </div>
    </div>
  );
};

export default adminFlags;
