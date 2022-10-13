import Description from "@components/Description";
import Footer from "@components/Footer";
import Header from "@components/Header";
import PostList from "@components/PostList";
import { Container } from "@mui/material";
import { getFeatures } from "@utils/mongodb/helpers";

const featured = ({ featured }) => {
  return (
    <>
      <Container>
        <Header title="Featured Posts" />

        <Description
          description="These are currently our favorite posts that people have shared on the site"
          align="center"
        />
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
