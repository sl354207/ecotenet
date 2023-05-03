import Description from "@components/layouts/Description";
import EditorLayout from "@components/layouts/EditorLayout";
import Header from "@components/layouts/Header";
import { Container, createTheme } from "@mui/material";
import customImage from "@plugins/customImage";
import customVideo from "@plugins/customVideo";
import Editor, { defaultThemeOptions } from "@react-page/editor";
import "@react-page/editor/lib/index.css";
import divider from "@react-page/plugins-divider";
import "@react-page/plugins-divider/lib/index.css";
import slate from "@react-page/plugins-slate";
import "@react-page/plugins-slate/lib/index.css";
import spacer from "@react-page/plugins-spacer";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-video/lib/index.css";

const darkTheme = createTheme({
  ...defaultThemeOptions,
  palette: { mode: "dark" },
});

// Define which plugins we want to use.
const cellPlugins = [slate(), customImage, customVideo, spacer, divider];

const PostEditor = ({ value, setPostValue }) => {
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
      />

      <EditorLayout>
        <Editor
          cellPlugins={cellPlugins}
          value={value}
          onChange={setPostValue}
          undoRedoEnabled={false}
          zoomEnabled={false}
          uiTheme={darkTheme}
        />
      </EditorLayout>
    </Container>
  );
};

export default PostEditor;
