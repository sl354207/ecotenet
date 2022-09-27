import { Button, List, ListItem, Typography } from "@mui/material";

// pass down posts from database to PostList as a prop
const PostList = ({ posts, featured, state, dispatch }) => {
  // console.log(posts);
  const handleSubmit = (result) => {
    // console.log(result);
    // console.log(state);
    switch (state[0].count) {
      case 0:
        dispatch({
          type: "add",
          payload: 1,
          value: result.ecoregions,
          // s_name: result.scientific_name,
          // c_name: result.common_name,
        });
        break;
      case 1:
        dispatch({
          type: "add",
          payload: 2,
          value: result.ecoregions,
          // s_name: result.scientific_name,
          // c_name: result.common_name,
        });
        break;
      case 2:
        dispatch({
          type: "add",
          payload: 3,
          value: result.ecoregions,
          // s_name: result.scientific_name,
          // c_name: result.common_name,
        });
        break;

      default:
      //   throw new Error();
    }
  };
  return (
    <List>
      {posts.map((post) => {
        return (
          <ListItem key={post._id}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                display: "flex",
                justifyContent: "start",
                textTransform: "none",
              }}
              // href={featured ? `/featured/${post._id}` : `/posts/${post._id}`}

              onClick={() => {
                // handleSubmit(post);
                dispatch({
                  type: "add",
                  payload: 0,
                  value: post.ecoregions,
                  // s_name: result.scientific_name,
                  // c_name: result.common_name,
                });
              }}
            >
              <div style={{ flex: "auto", marginRight: "20px" }}>
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
