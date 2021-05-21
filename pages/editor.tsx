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

// pass in draft from getStaticProps as prop to set value of editor
export default function SimpleExample({ draft }) {

  // set draft as value of editor
  const [value, setValue] = useState<Value>(draft);

  // console.log(draft);
  // console.log(draft._id);
  console.log(value);
  // add value of editor to database from create api endpoint using fetch api(see docs).
  const _id = draft._id;
  const create = async (value) => {
    const res = await fetch('/api/createDraft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
  }

  const update = async (value, _id) => {
    
    console.log(_id);
    console.log(value);
    value = Object.assign(value, {_id: _id});
    console.log(value);
    const res = await fetch('/api/updateDraft', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
    console.log(res);
  }
  
  return (
    <EditorLayout>
      <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
      <Button onClick={()=>create(value)}>Create Draft</Button>
      <Button onClick={()=>update(value, _id)}>Save Draft</Button>
    </EditorLayout>
  );
}

// retrieve data at build time
export const getStaticProps = async () => {
  const draft = await getDraftById("609d3d138cd35121f8b5154f");
  // console.log(draft);

  return {
    props: {
      draft: JSON.parse(JSON.stringify(draft))
    }
  }

}