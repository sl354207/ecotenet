import React, { Fragment } from "react"

import Editor from '@react-page/editor';
import '@react-page/editor/lib/index.css';

import slate from '@react-page/plugins-slate';
import '@react-page/plugins-slate/lib/index.css';

import image from '@react-page/plugins-image';
import '@react-page/plugins-image/lib/index.css';

import video from '@react-page/plugins-video';
import '@react-page/plugins-video/lib/index.css';

import spacer from '@react-page/plugins-spacer';
import '@react-page/plugins-spacer/lib/index.css';

import divider from '@react-page/plugins-divider';

import customImage from '../../plugins/customImage'

import EditorLayout from '../EditorLayout';

import { Button } from '@material-ui/core';

// Define which plugins we want to use.
const cellPlugins = [slate(),
  image,
  video,
  spacer,
  divider,
  customImage
];

// take in handleNext to change form step, and editor state values.
const PostEditor = ({handleNext, value, setPostValue}) => {
    
  return (
    <Fragment>
        <EditorLayout>
            <Editor cellPlugins={cellPlugins} value={value} onChange={setPostValue} />
            <div style={{ display: "flex", marginTop: 50, justifyContent: "flex-end" }}>
                <Button variant="contained"  color="primary" onClick={ handleNext }>
                Next
                </Button>
            </div>
        </EditorLayout>
    </Fragment>
    
  );
}

export default PostEditor
