import { Button, List, ListItem, Typography } from "@mui/material";

// const useStyles = makeStyles(() => ({
//   // button: {
//   //   display: "flex",
//   //   justifyContent: "start",
//   //   textTransform: "none",
//   // },
//   // card: {
//   //   flex: "auto",
//   //   marginRight: 20,
//   // },
// }));

// pass down posts from database to PostList as a prop
const PostList = ({ posts, featured }) => {
  // const classes = useStyles();

  return (
    <List>
      {posts.map((post) => {
        return (
          <ListItem key={post._id}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              // className={classes.button}
              sx={{
                display: "flex",
                justifyContent: "start",
                textTransform: "none",
              }}
              href={featured ? `/featured/${post._id}` : `/posts/${post._id}`}
            >
              <div
                // className={classes.card}
                style={{ flex: "auto", marginRight: "20px" }}
              >
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
