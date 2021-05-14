import  useSWR  from 'swr'
import { useRouter } from 'next/router'
import Link from 'next/link'

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

import EditorLayout from '../../../components/EditorLayout';
import { Button } from '@material-ui/core';
import customImage from '../../../plugins/customImage'



// Define which plugins we want to use.
const cellPlugins = [slate(),
    image,
    video,
    spacer,
    divider,
    customImage
  ];

// pass in posts from database as a prop
export default function PostByUser() {
    
  // set id to id in url query
  const router = useRouter();
  const  _id  = router.query._id;
  
  // retrieve posts from posts api. convert swr data to name post.
  const { data: post} = useSWR(`/api/getposts/${_id}`)

  // set draft as value of editor
  const [value, setValue] = useState<Value>(post);
  // console.log(value);
  // console.log(setValue);
  
  // set loading state until post data is retrieved
  if (!post) return "Loading...";

  return (
    <div>
    <EditorLayout>
      <Editor cellPlugins={cellPlugins} value={post} onChange={setValue} />
    </EditorLayout>
    <Link href='/dashboard/posts'>Go Back</Link>
  </div>
  )
}