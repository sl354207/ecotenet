import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, List, ListItem, Typography } from "@mui/material";

// pass down posts from database to CategoryPostList as a prop
const CategoryPostList = ({ posts, setItemSelect, setItem }) => {
  const { distributionDispatch, setTab } = useHomepageContext();
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
                distributionDispatch({
                  type: "add",
                  payload: 0,
                  value: post.ecoregions,
                  _id: post._id,
                  // s_name: result.scientific_name,
                  // c_name: result.common_name,
                });
                setItemSelect(true);
                setItem(post._id);
                setTab({ id: 2, label: "Distributions" });
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

export default CategoryPostList;
