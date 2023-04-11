import PostList from "@components/layouts/PostList";
import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const FeatureDialog = ({ feature, setFeature }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const handleCloseFeature = () => {
    setFeature(false);
  };
  const {
    data: results,
    isLoading,
    error,
  } = useSWR("/api/features", fetcher, {
    shouldRetryOnError: false,
  });

  let list;

  if (isLoading) {
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
    if (error) {
      list = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => mutate("/api/features")}
          >
            Error Loading. Retry
          </Button>
        </div>
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
  }

  return (
    <Dialog
      open={feature}
      onClose={handleCloseFeature}
      fullWidth
      maxWidth="md"
      scroll="paper"
      disableScrollLock
      sx={{
        "&.MuiModal-root": {
          top: "30px",
          bottom:
            (Array.isArray(results) && results.length === 0) ||
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

      <DialogContent>
        <Typography variant="body1" align="center">
          Pinned
        </Typography>
        <List sx={{ display: "flex" }}>
          <ListItemButton
            key={"ideas"}
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
          </ListItemButton>
          <ListItemButton
            key={"how"}
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
          </ListItemButton>
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
