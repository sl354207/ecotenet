import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
// import BackupIcon from '@material-ui/icons/Backup';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ErrorIcon from '@material-ui/icons/Error';
import { useState } from 'react';
import { connectField, HTMLFieldProps } from 'uniforms';



//CHECK UNIFORMS DOCS AND CLOUDINARY DOCS for more details on how component works.

// set types for uniforms. Check uniforms docs for more detail.
type ImageProps = HTMLFieldProps<string, HTMLDivElement>;

// ImageUploadField allows you to upload image file from computer. It then uploads that local file to the cloud and returns the cloud file. The function takes in the field changes through onChange and stores them in value
// function ImageUploadField({ onChange, value }: ImageProps) {
//   // uploadFile takes in the local file as photo, uploads the file to storage and returns the url through xhr. A callback is needed to retrieve the url as it is asynchronous data.  
//   const uploadFile = async (photo, callback) => {
//     // post request url
//     // const url = "https://api.cloudinary.com/v1_1/demo/upload";

//     // // create xhr object. Check docs for more details.
//     // const xhr = new XMLHttpRequest();

//     // // create form data object. FormData api is used to submit xhr data to a form more easily. Check docs.
//     // const fd = new FormData();

//     // // open xhr request to the specified url, set it as an asynchronous POST request.
//     // xhr.open('POST', url, true);

//     // // set name of the header and the value.
//     // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
//     // // Reset the upload progress bar
//     // //  document.getElementById('progress').style.width = 0;
    
//     // // Update progress (can be used to show progress indicator)

//     // // track the progress of the uploaded file
//     // xhr.upload.addEventListener("progress", function(e) {
//     //   // const progress = Math.round((e.loaded * 100.0) / e.total);
//     //   // document.getElementById('progress').style.width = progress + "%";
  
//     //   console.log(`fileuploadprogress data.loaded: ${e.loaded},
//     // data.total: ${e.total}`);
//     // });
  
//     // // handle any functionality returned by request.
//     // xhr.onreadystatechange = function(e) {
//     //   // if fetch is successful return url.
//     //   if (xhr.readyState == 4 && xhr.status == 200) {
//     //     // File uploaded successfully
//     //     const response = JSON.parse(xhr.responseText);
//     //     // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg







//         // console.log(photo.name.split('.')[1])

//         // // get secure url from our server
//         // const url  = await fetch("/api/media").then(res => res.json())
//         // // console.log(url)
      
//         // // post the image direclty to the s3 bucket
//         // await fetch(url, {
//         //   method: "PUT",
//         //   headers: {
//         //     "Content-Type": "multipart/form-data"
//         //   },
//         //   body: photo
//         // })
      
//         // const imageUrl = url.split('?')[0]
//         const imageUrl = URL.createObjectURL(photo);



//         // console.log(typeof imageUrl)

//         // // const url = response.secure_url;

//         // // add callback so url is available outside function.
//         callback(imageUrl);
        
//         //  console.log(url);
//         // Create a thumbnail of the uploaded image, with 150px width
//         // const tokens = url.split('/');
//         // tokens.splice(-2, 0, 'w_150,c_scale');
//         // const img = new Image(); // HTML5 Constructor
//         // img.src = tokens.join('/');
//         // img.alt = response.public_id;
//         // document.getElementById('gallery').appendChild(img);
      
//       // console.log(xhr.onreadystatechange);
//   };
    
//     // add upload preset key:value for cloudinary submission
//     // fd.append('upload_preset', 'doc_codepen_example');

//     // // Optional - add tag for image admin in Cloudinary
//     // fd.append('tags', 'browser_upload');
    
//     // // add file as photo
//     // fd.append('file', photo);

//     // // send form data to server.
//     // xhr.send(fd);
  

//   return (
//     <div className="ImageField">
//       <label
//       //  bind label to input
//        htmlFor="file-input">
//         <div>Choose your photo</div>
//         {/* if there is a file show it otherwise not */}
//         {value ? (
//         /* show preview*/ <img style={{ width: 150 }} src={value} />
//         ) : null}

