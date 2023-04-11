import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, List, ListItem, Typography } from "@mui/material";

// pass down posts from database to CategoryPostList as a prop
const CategoryPostList = ({ posts, setItemSelected, setItem }) => {
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
              onClick={() => {
                distributionDispatch({
                  type: "add",
                  payload: 0,
                  value: post.ecoregions,
                  _id: post._id,
                });
                setItemSelected(true);
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
