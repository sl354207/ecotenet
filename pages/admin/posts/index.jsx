import AdminDrawer from "@components/AdminDrawer";
import Header from "@components/Header";
import Link from "@components/Link";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import useSWR from "swr";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  // progress: {
  //   margin: "100px auto",
  //   display: "flex",
  //   justifySelf: "center",
  // },
  // header: {
  //   marginTop: 20,
  // },
  // buttonPost: {
  //   display: "flex",
  //   justifyContent: "start",
  //   textTransform: "none",
  //   border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
  //   margin: "20px auto",
  //   borderRadius: "10px",
  // },
  // post: {
  //   display: "flow-root",
  //   flexGrow: 1,
  // },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const adminPosts = () => {
  const classes = useStyles();
  const router = useRouter();

  const { data: results } = useSWR(
    "/api/admin/posts?q1=published&q2=pending",
    fetcher
  );

  let list;

  if (!results || results == undefined) {
    list = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{ margin: "100px auto", display: "flex", justifySelf: "center" }}
      />
    );
  } else if (Array.isArray(results) && results.length == 0) {
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
              <ListItem
                key={result._id}
                // className={classes.buttonPost}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  textTransform: "none",
                  border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
                  margin: "20px auto",
                  borderRadius: "10px",
                }}
                button
                onClick={() => router.push(`/admin/posts/${result._id}`)}
              >
                <div
                  // className={classes.post}
                  style={{ display: "flow-root", flexGrow: 1 }}
                >
                  <Link underline="hover">{result.name}</Link>

                  <ListItemText primary={result.title}></ListItemText>
                </div>

                <Link href={`/admin/posts/${result._id}`} underline="hover">
                  View Post
                </Link>
              </ListItem>
            </>
          );
        })}
      </List>
    );
  }

  return (
    <div
      // className={classes.root}
      style={{ display: "flex" }}
    >
      <AdminDrawer />
      <div
        // className={classes.content}
        style={{ flexGrow: 1, padding: theme.spacing(3) }}
      >
        <Header title="Posts" />
        {list}
      </div>
    </div>
  );
};

export default adminPosts;
