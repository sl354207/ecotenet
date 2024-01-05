import PostList from "@components/layouts/PostList";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import fetcher from "@utils/fetcher";
import useSWRInfinite from "swr/infinite";

// UPDATE
const PAGE_SIZE = 2;
const LatestDialog = ({ latest, setLatest }) => {
  const handleCloseDialog = () => {
    setLatest(false);
  };
  const { data, error, mutate, size, setSize, isLoading } = useSWRInfinite(
    (index) => `/api/latest?page=${index + 1}`,
    fetcher,
    { revalidateFirstPage: false, shouldRetryOnError: false }
  );

  const posts = data ? [].concat(...data) : [];

  const isEmpty = data && data?.[size - 1]?.length === 0;

  const underPageSize = data && data?.[size - 1]?.length < PAGE_SIZE;

  const isReachingEnd = isEmpty || underPageSize;

  let list;

  if (error) {
    list = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button variant="outlined" color="error" onClick={() => mutate()}>
          Error Loading. Retry
        </Button>
      </div>
    );
  } else {
    list = (
      <>
        {data && (
          <PostList
            posts={data && posts}
            handleClose={handleCloseDialog}
            search={true}
          />
        )}
        <Button
          disabled={isLoading || isReachingEnd}
          onClick={() => {
            setSize(size + 1);
          }}
          variant="outlined"
          color="secondary"
          sx={{ display: "block", margin: "auto" }}
        >
          {isLoading
            ? "loading..."
            : isReachingEnd
            ? "no more posts"
            : "load more"}
        </Button>
      </>
    );
  }

  return (
    <Dialog
      open={latest}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="md"
      scroll="paper"
      disableScrollLock
      sx={{
        "&.MuiModal-root": {
          top: "30px",
          bottom: 0,
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
          Latest Posts
        </DialogTitle>
        <IconButton
          sx={{ marginLeft: "auto" }}
          color="secondary"
          onClick={handleCloseDialog}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent>{list}</DialogContent>
    </Dialog>
  );
};

export default LatestDialog;
