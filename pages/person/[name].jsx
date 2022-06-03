import Flag from "@components/dialogs/Flag";
import Footer from "@components/Footer";
import Header from "@components/Header";
import PostList from "@components/PostList";
import { useUserContext } from "@components/UserContext";
import {
  Container,
  IconButton,
  Link,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FlagIcon from "@material-ui/icons/Flag";
import { Alert } from "@material-ui/lab";
import { getPerson, getProfilePosts } from "@utils/mongodb";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = makeStyles(() => ({
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
    marginTop: "auto",
  },
}));

// pass in post and comments as props and create page for each post with corresponding comments
const person = ({ person, posts }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUserContext();

  const [dialog, setDialog] = useState(false);

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

  const handleOpenDialog = () => {
    if (user.status == "unauthenticated" || user.status == "loading") {
      signIn();
    }
    if (user.status == "authenticated") {
      if (user.name == null || user.name == "" || user.name == undefined) {
        router.push("/auth/new-user");
      } else {
        setDialog(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  return (
    <>
      <Container>
        <div className={classes.flagBox}>
          <div className={classes.spacer}></div>
          <Header title={person.name} />
          <IconButton
            className={classes.flag}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenDialog()}
          >
            <FlagIcon />
          </IconButton>
        </div>

        {person.approved == "true" && (
          <div className={classes.profile}>
            {person.bio !== "" && (
              <>
                <Typography gutterBottom>Bio:</Typography>
                <Typography gutterBottom variant="body1">
                  {person.bio}
                </Typography>
              </>
            )}
            {person.website !== "" && (
              <Typography gutterBottom>
                Personal Website: <Link>{person.website}</Link>
              </Typography>
            )}
            {Array.isArray(person.socials) && person.socials.length > 0 && (
              <Typography className={classes.socials} gutterBottom>
                Socials:{" "}
                {person.socials.map((social) => (
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

        <PostList posts={posts} />
        <Flag
          open={dialog}
          handleClose={() => handleCloseDialog()}
          contentType="profile"
          result={person}
          setSnackbar={setSnackbar}
          name={user.name}
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
      <Footer />
    </>
  );
};

// fetch post data at build time
export const getServerSideProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const name = context.params.name;

  const person = await getPerson(name);

  const posts = await getProfilePosts(name, "published", "true");

  return {
    props: {
      person: JSON.parse(JSON.stringify(person)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

export default person;
