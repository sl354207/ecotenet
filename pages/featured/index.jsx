// const { getPosts } = require('../../utils/mongodb');
import { Container, Typography } from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import Description from "../../components/Description";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PostList from "../../components/PostList";

import { getFeatured } from "../../utils/mongodb";

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: 40,
  },
  description: {
    marginTop: 20,
    marginBottom: 20,
    // marginLeft: 10,
  },
}));

const featured = ({ featured }) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Container>
        {/* <Typography variant="h4" align="center" className={classes.header}>
        Featured Posts
      </Typography> */}
        <Header title="Featured Posts" />
        {/* <Typography
        variant="body1"
        align="center"
        className={classes.description}
      >
        These are currently our favorite posts picked from the entire site.
      </Typography> */}
        <Description
          description="These are currently our favorite posts picked from the entire site"
          align="center"
        />
        <PostList posts={featured} featured={true} />
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps = async () => {
  const featured = await getFeatured();

  return {
    props: {
      featured: JSON.parse(JSON.stringify(featured)),
    },
  };
};

export default featured;
