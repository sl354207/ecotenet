import React from 'react';
import { HTMLFieldProps, connectField } from 'uniforms';

import BackupIcon from '@material-ui/icons/Backup';

type ImageProps = HTMLFieldProps<string, HTMLDivElement>;

function ImageUploadField({ onChange, value }: ImageProps) {

  // const uploadFile = async (photo) => {
  //   const url = await URL.createObjectURL(photo);
  //   return url;
  // }

  const uploadFile = async (photo, callback) => {
    const url = "https://api.cloudinary.com/v1_1/demo/upload";
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
    // Reset the upload progress bar
    //  document.getElementById('progress').style.width = 0;
    
    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function(e) {
      // const progress = Math.round((e.loaded * 100.0) / e.total);
      // document.getElementById('progress').style.width = progress + "%";
  
      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
  
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
        const url = response.secure_url;

        callback(url);
        
        //  console.log(url);
        // Create a thumbnail of the uploaded image, with 150px width
        // const tokens = url.split('/');
        // tokens.splice(-2, 0, 'w_150,c_scale');
        // const img = new Image(); // HTML5 Constructor
        // img.src = tokens.join('/');
        // img.alt = response.public_id;
        // document.getElementById('gallery').appendChild(img);
      }
      // console.log(xhr.onreadystatechange);
    };
  
    fd.append('upload_preset', 'doc_codepen_example');
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', photo);
    xhr.send(fd);
  }

  return (
    <div className="ImageField">
      <label htmlFor="file-input">
        <div>Choose your photo</div>
        {value ? (
        /* show preview*/ <img style={{ width: 150 }} src={value} />
        ) : null}

        {/* <img
          alt=""
          style={{ cursor: 'pointer', width: '150px', height: '150px' }}
          src={value}
        /> */}
        <BackupIcon />
      </label>
      <input
        accept="image/*"
        id="file-input"
        onChange={async ({ target: { files } }) => {
          if (files && files[0]) {
            // const url = await uploadFile(files[0], async function(url){
            //   return url;
            // });
            // console.log(url);
            // onChange(url);
            await uploadFile(files[0], async function(url){
              onChange(url);
            });
            // console.log(files[0].name);
          }
        }}
        style={{ display: 'none' }}
        type="file"
      />
    </div>
  );
}

export default connectField(ImageUploadField);