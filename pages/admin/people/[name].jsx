import AdminDialog from "@components/dialogs/AdminDialog";
import Resolve from "@components/dialogs/Resolve";
import Header from "@components/Header";
import {
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const useStyles = makeStyles((theme) => ({
  profile: {
    margin: 16,
  },
  socials: {
    display: "grid",
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
    name ? `/api/admin/users/${name}` : null,
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
          onClick={() => handleOpenDialog("Deny", "Person", results)}
        >
          Deny
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          className={`${classes.button} ${classes.delete}`}
          onClick={() => handleOpenDialog("Delete", "Person", results)}
        >
          Delete
        </Button>
        {/* {results.approved == "true" && ( */}
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
              Personal Website: <Link underline="hover">{results.website}</Link>
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
                  underline="hover"
                >
                  {social}
                </Link>
              ))}
            </Typography>
          )}
        </div>
        {/* )} */}
      </>
    );
  }
  return (
    <>
      <Link href="/admin/flags" underline="hover">
        &#10229;Flags
      </Link>
      <Container>
        {person}
        <AdminDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          className={classes.dialog}
          result={item}
        />
        <Resolve
          open={resolve}
          handleClose={handleCloseResolve}
          name={flagee}
          ID={flag}
        />
      </Container>
    </>
  );
};

export default person;
