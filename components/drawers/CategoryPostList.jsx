import { useHomepageContext } from "@components/context/HomepageContext";
import { Button, List, ListItem, Typography } from "@mui/material";

const CategoryPostList = ({ posts, setItemSelected, setItem }) => {
  const { setEcoChips, setTab } = useHomepageContext();
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
                const result = { ...post };

                result.observed_ecoregions = result.ecoregions;
                result.native = false;
                result.id = result._id;
                delete result.ecoregions;
                delete result.count;
                delete result.description;
                delete result.name;

                setEcoChips([result]);

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
