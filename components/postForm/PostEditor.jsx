import React, { Fragment } from "react";

import Editor from "@react-page/editor";
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

import EditorLayout from "../EditorLayout";

import { Button, Container, Typography } from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "../Header";
import Description from "../Description";

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    // flexShrink: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    top: 60,
    marginTop: 20,
    border: "1px solid #94c9ff",
    borderRadius: "10px",
    // position: "sticky",
    // width: "100%",
    // maxWidth: 36,
    // backgroundColor: theme.palette.secondary.main,
  },
  sublist: {
    display: "flex",

    justifyContent: "center",
    // flexShrink: 1,
    // flexWrap: "wrap",

    // width: "100%",
    // maxWidth: 36,
  },
  header: {
    marginTop: 30,
  },

  search: {
    position: "relative",
    // border: "2px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,

    "&:focus-within": {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    // marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginTop: 6,
    marginBottom: 10,
    // marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },
  inputRoot: {
    color: theme.palette.text.primary,
  },
  inputInput: {
    padding: 18,
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em)`,
    // transition: theme.transitions.create("width"),
    // width: "100%",
    // [theme.breakpoints.up("xs")]: {
    //   width: "0ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },
  select: {
    color: theme.palette.text.primary,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        // border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
      "&:hover fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
    },
  },
  popper: {
    backgroundColor: theme.palette.primary.light,
  },
  progress: {
    margin: "100px auto",
    display: "flex",
    justifySelf: "center",
  },
  items: {
    display: "flex",
    flexGrow: 1,
  },
  label: {
    color: `${theme.palette.text.primary}!important`,
    position: "relative",
    transform: "none",
  },
  chipDelete: {
    WebkitTapHighlightColor: "transparent",
    color: theme.palette.secondary.main,
    height: 22,
    width: 22,
    cursor: "pointer",
    margin: "0 5px 0 -6px",
    "&:hover": {
      color: alpha(theme.palette.secondary.main, 0.7),
    },
  },
  chip: {
    borderColor: theme.palette.secondary.main,
    borderWidth: 2,
    color: theme.palette.text.primary,
    // fontSize: 16,
    height: 40,
    margin: "0px 5px 10px 5px",
  },
  form: {
    marginBottom: 12,
  },
  groupLabel: {
    backgroundColor: theme.palette.primary.light,
    color: alpha(theme.palette.text.primary, 0.6),
  },
  noOptions: {
    color: alpha(theme.palette.text.primary, 0.6),
  },
  // required: {
  //   "& .MuiFormLabel-asterisk": {
  //     color: `${theme.palette.secondary.main}!important`,
  //   },
  // },
  helper: {
    color: theme.palette.text.primary,
  },
  description: {
    // marginTop: 20,
    marginLeft: 10,
    // marginBottom: 20,
  },
}));

// Define which plugins we want to use.
const cellPlugins = [slate(), image, video, spacer, divider, customImage];

// take in handleNext to change form step, and editor state values.
const PostEditor = ({ handleNext, value, setPostValue }) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Container>
      {/* <Typography variant="h4" align="center" className={classes.header}>
        Post Details
      </Typography> */}
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
      {/* <Typography variant="body1" align="left" className={classes.description}>
        This is where the body of your post is created. Using the editor you can
        add blocks of text, images and video. The layout of your post can be
        adjusted by using moving and resizing blocks as well as by adding
        dividers and spacers wherever necessary. You can also preview what the
        body of your post will look like once it is published. If working on
        desktop you may want to adjust your browser window size to see how your
        layout reacts on smaller screens
      </Typography> */}
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
