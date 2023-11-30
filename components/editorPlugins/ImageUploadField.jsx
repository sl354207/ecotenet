import { useImageClassifyContext } from "@components/context/ImageClassifyContext";
import { useUserContext } from "@components/context/UserContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  Typography,
  createFilterOptions,
  useMediaQuery,
} from "@mui/material";
import { useImageClassifier } from "@utils/moderation";
import theme from "@utils/theme";
import { validImagePluginURL } from "@utils/validationHelpers";
import { useRouter } from "next/router";
import { useState } from "react";
import { connectField } from "uniforms";

//CHECK UNIFORMS DOCS DOCS for more details on how component works.

const NO_FILE_ERROR_CODE = 1;
const BAD_EXTENSION_ERROR_CODE = 2;
const TOO_BIG_ERROR_CODE = 3;
const UPLOADING_ERROR_CODE = 4;
const DELETING_ERROR_CODE = 5;
const INAPPROPRIATE_ERROR_CODE = 6;
const BAD_LINK_ERROR_CODE = 7;

function ImageUploadField({ onChange, value }) {
  const { user } = useUserContext();
  const { model } = useImageClassifyContext();

  const router = useRouter();
  const postId = router.query._id;

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filter = createFilterOptions();

  const maxFileSize = 5242880;

  const [image, setImage] = useState(
    value || { url: undefined, saved: false, file: {} }
  );
  // console.log(image.url);
  const [state, setState] = useState({
    isUploading: false,
    isDeleting: false,
    hasError: false,
    errorText: "",
  });

  const hasExtension = (fileName) => {
    // allowed extensions
    const regex = /(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$/i;
    return regex.test(fileName.toLowerCase());
  };

  const handleError = (errorCode) => {
    // console.log(errorCode)
    let errorText;

    switch (errorCode) {
      case NO_FILE_ERROR_CODE:
        errorText = "No file selected";

        break;
      case BAD_EXTENSION_ERROR_CODE:
        errorText = "Invalid file type";

        break;
      case TOO_BIG_ERROR_CODE:
        errorText = "File is too big";

        break;
      case UPLOADING_ERROR_CODE:
        errorText = "Error uploading";

        break;
      case DELETING_ERROR_CODE:
        errorText = "Error deleting";

        break;
      case INAPPROPRIATE_ERROR_CODE:
        errorText = "Inappropriate content";

        break;
      case BAD_LINK_ERROR_CODE:
        errorText = "Invalid link";

        break;
      default:
        errorText = "Unknown error";

        break;
    }

    setState({ ...state, hasError: true, errorText: errorText });
    setTimeout(
      () => setState({ ...state, hasError: false, errorText: "" }),
      3000
    );
  };

  const handleFileSelected = async (e) => {
    // console.log(e);
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
      handleError(TOO_BIG_ERROR_CODE);
      return;
    } else {
      setState({ ...state, isUploading: true });
      // convert img from File to Image type for classification
      if (!model) {
        handleError(UPLOADING_ERROR_CODE);
      } else {
        const classifyImg = new Image();
        const objectUrl = URL.createObjectURL(file);
        classifyImg.src = objectUrl;
        classifyImg.onerror = async (error) => {
          console.log(error);

          handleError(UPLOADING_ERROR_CODE);

          setTimeout(
            () => setState({ ...state, hasError: false, errorText: "" }),
            3000
          );
        };
        classifyImg.onload = async () => {
          try {
            const inappropriateImage = await useImageClassifier(
              model,
              classifyImg
            );

            if (inappropriateImage) {
              setState({ ...state, isUploading: false });
              handleError(INAPPROPRIATE_ERROR_CODE);
            } else {
              const imageUrl = URL.createObjectURL(file);

              setImage({ url: "blob", saved: false, file: file });

              onChange({ url: imageUrl, saved: false, file: file });
              setState({ ...state, isUploading: false });
            }

            URL.revokeObjectURL(objectUrl);
          } catch (error) {
            console.log(error);
            handleError(UPLOADING_ERROR_CODE);
            setState({ ...state, isUploading: false });
          }
        };
      }
    }
  };
  const handleImageUrl = async (e, newValue) => {
    if (newValue === null) {
      onChange({ url: undefined, saved: false, file: {} });
      setImage({ url: undefined, saved: false, file: {} });
    }
    if (newValue && newValue !== null) {
      const imageUrl = newValue.inputValue;
      if (!validImagePluginURL(imageUrl)) {
        setState({ ...state, isUploading: false });
        handleError(BAD_LINK_ERROR_CODE);
      } else {
        setState({ ...state, isUploading: true });
        if (!model) {
          handleError(UPLOADING_ERROR_CODE);
        } else {
          // convert img from File to Image type for classification
          const classifyImg = new Image();
          classifyImg.src = imageUrl;
          classifyImg.onerror = async (error) => {
            console.log(error);

            handleError(BAD_LINK_ERROR_CODE);

            setTimeout(
              () => setState({ ...state, hasError: false, errorText: "" }),
              3000
            );
          };

          classifyImg.onload = async () => {
            classifyImg.crossOrigin = "anonymous";

            if (classifyImg.complete) {
              // console.log(classifyImg);
              try {
                const inappropriateImage = await useImageClassifier(
                  model,
                  classifyImg
                );

                if (inappropriateImage) {
                  setState({ ...state, isUploading: false });
                  handleError(INAPPROPRIATE_ERROR_CODE);
                } else {
                  setImage({ url: imageUrl, saved: false, file: {} });
                  onChange({ url: imageUrl, saved: false, file: {} });
                  setState({ ...state, isUploading: false });
                }
              } catch (error) {
                console.log(error);
                handleError(UPLOADING_ERROR_CODE);
                setState({ ...state, isUploading: false });
              }
            }
          };
        }
      }
    }
  };

  const uploadFile = async (photo, callback) => {
    const res = await fetch(
      `/api/dashboard/media?name=${user.name}&post_id=${postId}&ext=${photo.type}`
    );

    if (res.ok) {
      const url = await res.json();
      const res1 = await fetch(url, {
        method: "Put",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: photo,
      });

      if (res1.ok) {
        const imageUrl = url.split("?")[0];

        // // add callback so url is available outside function.
        callback(imageUrl);
      } else {
        return "error";
      }
    } else {
      return "error";
    }
  };

  const deleteFile = async (photo, callback) => {
    const key = photo.substring(photo.lastIndexOf("/") + 1);

    // get secure url from our server

    const res = await fetch(
      `/api/dashboard/media/${user.name}?post_id=${postId}&key=${key}`
    );

    if (res.ok) {
      const url = await res.json();

      const res1 = await fetch(url, {
        method: "Delete",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res1.ok) {
        const imageUrl = undefined;

        // // add callback so url is available outside function.
        callback(imageUrl);
      } else {
        return "error";
      }
    } else {
      return "error";
    }
  };
  const saveImage = async (img) => {
    setState({ ...state, isUploading: true });

    const res = await uploadFile(img, async function (url) {
      // call onChange with fetched url to make available to component.

      onChange({ url: url, saved: true, file: img });
    });
    if (res === "error") {
      setState({ ...state, isUploading: false });

      handleError(UPLOADING_ERROR_CODE);
      setImage({ url: "blob", saved: false, file: img });
    } else {
      setImage({ url: "blob", saved: true, file: img });

      setState({ ...state, isUploading: false });
    }
  };
  const deleteImage = async (img) => {
    if (img.saved) {
      setState({ ...state, isDeleting: true });

      const res = await deleteFile(img.url, async function (url) {
        // call onChange with fetched url to make available to component.

        onChange({ url: url, saved: false, file: {} });
      });
      if (res === "error") {
        setState({ ...state, isDeleting: false });

        handleError(DELETING_ERROR_CODE);
      } else {
        setImage({ url: undefined, saved: false, file: {} });

        setState({ ...state, isDeleting: false });
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
      case "Invalid file type":
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
      case "Error uploading":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
        break;
      case "Error deleting":
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
      case "Inappropriate content":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
        break;
      case "Invalid link":
        saveInside = <>save image</>;
        uploadInside = (
          <>
            {state.errorText}
            <ErrorIcon sx={{ marginLeft: "8px" }} />
          </>
        );
        deleteInside = <>delete image</>;
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
        <Button
          disabled={
            state.isUploading ||
            state.isDeleting ||
            (image.url && image.url !== "" && image.url.startsWith("blob:")) ||
            (image.url !== undefined && image.url !== "")
          }
          variant="contained"
          color={state.hasError ? "error" : "primary"}
          component="label"
          // size={isMobile ? "small" : "medium"}
          size="small"
        >
          {uploadInside}

          <label htmlFor="file-input"></label>
          <input
            id="file-input"
            style={{ display: "none" }}
            type="file"
            onChange={handleFileSelected}
          />
        </Button>

        <Typography variant="body1" sx={{ margin: "20px 16px 0 16px" }}>
          or
        </Typography>
        <Autocomplete
          value={
            value.url &&
            (value.url.startsWith("blob:") ||
              value.url.startsWith("https://eco-media-bucket.s3"))
              ? ""
              : value.url || ""
          }
          disabled={
            (value.url && value.url.startsWith("blob:")) ||
            (value.url && value.url.startsWith("https://eco-media-bucket.s3"))
              ? true
              : false
          }
          // value={value}
          onChange={handleImageUrl}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                title: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          options={[]}
          getOptionLabel={(option) => {
            // e.g value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.title;
          }}
          autoHighlight
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          freeSolo
          renderInput={(params) => (
            <TextField
              sx={{
                display: "flex",
                flexGrow: 1,
                marginBottom: "5px",
                marginRight: "5px",
                width: "350px",
                [theme.breakpoints.down("md")]: {
                  width: "250px",
                  display: "flex",
                  marginBottom: "5px",
                  marginRight: "5px",
                },
                [theme.breakpoints.down("sm")]: {
                  width: "150px",
                  display: "flex",
                  marginBottom: "5px",
                  marginRight: "5px",
                },
              }}
              {...params}
              placeholder="http://example.com/image.png"
              label="Existing image URL"
              name="url"
              id="url"
              variant="standard"
              ref={params.InputProps.ref}
              inputProps={{
                ...params.inputProps,
                type: "url",
                maxLength: 300,
              }}
            />
          )}
        />
      </div>
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          color={state.errorText === "Error uploading" ? "error" : "warning"}
          fullWidth
          size={isMobile ? "small" : "medium"}
          sx={{
            marginRight: "5px",
          }}
          disabled={
            state.errorText === "Error deleting" ||
            state.isUploading ||
            state.isDeleting ||
            image.url === undefined ||
            (image.url !== "blob" && image.url.startsWith("blob:") === false) ||
            image.saved === true
          }
          onClick={() => {
            saveImage(value.file);
          }}
        >
          {saveInside}
        </Button>
        <Button
          variant="contained"
          color={state.errorText === "Error deleting" ? "error" : "primary"}
          fullWidth
          size={isMobile ? "small" : "medium"}
          sx={{ marginLeft: "5px" }}
          onClick={() => deleteImage(value)}
          disabled={
            state.errorText === "Error uploading" ||
            state.isUploading ||
            state.isDeleting ||
            image.url === undefined ||
            image.url === "" ||
            (image.url !== "blob" &&
              !image.url.startsWith("https://eco-media-bucket.s3") &&
              !image.url.startsWith("blob:"))
          }
        >
          {deleteInside}
        </Button>
      </div>
    </>
  );
}

export default connectField(ImageUploadField);
