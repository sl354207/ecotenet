import { useUserContext } from "@components/context/UserContext";
import Flag from "@components/dialogs/Flag";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import PostList from "@components/layouts/PostList";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FlagIcon from "@mui/icons-material/Flag";
import { Button, Container, IconButton, Typography } from "@mui/material";
import { getPerson, getProfilePosts } from "@utils/mongodb/mongoHelpers";
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
        <Button
          href={`/tip?q=${person.name}`}
          color="secondary"
          variant="outlined"
          sx={{
            display: "flex",
            marginInline: "auto",
            marginTop: "10px",
            maxWidth: "fit-content",
            "& .MuiButton-startIcon": {
              marginRight: "0px",
            },
          }}
          size="medium"
          startIcon={<AttachMoneyIcon />}
        >
          tip
        </Button>

        {person.approved == "true" && (
          <div style={{ margin: "16px" }}>
            {person.bio !== "" && (
              <>
                <Typography variant="h6">Bio:</Typography>
                <Typography gutterBottom variant="body1">
                  {person.bio}
                </Typography>
              </>
            )}
            {person.website !== "" && (
              <Typography variant="h6">
                Personal Website:{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${person.website}`}
                >
                  {person.website}
                </Link>
              </Typography>
            )}
            {Array.isArray(person.socials) && person.socials.length > 0 && (
              <Typography sx={{ display: "grid" }} variant="h6">
                Socials:{" "}
                {person.socials.map((social) => (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${social}`}
                    underline="hover"
                    key={social}
                  >
                    {social}
                  </Link>
                ))}
              </Typography>
            )}
          </div>
        )}
        <Typography variant="h6" sx={{ marginLeft: "16px" }}>
          Posts:
        </Typography>

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

  let person = await getPerson(name);
  if (person.approved !== "true") {
    person = { name: person.name };
  }
  // console.log(person);

  const posts = await getProfilePosts(name);

  return {
    props: {
      person: JSON.parse(JSON.stringify(person)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

export default person;
