import { Button, List, ListItem, Typography } from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonpost: {
    display: "flex",
    justifyContent: "start",
    textTransform: "none",
  },

  card: {
    // display: "flex",
    flex: "auto",
    marginRight: 20,
    // display: "block",
    // border: "1px solid #94c9ff",
  },
}));

// pass down posts from database to PostList as a prop
const PostList = ({ posts, featured }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <List>
      {posts.map((post) => {
        return (
          <ListItem key={post._id}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              className={classes.buttonpost}
              href={featured ? `featured/${post._id}` : `posts/${post._id}`}
            >
              <div className={classes.card}>
                <Typography
                  gutterBottom
                  variant="h5"
                  color="textPrimary"
                  align="left"
                >
                  {post.title}
                </Typography>
                <Typography gutterBottom color="textPrimary" align="left">
                  {post.description}
                </Typography>
                <Typography gutterBottom color="secondary" align="left">
                  {post.name}
                </Typography>
              </div>
              <div>
                <Typography variant="h6" color="secondary" align="right">
                  {post.count}
                </Typography>
              </div>
            </Button>
          </ListItem>
        );
      })}
    </List>
  );
};

export default PostList;
