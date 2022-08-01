import { useUserContext } from "@components/UserContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import { useState } from "react";
import { connectField } from "uniforms";

//CHECK UNIFORMS DOCS DOCS for more details on how component works.

const NO_FILE_ERROR_CODE = 1;
const BAD_EXTENSION_ERROR_CODE = 2;
const TOO_BIG_ERROR_CODE = 3;
const UPLOADING_ERROR_CODE = 4;
const DELETING_ERROR_CODE = 4;

function ImageUploadField({ onChange, value }) {
  const { user } = useUserContext();
  const router = useRouter();
  const postId = router.query._id;

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const allowedExtensions = ["jpg", "jpeg", "png"];
  const maxFileSize = 5242880;

  const [image, setImage] = useState(
    value || { url: undefined, saved: false, file: {} }
  );
  // console.log(value);
  const [state, setState] = useState({
    isUploading: false,
    isDeleting: false,
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
      case DELETING_ERROR_CODE:
        errorText = "Error while deleting";

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
    try {
      // // get secure url from our server
      const url = await fetch(
        `/api/dashboard/media?name=${user.name}&post_id=${postId}&type=${photo.type}`
      ).then((res) => res.json());
      // console.log(url)

      // // post the image directly to the s3 bucket
      await fetch(url, {
        method: "Put",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: photo,
      });

      const imageUrl = url.split("?")[0];
      // const imageUrl = URL.createObjectURL(photo);

      // // add callback so url is available outside function.
      callback(imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFile = async (photo, callback) => {
    try {
      const key = photo.substring(photo.lastIndexOf("/") + 1);
      // // get secure url from our server
      const url = await fetch(
        `/api/dashboard/media/${user.name}?post_id=${postId}&key=${key}`
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

      const imageUrl = undefined;

      // // add callback so url is available outside function.
      callback(imageUrl);
    } catch (error) {
      console.error(error);
    }
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
  const deleteImage = async (img) => {
    if (img.saved) {
      setState({ ...state, isDeleting: true });
      try {
        await deleteFile(img.url, async function (url) {
          // call onChange with fetched url to make available to component.

          onChange({ url: url, saved: false, file: {} });
        });
        setImage({ url: undefined, saved: false, file: {} });
        setTimeout(() => setState({ ...state, isDeleting: false }), 4000);
      } catch (error) {
        setState({ ...state, isDeleting: false });
        console.error(error);
        handleError(UPLOADING_ERROR_CODE);
        setImage({ url: undefined, saved: false, file: {} });
      }
    } else {
      img.url = undefined;
      onChange({ url: img.url, saved: false, file: {} });
      setImage({ url: img.url, saved: false, file: {} });
    }
  };

  let uploadInside;
  let saveInside;
  let deleteInside;

  if (state.isUploading) {
    saveInside = <CircularProgress size={19} />;
    uploadInside = (
      <>
        {" "}
        Upload Image
        <CloudUploadIcon sx={{ marginLeft: "8px" }} />
      </>
    );
    deleteInside = <>delete image</>;
  } else if (state.isDeleting) {
    saveInside = <>save image</>;
    uploadInside = (
      <>
        {" "}
        Upload Image
        <CloudUploadIcon sx={{ marginLeft: "8px" }} />
      </>
    );
    deleteInside = <CircularProgress size={19} />;
  } else if (state.hasError) {
    switch (state.errorText) {
      case "":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {" "}
            Upload Image
            <CloudUploadIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
        break;
      case "No file selected":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
      case "Bad file type":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
        break;
      case "File is too big":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
        break;
      case "Error while uploading":
        saveInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        uploadInside = (
          <>
            {" "}
            Upload Image
            <CloudUploadIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
        break;
      case "Error while deleting":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {" "}
            Upload Image
            <CloudUploadIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        break;
      case "Unknown error":
        saveInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
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
        <CloudUploadIcon sx={{ marginLeft: "8px" }} />
      </>
    );
    deleteInside = <>delete image</>;
  }

  return (
    <>
      <div
        style={
          isMobile
            ? { display: "grid" }
            : {
                display: "flex",
                marginBottom: "10px",
              }
        }
      >
        {/* <label htmlFor="file-input"> */}
        <Button
          disabled={
            state.isUploading ||
            state.isDeleting ||
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
        <Typography variant="body1" sx={{ margin: "20px 16px 0 16px" }}>
          or
        </Typography>
        <TextField
          placeholder="http://example.com/image.png"
          label="Existing image URL"
          name="url"
          sx={{
            display: "flex",
            flexGrow: 1,
            marginBottom: "5px",
            width: "300px",
            [theme.breakpoints.down("md")]: {
              width: "250px",
              display: "flex",
            },
          }}
          value={
            value.url &&
            (value.url.startsWith("blob:") ||
              value.url.startsWith("https://eco-media-bucket.s3"))
              ? ""
              : value.url || ""
          }
          // UPDATE DISABLED
          disabled={
            (value.url && value.url.startsWith("blob:")) ||
            (value.url && value.url.startsWith("https://eco-media-bucket.s3"))
          }
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
          sx={{ marginRight: "5px" }}
          disabled={
            state.isUploading ||
            state.isDeleting ||
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
          sx={{ marginLeft: "5px" }}
          onClick={() => deleteImage(value)}
          disabled={
            state.isUploading ||
            state.isDeleting ||
            image.url == undefined ||
            image.url == ""
          }
        >
          {deleteInside}
        </Button>
      </div>
    </>
  );
}

export default connectField(ImageUploadField);
