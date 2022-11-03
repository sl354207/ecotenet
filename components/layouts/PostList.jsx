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

// pass down posts from database to PostList as a prop
const PostList = ({ posts, featured, search, handleClose }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    setFS,
    setFSOpen,
    setEcoOpen,
    setFilterOpen,
    distributionDispatch,
    setTab,
  } = useHomepageContext();
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
                if (router.pathname == "/") {
                  setFS(post._id);
                  handleClose();
                  setFilterOpen(false);
                  if (isMobile) {
                    setEcoOpen(false);
                  }

                  setFSOpen(true);
                  distributionDispatch({
                    type: "add",
                    payload: 0,
                    value: post.ecoregions,
                    _id: post._id,
                    // s_name: result.scientific_name,
                    // c_name: result.common_name,
                  });
                  setTab({ id: 2, label: "Distributions" });
                } else {
                  if (search) {
                    handleClose();
                  }

                  router.push(
                    featured ? `/featured/${post._id}` : `/posts/${post._id}`
                  );
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
