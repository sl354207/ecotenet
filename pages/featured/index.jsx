import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import PostList from "@components/layouts/PostList";
import {
  alpha,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { getFeatures } from "@utils/mongodb/mongoHelpers";
import theme from "@utils/theme";
import { useRouter } from "next/router";

const featured = ({ featured }) => {
  const router = useRouter();
  return (
    <>
      <Container>
        <Header title="Featured Posts" />
        <Typography variant="body1" align="center" sx={{ marginBlock: "10px" }}>
          Pinned
        </Typography>
        <List sx={{ display: "flex" }}>
          <ListItemButton
            key={"ideas"}
            variant="outlined"
            color="secondary"
            onClick={() => {
              router.push("/ideas");
            }}
            sx={{
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
              borderRadius: "4px",
              marginBottom: "10px",
              marginRight: "5px",
            }}
          >
            <ListItemText align="center">Ideas Behind Ecotenet</ListItemText>
          </ListItemButton>
          <ListItemButton
            key={"how"}
            variant="outlined"
            color="secondary"
            onClick={() => {
              router.push("/how");
            }}
            sx={{
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
              borderRadius: "4px",
              marginBottom: "10px",
              marginLeft: "5px",
            }}
          >
            <ListItemText align="center">How to Create a Post</ListItemText>
          </ListItemButton>
        </List>

        <Typography variant="body1" align="center" sx={{ marginBlock: "10px" }}>
          These are currently our favorite posts that people have shared on the
          site
        </Typography>
        <PostList posts={featured} featured={true} />
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = async () => {
  const featured = await getFeatures();

  return {
    props: {
      featured: JSON.parse(JSON.stringify(featured)),
    },
    revalidate: 60,
  };
};

export default featured;
