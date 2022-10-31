import EditorLayout from "@components/layouts/EditorLayout";
import Link from "@components/layouts/Link";
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import customImage from "@plugins/customImage";
import Frame from "react-frame-component";
// The editor core
import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";
import theme from "@utils/theme";
import useSWR from "swr";

// Define which plugins we want to use.
const cellPlugins = [slate(), customImage, video, spacer, divider];

const fetcher = (url) => fetch(url).then((r) => r.json());
const DrawerPost = ({ id }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: post } = useSWR(id ? `/api/posts/${id}` : null, fetcher);
  // let date = new Date(post.date);

  let styles = {
    border: "none",
    width: "100%",
    height: "48vh",
  };
  return (
    <>
      {post ? (
        <>
          <>
            <Container sx={{ minHeight: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginBlock: "15px" }}
                  href={`/posts/${post._id}`}
                >
                  visit full post
                </Button>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ marginBottom: "5px" }}
                >
                  {post.title}
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flexDirection: "column",
                    maxWidth: "800px",
                    flexGrow: 1,
                    marginLeft: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <Typography align="center" variant="h6">
                      <Link
                        href={`/person/${post.name}`}
                        color="secondary"
                        underline="hover"
                      >
                        {post.name}
                      </Link>
                    </Typography>
                    <Typography
                      sx={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "1.2rem",
                      }}
                      align="left"
                      variant="h6"
                    >
                      {post.updated && "Updated:"}{" "}
                      {new Date(post.date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <Typography variant="h6">Votes: {post.count}</Typography>
                  <Typography variant="h6">
                    Ecoregions:{" "}
                    {post.ecoregions.map((ecoregion) => (
                      <Link
                        href={`/ecoregions/${ecoregion}`}
                        color="secondary"
                        underline="hover"
                        key={ecoregion}
                      >
                        Eco-{ecoregion},{" "}
                      </Link>
                    ))}
                  </Typography>
                </div>
              </div>
            </Container>

            {isMobile ? (
              <EditorLayout>
                <Editor
                  cellPlugins={cellPlugins}
                  value={post}
                  // onChange={setValue}
                  readOnly
                />
              </EditorLayout>
            ) : (
              <Frame
                style={styles}
                head={
                  <style>
                    {
                      "a {color: #c8fcff; text-decoration: none;overflow-wrap: anywhere;} a:hover {color: #c8fcff; text-decoration: underline; overflow-wrap: anywhere;} p {color:#ffffff; font-weight: 400; font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em; } h2 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} h1 {color:#ffffff;line-height: 1.5; letter-spacing: 0.00938em;} h3 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} h4 {color:#ffffff; font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em;} h5 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} h6 {color:#ffffff; line-height: 1.5; letter-spacing: 0.00938em;} ul {color:#ffffff;  font-weight: 400;font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em;} ol {color:#ffffff;font-weight: 400; font-size: 1.1rem; line-height: 1.5; letter-spacing: 0.00938em;}"
                    }
                  </style>
                }
              >
                <EditorLayout>
                  <Editor
                    cellPlugins={cellPlugins}
                    value={post}
                    // onChange={setValue}
                    readOnly
                  />
                </EditorLayout>
              </Frame>
            )}
          </>
        </>
      ) : (
        <CircularProgress
          color="secondary"
          size={50}
          disableShrink={true}
          sx={{
            margin: "100px auto",
            display: "flex",
            justifySelf: "center",
          }}
        />
      )}
    </>
  );
};

export default DrawerPost;
