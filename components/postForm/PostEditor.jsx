import Description from "@components/Description";
import EditorLayout from "@components/EditorLayout";
import Header from "@components/Header";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import customImage from "@plugins/customImage";
import Editor from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import image from "@react-page/plugins-image";
import "@react-page/plugins-image/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";

const useStyles = makeStyles(() => ({
  description: {
    marginLeft: 10,
  },
}));

// Define which plugins we want to use.
const cellPlugins = [slate(), image, video, spacer, divider, customImage];

// take in handleNext to change form step, and editor state values.
const PostEditor = ({ value, setPostValue }) => {
  const classes = useStyles();

  return (
    <Container>
      <Header title="Post Body" />
      <Description
        description="This is where the body of your post is created. Using the editor you can
        add blocks of text, images and video. The layout of your post can be
        adjusted by using moving and resizing blocks as well as by adding
        dividers and spacers wherever necessary. You can also preview what the
        body of your post will look like once it is published. If working on
        desktop you may want to adjust your browser window size to see how your
        layout reacts on smaller screens"
        align="left"
        className={classes.description}
      />

      <EditorLayout>
        <Editor
          cellPlugins={cellPlugins}
          value={value}
          onChange={setPostValue}
        />
      </EditorLayout>
    </Container>
  );
};

export default PostEditor;
