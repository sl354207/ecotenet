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
import { CollectionPageJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";

const Featured = ({ featured }) => {
  const router = useRouter();

  const featureSEO = featured.map((post) => {
    const seo = {
      about: post.description,
      author: post.name,
      name: post.title,
    };
    return seo;
  });
  return (
    <>
      <NextSeo
        title="Featured 5"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="These are currently our 5 favorite posts that people have shared on the site"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/featured",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo_social.png",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />
      <CollectionPageJsonLd name="Featured 5" hasPart={featureSEO} />
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="Featured 5" />
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
            <ListItemText align="center">How-to Videos</ListItemText>
          </ListItemButton>
        </List>

        <Typography variant="body1" align="center" sx={{ marginBlock: "10px" }}>
          These are currently our 5 favorite posts that people have shared on
          the site
        </Typography>
        <PostList posts={featured} />
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

export default Featured;
