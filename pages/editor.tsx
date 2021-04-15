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

const { getMovie } = require('../utils/mongodb');  

import testPlugin from '../plugins/testPlugin'






// Define which plugins we want to use.
const cellPlugins = [slate(),
  image,
  video,
  spacer,
  divider,
  testPlugin
];

export default function SimpleExample({ test_data }) {
  
  const [value, setValue] = useState<Value>(test_data);

  const create = async (value) => {
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
    // const response = await res.json();
    // console.log(typeof(value));
    // console.log(response);
  }

  return (
    <EditorLayout>
      <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
      <Button onClick={()=>create(value)}>test</Button>
    </EditorLayout>
  );
}

export const getStaticProps = async () => {
  // const res = await fetch(`${server}/api/articles`)
  // const articles = await res.json()

  // // return articles from data.js
  // return {
  //   props: {
  //     articles
  //   }
  // }

  // const customers = await getCustomers();
  // console.log(customers)

  // return {
  //   props: {
  //     customers
  //   }
  // }

  const movie = await getMovie();
  console.log(movie);

  return {
    props: {
      test_data: JSON.parse(JSON.stringify(movie))
    }
  }

}