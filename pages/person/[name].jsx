import Flag from "@components/dialogs/Flag";
import Footer from "@components/Footer";
import Header from "@components/Header";
import Link from "@components/Link";
import PostList from "@components/PostList";
import { useUserContext } from "@components/UserContext";
import FlagIcon from "@mui/icons-material/Flag";
import { Container, IconButton, Typography } from "@mui/material";
import { getPerson, getProfilePosts } from "@utils/mongodb/helpers";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

// pass in post and comments as props and create page for each post with corresponding comments
const person = ({ person, posts }) => {
  const router = useRouter();
  const { user } = useUserContext();

  const [dialog, setDialog] = useState(false);

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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              marginRight: "auto",
              visibility: "hidden",
              minWidth: "30px",
            }}
          ></div>
          <Header title={person.name} />
          <IconButton
            sx={{ display: "flex", marginLeft: "auto", marginTop: "auto" }}
            color="inherit"
            aria-label="flag"
            size="small"
            onClick={() => handleOpenDialog()}
          >
            <FlagIcon />
          </IconButton>
        </div>

        {person.approved == "true" && (
          <div style={{ margin: "16px" }}>
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
                Personal Website:{" "}
                <Link underline="hover">{person.website}</Link>
              </Typography>
            )}
            {Array.isArray(person.socials) && person.socials.length > 0 && (
              <Typography sx={{ display: "grid" }} gutterBottom>
                Socials:{" "}
                {person.socials.map((social) => (
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
        )}

        <PostList posts={posts} />
        <Flag
          open={dialog}
          handleClose={() => handleCloseDialog()}
          contentType="profile"
          result={person}
          name={user && user.name}
        />
      </Container>
      <Footer />
    </>
  );
};

// UPDATE
// fetch post data at build time
export const getServerSideProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const name = context.params.name;

  const person = await getPerson(name);

  const posts = await getProfilePosts(name);

  return {
    props: {
      person: JSON.parse(JSON.stringify(person)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

export default person;
