import PostList from "@components/layouts/PostList";
import CloseIcon from "@mui/icons-material/Close";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const FeatureDialog = ({ feature, setFeature }) => {
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
          marginBottom: "20px",
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

      <DialogContent>{list}</DialogContent>
    </Dialog>
  );
};

export default FeatureDialog;