//         {/* <img
//           alt=""
//           style={{ cursor: 'pointer', width: '150px', height: '150px' }}
//           src={value}
//         /> */}
//         <BackupIcon />
//       </label>
//       <input
//         // only accept image inputs
//         accept="image/*"
//         id="file-input"
//         // when the input changes call function whose event target is the files property from type file (see input type file docs).
//         onChange={async ({ target: { files } }) => {
//           // if a file is present run uploadFile.
//           if (files && files[0]) {
//             // use first file in FileList(see docs). pass in callback function to have access to fetched url asynchronously.
//             await uploadFile(files[0], async function(url){
//               // call onChange with fetched url to make available to component.
//               onChange(url);
//             });
//           }
//         }}
//         // onChange={async (e) => {
//         //   // imagine you have a function that takes a file and returns a url once it is uploaded, e.g. to s3
//         //   const imageUrl = URL.createObjectURL(e.target.files[0]);

//         //   onChange(imageUrl);
//         // }}
//         style={{ display: 'none' }}
//         type="file"
//       />
//     </div>
//   );
// }

// export default connectField(ImageUploadField);
// type ImageLoaded = {
//       file: File;
//       dataUrl: string;
//     };
    
//      type ImageUploaded = {
//       url: string;
//     };
//      type ImageUploadType = (
//       file: File,
//       reportProgress: (progress: number) => void
//     ) => Promise<ImageUploaded>;
    
//      type ImageUploadProps = {
//       imageLoaded?: (image: ImageLoaded) => void;
//       imageUpload: ImageUploadType;
//       imageUploadError?: (errorCode: number) => void;
//       imageUploaded: (resp: ImageUploaded) => void;
      
//     };

 

const NO_FILE_ERROR_CODE = 1;
const BAD_EXTENSION_ERROR_CODE = 2;
const TOO_BIG_ERROR_CODE = 3;
const UPLOADING_ERROR_CODE = 4;

