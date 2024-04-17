import { useHomepageContext } from "@components/context/HomepageContext";
import {
  Button,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "@utils/theme";
import { useRouter } from "next/router";

const PostList = ({ posts, search, handleClose }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { setFS, setFSOpen, setEcoOpen, setFilterOpen, setEcoChips, setTab } =
    useHomepageContext();
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
                if (router.pathname === "/") {
                  setFS({
                    state: search ? "Search Result" : "Feature",
                    item: post._id,
                  });
                  handleClose();
                  setFilterOpen(false);
                  if (isMobile) {
                    setEcoOpen(false);
                  }

                  setFSOpen(true);

                  const result = { ...post };

                  result.unique_id = result.ecoregions;
                  result.id = result._id;
                  delete result.ecoregions;
                  delete result.count;
                  delete result.description;
                  delete result.name;

                  setEcoChips([result]);
                  setTab({ id: 2, label: "Distributions" });
                } else {
                  if (search) {
                    handleClose();
                  }

                  router.push(`/posts/${post._id}`);
                }
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
                <Typography gutterBottom color="textPrimary" align="left">
                  <b>Category:</b> {post.category.title} {" >> "}
                  {post.category.sub}
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
