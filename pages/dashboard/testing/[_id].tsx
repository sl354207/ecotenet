import  useSWR  from 'swr'
import { useRouter } from 'next/router'
import Link from 'next/link'

//do I need to import react
// import React, { useState } from 'react';

// // The editor core
// import Editor, { Value }    from '@react-page/editor';

import StepForm from '../../../components/PostForm/StepForm';

// import the main css, uncomment this: (this is commented in the example because of https://github.com/vercel/next.js/issues/19717)
// import '@react-page/editor/lib/index.css';

// // The rich text area plugin
// import slate from '@react-page/plugins-slate';

// // Stylesheets for the rich text area plugin
// // uncomment this
// import '@react-page/plugins-slate/lib/index.css';

// // image
// import image from '@react-page/plugins-image';

// // Stylesheets for the image plugin
// import '@react-page/plugins-image/lib/index.css';

// // The video plugin
// import video from '@react-page/plugins-video';
// import '@react-page/plugins-video/lib/index.css';

// // The spacer plugin
// import spacer from '@react-page/plugins-spacer';
// import '@react-page/plugins-spacer/lib/index.css';

// // The divider plugin
// import divider from '@react-page/plugins-divider';

// import EditorLayout from '../../../components/EditorLayout';
import { Button } from '@material-ui/core';
// import customImage from '../../../plugins/customImage'



// // Define which plugins we want to use.
// const cellPlugins = [slate(),
//     image,
//     video,
//     spacer,
//     divider,
//     customImage
//   ];


export default function DraftByUser() {
  // set id to id in url query
  const router = useRouter();
  const  _id  = router.query._id;
  
  // retrieve drafts from drafts api. convert swr data to name posts.
  const { data: draft} = useSWR(`/api/getdrafts/${_id}`)

  // console.log(draft);

  
  // set draft as value of editor
  // const [value, setValue] = useState<Value>(draft);
  // console.log(value);
  // console.log(setValue);
  
  // (draft && draft.currentInfo && draft.currentInfo._id) || undefined

  // const update = async (value, _id) => {
    
  //   console.log(_id);
  //   console.log(value);
  //   value = Object.assign(value, {_id: _id});
  //   console.log(value);
  //   const res = await fetch('/api/updateDraft', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(value),
  //   });
  //   // console.log(res);
  // }

  const publish = async (value, _id) => {
    
    // console.log(_id);
    // console.log(value);
    // value = Object.assign(value, {_id: _id});
    // console.log(value);
    const res1 = await fetch('/api/createPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });

    const res2 = await fetch('/api/deleteDraft', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(_id),
      });
    // console.log(res);
  }
  
  // loading state until draft is retrieved
  if (!draft || draft == undefined) return "Loading...";

  return (
      <div>
        <StepForm _id={_id} draft={draft}/>
        {/* <EditorLayout>
          <Editor cellPlugins={cellPlugins} value={draft} onChange={setValue} />
        </EditorLayout> */}
        {/* <Button onClick={()=>update(value, _id)}>Save Draft</Button>
        <Button onClick={()=>publish(value, _id)}>Publish Post</Button> */}
        <Link href='/dashboard/drafts'>Go Back</Link>
      </div>
  )
}