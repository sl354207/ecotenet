// const { getPosts } = require('../../utils/mongodb');
import { Container, Typography } from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import PostList from "../../components/PostList";

import { getFeatured } from "../../utils/mongodb";

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: 20,
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
    <Container>
      <Typography variant="h4" align="center" className={classes.header}>
        Featured Posts
      </Typography>
      <Typography
        variant="body1"
        align="center"
        className={classes.description}
      >
        These are currently our favorite posts picked from the entire site.
      </Typography>
      <PostList posts={featured} featured={true} />
    </Container>
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