function ImageUploadField({ onChange, value }: ImageProps, {imageUrl}) 
   {
    
  // static defaultProps = {
  //   icon: <CloudUploadIcon style={{ marginLeft: '8px' }} />,
  //   allowedExtensions: ['jpg', 'jpeg', 'png'],
  //   maxFileSize: 5242880,
  //   translations: defaultTranslations,
  // };
  const allowedExtensions = ['jpg', 'jpeg', 'png']
  const maxFileSize = 5242880
  let fileInput
  // fileInput?: HTMLInputElement | null;

  // state: ImageUploadState = {
  //   isUploading: false,
  //   hasError: false,
  //   errorText: '',
  //   progress: 0,
  // };
  // const [isUploading, setIsUploading] = useState(false)
  // const [hasError, setHasError] = useState(false)
  // const [errorText, setErrorText] = useState('')
  // const [progress, setProgress] = useState(0)
  const [state, setState] = useState({
    isUploading: false,
    hasError: false,
    errorText: '',
    progress: 0
  })

  const hasExtension = (fileName: string) => {
    const patternPart = allowedExtensions
      ? allowedExtensions.map((a) => a.toLowerCase()).join('|')
      : '';
    const pattern = '(' + patternPart.replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName.toLowerCase());
  };

  const handleError = (errorCode: number) => {
    console.log(errorCode)
    let errorText: string | null;

    switch (errorCode) {
      case NO_FILE_ERROR_CODE:
        errorText = 'No file selected';
        break;
      case BAD_EXTENSION_ERROR_CODE:
      //  setState( {...state, hasError: true, errorText: 'Bad file type'}) 
       errorText = 'Bad file type'
        break;
      case TOO_BIG_ERROR_CODE:
        errorText = 'File is too big';
        break;
      case UPLOADING_ERROR_CODE:
        errorText = 'Error while uploading';
        break;
      default:
        errorText = 'Unknown error';
        break;
    }
    // Need to flick "isUploading" because otherwise the handler doesn't fire properly
    setState({ ...state, hasError: true, errorText,  }, 
      
    );
    setTimeout(() => setState({ ...state, hasError: false, errorText: '' }), 4000);
  };

  const handleFileSelected = (e) => {
    // console.log(e)
    if (!e.target.files || !e.target.files[0]) {
      handleError(NO_FILE_ERROR_CODE);
      return;
    }
    const file = e.target.files[0];
    console.log(file)
    if (!hasExtension(file.name)) {
      // console.log(file.size)
      handleError(BAD_EXTENSION_ERROR_CODE);
      return;
    }
    if (maxFileSize && file.size > maxFileSize) {
      // console.log(file.size)
      handleError(TOO_BIG_ERROR_CODE);
      return;
    }
    else {
    //   readFile(file).then((data) => (data));
    //   if (imageUpload) {
    //     setState({ ...state, isUploading: true });
    //     imageUpload(file, handleReportProgress)
    //       .then((resp) => {
    //         setState({ ...state, progress: undefined, isUploading: false });
    //         imageUploaded && imageUploaded(resp);
    //       })
    //       .catch((error) => {
    //         setState({ ...state, isUploading: false });
    //         imageUploadError && imageUploadError(error);
    //       });
    // }
    
    // if (imageLoaded) {
    //   readFile(file).then((data) => imageLoaded?.(data));
    // }
    // if (imageUpload) {
    //   setState({ ...state, isUploading: true });
    //   imageUpload(file, handleReportProgress)
    //     .then((resp) => {
    //       setState({ ...state, progress: undefined, isUploading: false });
    //       imageUploaded && imageUploaded(resp);
    //     })
    //     .catch((error) => {
    //       setState({ ...state, isUploading: false });
    //       imageUploadError && imageUploadError(error);
    //     });
    const imageUrl = URL.createObjectURL(file);

          onChange(imageUrl);
    }
  };

  // const readFile = (file: File) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     // Read the image via FileReader API and save image result in state.
  //     reader.onload = function (e: ProgressEvent) {
  //       // Add the file name to the data URL
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       let dataUrl: string = (e.target as any).result;
  //       dataUrl = dataUrl.replace(';base64', `;name=${file.name};base64`);
  //       resolve({ file, dataUrl });
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }

  // const handleFileUploadClick: React.MouseEventHandler<HTMLElement> = () =>
  //   fileInput?.click();

  const handleReportProgress = (progress: number) => setState({ ...state, progress });

  let buttonInside;

  
    if (state.isUploading) {
      buttonInside =  <CircularProgress value={state.progress} size={19} />;
    }
    if (state.hasError) {
      buttonInside = (
        <>
          {state.errorText}
          <ErrorIcon style={{ marginLeft: '8px' }} />
        </>
      );
    }
    else {
     buttonInside = (
        <>
          Upload Image
          <CloudUploadIcon style={{ marginLeft: '8px' }} />
        </>
      );
    } 
  

  
    return (
      <>
      <div style={{display: 'flex'}}>
      {/* <label htmlFor="file-input"> */}
      <Button
          disabled={state.isUploading}
          variant="contained"
          color={state.hasError ? 'secondary' : 'primary'}
          // onClick={handleFileUploadClick}
          component='label'
          size="small"
        >
          {/* {renderChildren()} */}
          {buttonInside}
          {/* {!state.isUploading && ( */}
        <input
          id='file-input'
            style={{ display: 'none' }}
            // ref={(fileInput) => (fileInput = fileInput)}
            type="file"
            onChange={ handleFileSelected}
          />
        {/* )} */}
          
        </Button>
      {/* </label> */}
      <Typography variant="body1" style={{ margin: '20px 16px 0 16px' }}>
              or
            </Typography>
            <TextField
          placeholder='http://example.com/image.png'
          label='Existing image URL'
          name="src"
          // style={{ flex: 1 }}
          value={imageUrl}
          onChange={(e) =>
            {
              const imageUrl = e.target.value
              onChange(imageUrl)
              
            
            }
           
          }
        />
        
        
      </div>
      <Button
      
      variant="contained"
      color={state.hasError ? 'secondary' : 'primary'}
      
     
      
    >
      save
      
    </Button>
      </>
      

    );
  
}

export default connectField(ImageUploadField);