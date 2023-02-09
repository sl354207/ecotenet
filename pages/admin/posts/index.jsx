import AdminDrawer from "@components/drawers/AdminDrawer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import fetcher from "@utils/fetcher";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const adminPosts = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const {
    data: results,
    isLoading,
    error,
  } = useSWR("/api/admin/posts?q1=published&q2=pending", fetcher, {
    shouldRetryOnError: false,
  });

  let list;

  if (isLoading) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
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
            onClick={() => mutate("/api/admin/posts?q1=published&q2=pending")}
          >
            Error Loading. Retry
          </Button>
        </div>
      );
    } else {
      if (Array.isArray(results) && results.length == 0) {
        list = (
          <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
            no results
          </Typography>
        );
      } else {
        list = (
          <List>
            {results.map((result) => {
              return (
                <>
                  <ListItemButton
                    key={result._id}
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      textTransform: "none",
                      border: `1px solid ${alpha(
                        theme.palette.secondary.main,
                        1
                      )}`,
                      margin: "20px auto",
                      borderRadius: "10px",
                    }}
                    onClick={() => router.push(`/admin/posts/${result._id}`)}
                  >
                    <div style={{ display: "flow-root", flexGrow: 1 }}>
                      <Link
                        href={`/admin/people/${result.name}`}
                        underline="hover"
                      >
                        {result.name}
                      </Link>

                      <ListItemText primary={result.title}></ListItemText>
                    </div>

                    <Link href={`/admin/posts/${result._id}`} underline="hover">
                      View Post
                    </Link>
                  </ListItemButton>
                </>
              );
            })}
          </List>
        );
      }
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminDrawer />
      <div style={{ flexGrow: 1, padding: theme.spacing(3) }}>
        <Header title="Posts" />
        {list}
      </div>
    </div>
  );
};

export default adminPosts;
