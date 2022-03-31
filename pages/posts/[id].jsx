import Meta from "../../components/Meta";

import { getPosts } from "../../utils/mongodb";
import { getPostById } from "../../utils/mongodb";
import { getPostComments } from "../../utils/mongodb";

// import Link from "next/link";

//do I need to import react
import { useState } from "react";

// The editor core
import Editor, { Value } from "@react-page/editor";
import "@react-page/editor/lib/index.css";

import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";

import image from "@react-page/plugins-image";
import "@react-page/plugins-image/lib/index.css";

import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";

import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";

import divider from "@react-page/plugins-divider";

import customImage from "../../plugins/customImage";

import EditorLayout from "../../components/EditorLayout";

import {
  Button,
  IconButton,
  Typography,
  Link,
  Container,
  Divider,
} from "@material-ui/core";

import Comments from "../../components/Comments";
import Vote from "../../components/Vote";
import Nav from "../../components/Nav";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  description: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    flexGrow: 1,
    marginLeft: 20,
  },
  items: {
    display: "flex",
    // flexGrow: 1,
  },

  publish: {
    marginLeft: 20,
    color: theme.palette.secondary.light,
    fontStyle: "italic",
  },
  container: {
    backgroundColor: theme.palette.primary.main,
    // marginTop: "20px",
  },
  title: {
    paddingTop: "40px",
  },
  commentsection: {
    marginTop: 20,
  },
}));

// Define which plugins we want to use.
const cellPlugins = [slate(), image, video, spacer, divider, customImage];

// pass in post and comments as props and create page for each post with corresponding comments
const post = ({ post, comments }) => {
  const classes = useStyles();
  // set post as value of editor
  const [value, setValue] = useState(post);

  return (
    <Container className={classes.container}>
      {/* <Nav /> */}
      <Typography align="center" variant="h4" className={classes.title}>
        {post.title}
      </Typography>
      <div className={classes.description}>
        <div className={classes.content}>
          <div className={classes.items}>
            <Typography align="center" variant="h6">
              <Link href="#" color="secondary">
                {post.name}
              </Link>
            </Typography>
            <Typography className={classes.publish} align="left" variant="h6">
              August 22, 2021
            </Typography>
          </div>
          <Typography variant="h6">
            Ecoregions:{" "}
            {post.ecoregions.map((ecoregion) => (
              <Link href="#" color="secondary">
                Eco-{ecoregion},{" "}
              </Link>
            ))}
          </Typography>
        </div>

        <Vote counter={post.count} />
      </div>
      <EditorLayout>
        <Editor
          cellPlugins={cellPlugins}
          value={value}
          onChange={setValue}
          readOnly
        />
      </EditorLayout>
      <Divider />
      <Typography variant="h6" className={classes.commentsection}>
        Comments:
      </Typography>
      <Comments comments={comments} post_id={post._id} />
      <Link href="/posts">Go Back</Link>
    </Container>
  );
};

// fetch post data at build time
export const getStaticProps = async (context) => {
  // context allows us to fetch specific data points from data such as id
  const _id = context.params.id;

  const post = await getPostById(_id);

  const comments = await getPostComments(post._id.toString());

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
};

// build routing paths for each post at build time
export const getStaticPaths = async () => {
  const posts = await getPosts("published", "true");

  // create array of ids of each post in posts
  const ids = posts.map((post) => post._id);

  // create paths array with objects that follow structure given
  const paths = ids.map((id) => ({ params: { id: id.toString() } }));

  // return a path for each post id. If no id return 404
  return {
    paths,
    fallback: false,
  };
};

export default post;
