import { useUserContext } from "@components/context/UserContext";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import PostList from "@components/layouts/PostList";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FlagIcon from "@mui/icons-material/Flag";
import { Button, Container, IconButton, Typography } from "@mui/material";
import {
  getAllPeople,
  getPerson,
  getProfilePosts,
} from "@utils/mongodb/mongoHelpers";
import { validName } from "@utils/validationHelpers";
import { signIn } from "next-auth/react";
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";

const DynamicFlag = dynamic(() => import("@components/dialogs/Flag"), {
  ssr: false,
});

const person = ({ person, posts }) => {
  const router = useRouter();
  const { user } = useUserContext();

  const [dialog, setDialog] = useState(false);

  const handleOpenDialog = () => {
    if (user.status === "unauthenticated" || user.status === "loading") {
      signIn();
    }
    if (user.status === "authenticated") {
      if (user.name === null || user.name === "" || user.name === undefined) {
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
      <NextSeo
        title={person.name}
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        openGraph={{
          title: person.name,
          url: `https://www.ecotenet.org/person/${person.name}`,
          type: "profile",
          profile: {
            username: person.name,
          },
          // images: [
          //   {
          //     url: 'https://www.test.ie/images/profile.jpg',
          //     width: 850,
          //     height: 650,
          //     alt: 'Profile Photo',
          //   },
          // ],
        }}
      />
      <SocialProfileJsonLd
        type="Person"
        name={person.name}
        url={`https://www.ecotenet.org/person/${person.name}`}
        sameAs={person.socials}
      />
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
            sx={{ display: "flex", marginLeft: "auto", marginTop: "40px" }}
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

        {person.approved === "true" && (
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

        {posts.length > 0 && (
          <>
            <Typography variant="h6" sx={{ marginLeft: "16px" }}>
              Posts:
            </Typography>
            <PostList posts={posts} />
          </>
        )}

        {dialog && (
          <DynamicFlag
            open={dialog}
            handleClose={() => handleCloseDialog()}
            contentType="profile"
            result={person}
            name={user && user.name}
          />
        )}
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const name = context.params.name;

  if (validName(name)) {
    try {
      let person = await getPerson(name);
      if (person === null) {
        return {
          notFound: true,
        };
      } else {
        if (person.approved !== "true") {
          person = { name: person.name };
        }

        const posts = await getProfilePosts(name);

        return {
          props: {
            person: JSON.parse(JSON.stringify(person)),
            posts: JSON.parse(JSON.stringify(posts)),
          },
          revalidate: 60,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        props: {
          person: null,
          posts: null,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
};

// build routing paths for each post at build time
export const getStaticPaths = async () => {
  const people = await getAllPeople(false);

  const peopleClean = people.filter(function (element) {
    return element.name !== undefined;
  });

  const names = peopleClean.map((person) => person.name);

  // create paths array with objects that follow structure given
  const paths = names.map((name) => ({ params: { name: name.toString() } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default person;
