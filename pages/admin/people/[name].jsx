// import Meta from "../../components/Meta";

// import { getPosts } from "../../utils/mongodb";
// import { getPerson } from "../../utils/mongodb";
// import { getProfilePosts } from "../../utils/mongodb";

// import Link from "next/link";

//do I need to import react
import { useState } from "react";

import {
  Button,
  IconButton,
  Typography,
  Link,
  Container,
  Divider,
  Snackbar,
  CircularProgress,
} from "@material-ui/core";

import FlagIcon from "@material-ui/icons/Flag";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "../../../components/Header";
// import Footer from "../../components/Footer";
// import PostList from "../../components/PostList";
// import Flag from "../../components/dialogs/Flag";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import useSWR from "swr";
import AdminDialog from "../../../components/dialogs/AdminDialog";
import Resolve from "../../../components/dialogs/Resolve";

const useStyles = makeStyles((theme) => ({
  description: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    flexGrow: 1,
    marginLeft: 20,
  },
  items: {
    display: "flex",
    // flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    // color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
  container: {
    backgroundColor: theme.palette.primary.main,
    // marginTop: "20px",
  },
  title: {
    paddingTop: "40px",
  },
  commentsection: {
    marginTop: 20,
  },
  profile: {
    margin: 16,
  },
  socials: {
    display: "grid",
  },
  flagBox: {
    display: "flex",
    justifyContent: "center",
  },
  spacer: {
    display: "flex",
    marginRight: "auto",
    visibility: "hidden",
    minWidth: 30,
  },
  flag: {
    display: "flex",
    marginLeft: "auto",
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
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
}));

const fetcher = (url) => fetch(url).then((r) => r.json());
// pass in post and comments as props and create page for each post with corresponding comments
const person = () => {
  const classes = useStyles();

  const router = useRouter();

  const name = router.query.name;

  const flag = router.query.flag;

  const flagee = router.query.flagee;

  const [dialog, setDialog] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (action, type, result) => {
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleOpenResolve = () => {
    setResolve(true);
  };

  const handleCloseResolve = () => {
    setResolve(false);
  };

  const { data: results } = useSWR(
    name ? `/api/getPerson?q=${name}` : null,
    fetcher
  );

  let person;

  if (!results || results == undefined) {
    person = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        className={classes.progress}
      />
    );
  } else {
    person = (
      <>
        <Header title={results.name} />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleOpenResolve()}
        >
          Resolve
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={() => handleOpenDialog("Deny", "person", results)}
        >
          Deny
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          className={`${classes.button} ${classes.delete}`}
          onClick={() => handleOpenDialog("Delete", "person", results)}
        >
          Delete
        </Button>
        {results.approved == "true" && (
          <div className={classes.profile}>
            {results.bio !== "" && (
              <>
                <Typography gutterBottom>Bio:</Typography>
                <Typography gutterBottom variant="body1">
                  {results.bio}
                </Typography>
              </>
            )}
            {results.website !== "" && (
              <Typography gutterBottom>
                Personal Website: <Link>{results.website}</Link>
              </Typography>
            )}
            {Array.isArray(results.socials) && results.socials.length > 0 && (
              <Typography className={classes.socials} gutterBottom>
                Socials:{" "}
                {results.socials.map((social) => (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${social}`}
                  >
                    {social}
                  </Link>
                ))}
              </Typography>
            )}
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <Link href="/admin/flags">&#10229;Flags</Link>
      <Container>
        {person}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          className={classes.dialog}
          result={item}
          setSnackbar={setSnackbar}
        />
        <Resolve
          open={resolve}
          handleClose={handleCloseResolve}
          name={flagee}
          ID={flag}
          setSnackbar={setSnackbar}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default person;
