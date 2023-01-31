import PostList from "@components/layouts/PostList";
import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import useSWR from "swr";

const FeatureDialog = ({ feature, setFeature }) => {
  const router = useRouter();
  const handleCloseFeature = () => {
    setFeature(false);
  };
  const { data: results } = useSWR("/api/features", fetcher);

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{
          margin: "100px auto",
          display: "flex",
          justifySelf: "center",
        }}
      />
    );
  } else {
    list = (
      <PostList
        posts={results}
        featured={true}
        handleClose={handleCloseFeature}
      />
    );
  }

  return (
    <Dialog
      open={feature}
      onClose={handleCloseFeature}
      fullWidth
      maxWidth="md"
      scroll="paper"
      disableScrollLock
      // hideBackdrop
      sx={{
        "&.MuiModal-root": {
          top: "30px",
          bottom:
            (Array.isArray(results) && results.length == 0) ||
            !results ||
            (Array.isArray(results) && results.length < 5)
              ? "auto"
              : 0,
        },
        "&.MuiDialog-root": {
          top: "30px",
          // bottom: 0,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // marginBottom: "20px",
        }}
      >
        <DialogTitle
          color="textPrimary"
          align="center"
          sx={{ paddingBottom: "0px", position: "fixed" }}
          variant="h5"
        >
          Featured Posts
        </DialogTitle>
        <IconButton
          sx={{ marginLeft: "auto" }}
          color="secondary"
          onClick={handleCloseFeature}
        >
          <CloseIcon />
        </IconButton>
      </div>
      {/* <Divider /> */}

      <DialogContent>
        <Typography variant="body1" align="center">
          Pinned
        </Typography>
        <List sx={{ display: "flex" }}>
          <ListItem
            button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setFeature(false);
              router.push("/ideas");
            }}
            sx={{
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
              borderRadius: "4px",
              marginBottom: "10px",
              marginRight: "5px",
            }}
          >
            <ListItemText align="center">Ideas Behind Ecotenet</ListItemText>
          </ListItem>
          <ListItem
            button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setFeature(false);
              router.push("/how");
            }}
            sx={{
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
              borderRadius: "4px",
              marginBottom: "10px",
              marginLeft: "5px",
            }}
          >
            <ListItemText align="center">How to Create a Post</ListItemText>
          </ListItem>
        </List>
        <Typography variant="body1" align="center">
          These are currently our favorite posts that people have shared on the
          site
        </Typography>
        {list}
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDialog;
