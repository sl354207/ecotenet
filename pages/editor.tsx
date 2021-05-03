//do I need to import react
import React, { useState } from 'react';

// The editor core
import Editor, { Value }    from '@react-page/editor';


// import the main css, uncomment this: (this is commented in the example because of https://github.com/vercel/next.js/issues/19717)
import '@react-page/editor/lib/index.css';

// The rich text area plugin
import slate from '@react-page/plugins-slate';

// Stylesheets for the rich text area plugin
// uncomment this
import '@react-page/plugins-slate/lib/index.css';

// image
import image from '@react-page/plugins-image';

// Stylesheets for the image plugin
import '@react-page/plugins-image/lib/index.css';

// The video plugin
import video from '@react-page/plugins-video';
import '@react-page/plugins-video/lib/index.css';

// The spacer plugin
import spacer from '@react-page/plugins-spacer';
import '@react-page/plugins-spacer/lib/index.css';

// The divider plugin
import divider from '@react-page/plugins-divider';

import EditorLayout from '../components/EditorLayout';
import { Button } from '@material-ui/core';

const { getDraftById } = require('../utils/mongodb');  

import customImage from '../plugins/customImage'






// Define which plugins we want to use.
const cellPlugins = [slate(),
  image,
  video,
  spacer,
  divider,
  customImage
];

// pass in test_data from getStaticProps as prop to set value of editor
export default function SimpleExample({ test_data }) {

  // set test_data as value of editor
  const [value, setValue] = useState<Value>(test_data);

  // add value of editor to database from create api endpoint using fetch api(see docs).
  const create = async (value) => {
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
  }

  return (
    <EditorLayout>
      <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
      <Button onClick={()=>create(value)}>test</Button>
    </EditorLayout>
  );
}

// retrieve data at build time
export const getStaticProps = async () => {
  const draft = await getDraftById("608abf484014019848172fdf");
  // console.log(draft);

  return {
    props: {
      test_data: JSON.parse(JSON.stringify(draft))
    }
  }

}