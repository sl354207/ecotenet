import PostList from "@components/layouts/PostList";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const TiedPostDialog = ({ species, tiedPostDialog, setTiedPostDialog }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const handleCloseDialog = () => {
    setTiedPostDialog(false);
  };
  const {
    data: results,
    isLoading,
    error,
  } = useSWR(`/api/latest?page=1&species=${species}`, fetcher, {
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
            onClick={() => mutate(`/api/latest?page=1&species=${species}`)}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(results) && results.length === 0) {
        list = (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBlock: "20px",
            }}
          >
            No posts found
          </div>
        );
      } else {
        list = (
          <PostList
            posts={results}
            search={true}
            handleClose={handleCloseDialog}
          />
        );
      }
    }
  }

  return (
    <Dialog
      open={tiedPostDialog}
      onClose={handleCloseDialog}
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
            (Array.isArray(results) && results.length < 2)
              ? "auto"
              : 0,
        },
        "&.MuiDialog-root": {
          top: "30px",
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
          Tied Posts
        </DialogTitle>
        <IconButton
          sx={{ marginLeft: "auto" }}
          color="secondary"
          onClick={handleCloseDialog}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Divider
        variant="middle"
        sx={{
          marginTop: "16px",
          color: theme.palette.secondary.main,
        }}
      />
      <DialogContent>{list}</DialogContent>
    </Dialog>
  );
};

export default TiedPostDialog;
