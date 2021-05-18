import React from 'react';

import { HTMLFieldProps, connectField } from 'uniforms';

import BackupIcon from '@material-ui/icons/Backup';

//CHECK UNIFORMS DOCS AND CLOUDINARY DOCS for more details on how component works.

// set types for uniforms. Check uniforms docs for more detail.
type ImageProps = HTMLFieldProps<string, HTMLDivElement>;

// ImageUploadField allows you to upload image file from computer. It then uploads that local file to the cloud and returns the cloud file. The function takes in the field changes through onChange and stores them in value
function ImageUploadField({ onChange, value }: ImageProps) {
  // uploadFile takes in the local file as photo, uploads the file to storage and returns the url through xhr. A callback is needed to retrieve the url as it is asynchronous data.  
  const uploadFile = async (photo, callback) => {
    // post request url
    const url = "https://api.cloudinary.com/v1_1/demo/upload";

    // create xhr object. Check docs for more details.
    const xhr = new XMLHttpRequest();

    // create form data object. FormData api is used to submit xhr data to a form more easily. Check docs.
    const fd = new FormData();

    // open xhr request to the specified url, set it as an asynchronous POST request.
    xhr.open('POST', url, true);

    // set name of the header and the value.
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
    // Reset the upload progress bar
    //  document.getElementById('progress').style.width = 0;
    
    // Update progress (can be used to show progress indicator)

    // track the progress of the uploaded file
    xhr.upload.addEventListener("progress", function(e) {
      // const progress = Math.round((e.loaded * 100.0) / e.total);
      // document.getElementById('progress').style.width = progress + "%";
  
      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
  
    // handle any functionality returned by request.
    xhr.onreadystatechange = function(e) {
      // if fetch is successful return url.
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg


        const url = response.secure_url;

        // add callback so url is available outside function.
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
    
    // add upload preset key:value for cloudinary submission
    fd.append('upload_preset', 'doc_codepen_example');

    // Optional - add tag for image admin in Cloudinary
    fd.append('tags', 'browser_upload');
    
    // add file as photo
    fd.append('file', photo);

    // send form data to server.
    xhr.send(fd);
  }

  return (
    <div className="ImageField">
      <label
      //  bind label to input
       htmlFor="file-input">
        <div>Choose your photo</div>
        {/* if there is a file show it otherwise not */}
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
        // only accept image inputs
        accept="image/*"
        id="file-input"
        // when the input changes call function whose event target is the files property from type file (see input type file docs).
        onChange={async ({ target: { files } }) => {
          // if a file is present run uploadFile.
          if (files && files[0]) {
            // use first file in FileList(see docs). pass in callback function to have access to fetched url asynchronously.
            await uploadFile(files[0], async function(url){
              // call onChange with fetched url to make available to component.
              onChange(url);
            });
          }
        }}
        style={{ display: 'none' }}
        type="file"
      />
    </div>
  );
}

export default connectField(ImageUploadField);