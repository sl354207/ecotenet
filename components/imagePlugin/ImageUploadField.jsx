import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useState } from "react";
import { connectField } from "uniforms";

const useStyles = makeStyles((theme) => ({
  upload: {
    display: "flex",
    marginBottom: 10,
    [theme.breakpoints.down("md")]: {
      // width: 250,
      display: "grid",
      // marginBottom: 5,
    },
  },
  field: {
    display: "flex",
    flexGrow: 1,
    marginBottom: 5,
    width: 300,
    [theme.breakpoints.down("md")]: {
      width: 250,
      display: "flex",
    },
  },
}));

//CHECK UNIFORMS DOCS DOCS for more details on how component works.

const NO_FILE_ERROR_CODE = 1;
const BAD_EXTENSION_ERROR_CODE = 2;
const TOO_BIG_ERROR_CODE = 3;
const UPLOADING_ERROR_CODE = 4;

function ImageUploadField({ onChange, value }) {
  const classes = useStyles();

  const allowedExtensions = ["jpg", "jpeg", "png"];
  const maxFileSize = 5242880;

  const [image, setImage] = useState(
    value || { url: undefined, saved: false, file: {} }
  );
  // console.log(value);
  const [state, setState] = useState({
    isUploading: false,
    hasError: false,
    errorText: "",
  });

  const hasExtension = (fileName) => {
    const patternPart = allowedExtensions
      ? allowedExtensions.map((a) => a.toLowerCase()).join("|")
      : "";
    const pattern = "(" + patternPart.replace(/\./g, "\\.") + ")$";
    return new RegExp(pattern, "i").test(fileName.toLowerCase());
  };

  const handleError = (errorCode) => {
    // console.log(errorCode)
    let errorText;

    switch (errorCode) {
      case NO_FILE_ERROR_CODE:
        errorText = "No file selected";

        break;
      case BAD_EXTENSION_ERROR_CODE:
        errorText = "Bad file type";

        break;
      case TOO_BIG_ERROR_CODE:
        errorText = "File is too big";

        break;
      case UPLOADING_ERROR_CODE:
        errorText = "Error while uploading";

        break;
      default:
        errorText = "Unknown error";

        break;
    }

    setState({ ...state, hasError: true, errorText });
    setTimeout(
      () => setState({ ...state, hasError: false, errorText: "" }),
      4000
    );
  };

  const handleFileSelected = (e) => {
    // console.log(e)
    if (!e.target.files || !e.target.files[0]) {
      handleError(NO_FILE_ERROR_CODE);
      return;
    }
    const file = e.target.files[0];
    // console.log(file);
    if (!hasExtension(file.name)) {
      handleError(BAD_EXTENSION_ERROR_CODE);
      return;
    }
    if (maxFileSize && file.size > maxFileSize) {
      // console.log(file.size)
      handleError(TOO_BIG_ERROR_CODE);
      return;
    } else {
      const imageUrl = URL.createObjectURL(file);

      setImage({ url: "blob", saved: false, file: file });

      onChange({ url: imageUrl, saved: false, file: file });
    }
  };

  const uploadFile = async (photo, callback) => {
    // post request url
    // const url = "https://api.cloudinary.com/v1_1/demo/upload";

    // // create xhr object. Check docs for more details.
    // const xhr = new XMLHttpRequest();

    // // create form data object. FormData api is used to submit xhr data to a form more easily. Check docs.
    // const fd = new FormData();

    // // open xhr request to the specified url, set it as an asynchronous POST request.
    // xhr.open('POST', url, true);

    // // set name of the header and the value.
    // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // // Reset the upload progress bar
    // //  document.getElementById('progress').style.width = 0;

    // // Update progress (can be used to show progress indicator)

    // // track the progress of the uploaded file
    // xhr.upload.addEventListener("progress", function(e) {
    //   // const progress = Math.round((e.loaded * 100.0) / e.total);
    //   // document.getElementById('progress').style.width = progress + "%";

    //   console.log(`fileuploadprogress data.loaded: ${e.loaded},
    // data.total: ${e.total}`);
    // });

    // // handle any functionality returned by request.
    // xhr.onreadystatechange = function(e) {
    //   // if fetch is successful return url.
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     // File uploaded successfully
    //     const response = JSON.parse(xhr.responseText);
    //     // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg

    // console.log(photo.name.split('.')[1])
    try {
      // // get secure url from our server
      const url = await fetch(
        `/api/media?name=muskrat&id=todd&type=${photo.type}`
      ).then((res) => res.json());
      // console.log(url)

      // // post the image directly to the s3 bucket
      await fetch(url, {
        method: "Delete",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // body: photo,
      });

      const imageUrl = url.split("?")[0];
      // const imageUrl = URL.createObjectURL(photo);

      // // add callback so url is available outside function.
      callback(imageUrl);
    } catch (error) {
      console.error(error);
    }

    //  console.log(url);
    // Create a thumbnail of the uploaded image, with 150px width
    // const tokens = url.split('/');
    // tokens.splice(-2, 0, 'w_150,c_scale');
    // const img = new Image(); // HTML5 Constructor
    // img.src = tokens.join('/');
    // img.alt = response.public_id;
    // document.getElementById('gallery').appendChild(img);

    // console.log(xhr.onreadystatechange);
  };
  const saveImage = async (img) => {
    setState({ ...state, isUploading: true });
    try {
      await uploadFile(img, async function (url) {
        // call onChange with fetched url to make available to component.

        onChange({ url: url, saved: true, file: img });
      });
      setImage({ url: "blob", saved: true, file: img });
      setTimeout(() => setState({ ...state, isUploading: false }), 4000);
    } catch (error) {
      setState({ ...state, isUploading: false });
      console.error(error);
      handleError(UPLOADING_ERROR_CODE);
      setImage({ url: undefined, saved: false, file: img });
    }
  };
  const deleteImage = (img) => {
    img.url = undefined;
    onChange({ url: img.url, saved: false, file: {} });
    setImage({ url: img.url, saved: false, file: {} });
  };

  let uploadInside;
  let saveInside;

  if (state.isUploading) {
    saveInside = <CircularProgress size={19} />;
    uploadInside = (
      <>
        {" "}
        Upload Image
        <CloudUploadIcon style={{ marginLeft: "8px" }} />
      </>
    );
  } else if (state.hasError) {
    switch (state.errorText) {
      case "":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {" "}
            Upload Image
            <CloudUploadIcon style={{ marginLeft: "8px" }} />
          </>
        );
        break;
      case "No file selected":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon style={{ marginLeft: "8px" }} />
          </>
        );
      case "Bad file type":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon style={{ marginLeft: "8px" }} />
          </>
        );
        break;
      case "File is too big":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon style={{ marginLeft: "8px" }} />
          </>
        );
        break;
      case "Error while uploading":
        saveInside = (
          <>
            {state.errorText}
            <ErrorIcon style={{ marginLeft: "8px" }} />
          </>
        );
        uploadInside = (
          <>
            {" "}
            Upload Image
            <CloudUploadIcon style={{ marginLeft: "8px" }} />
          </>
        );
        break;
      case "Unknown error":
        saveInside = (
          <>
            {state.errorText}
            <ErrorIcon style={{ marginLeft: "8px" }} />
          </>
        );
        uploadInside = (
          <>
            {" "}
            Upload Image
            <CloudUploadIcon style={{ marginLeft: "8px" }} />
          </>
        );
        break;

      default:
        break;
    }
  } else {
    saveInside = <>save image</>;
    uploadInside = (
      <>
        {" "}
        Upload Image
        <CloudUploadIcon style={{ marginLeft: "8px" }} />
      </>
    );
  }

  return (
    <>
      <div className={classes.upload}>
        {/* <label htmlFor="file-input"> */}
        <Button
          disabled={
            (image.url && image.url !== "" && image.url.startsWith("blob:")) ||
            (image.url !== undefined && image.url !== "")
          }
          variant="contained"
          color={state.hasError ? "error" : "primary"}
          // onClick={handleFileUploadClick}
          component="label"
        >
          {uploadInside}

          {/* {!state.isUploading && ( */}
          <input
            id="file-input"
            style={{ display: "none" }}
            // ref={(fileInput) => (fileInput = fileInput)}
            type="file"
            onChange={handleFileSelected}
          />
          {/* )} */}
        </Button>
        {/* </label> */}
        <Typography variant="body1" style={{ margin: "20px 16px 0 16px" }}>
          or
        </Typography>
        <TextField
          placeholder="http://example.com/image.png"
          label="Existing image URL"
          name="url"
          // style={{ flex: 1 }}
          className={classes.field}
          value={image.url || ""}
          // UPDATE DISABLED
          disabled={image.url && value.url.startsWith("blob:")}
          onChange={(e) => {
            const imageUrl = e.target.value;
            setImage({ url: imageUrl, saved: false, file: {} });
            onChange({ url: imageUrl, saved: false, file: {} });
          }}
        />
      </div>
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          color={state.hasError ? "error" : "warning"}
          fullWidth
          style={{ marginRight: 5 }}
          disabled={
            image.url == undefined ||
            (image.url !== "blob" && image.url.startsWith("blob:") == false) ||
            image.saved == true
          }
          onClick={() => {
            saveImage(value.file);
          }}
        >
          {saveInside}
        </Button>
        <Button
          variant="contained"
          color={state.hasError ? "secondary" : "primary"}
          fullWidth
          style={{ marginLeft: 5 }}
          onClick={(value) => deleteImage(value)}
          disabled={image.url == undefined || image.url == ""}
        >
          delete image
        </Button>
      </div>
    </>
  );
}

export default connectField(ImageUploadField);
