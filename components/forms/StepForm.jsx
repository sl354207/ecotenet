import { useSnackbarContext } from "@components/context/SnackbarContext";
import Link from "@components/layouts/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  CircularProgress,
  Step,
  StepButton,
  Stepper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { updatePost } from "@utils/apiHelpers";
import theme from "@utils/theme";
import { isEqual } from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostDetails from "./PostDetails";
import PostEditor from "./PostEditor";
import PostRegion from "./PostRegion";

const DynamicDashboardDialog = dynamic(
  () => import("@components/dialogs/DashboardDialog"),
  {
    ssr: false,
  }
);

// pass in post and url path as props
const StepForm = ({ post, user }) => {
  const router = useRouter();

  const {
    title,
    description,
    category,
    originalUrl,
    tags,
    ecoregions,
    id,
    version,
    rows,
  } = post;

  const { snackbar, setSnackbar } = useSnackbarContext();

  // set form step state
  const [activeStep, setActiveStep] = useState(0);

  const initialDetailsState = {
    title,
    description,
    category,
    originalUrl,
    tags,
  };
  const initialEditorState = id !== "" ? { id, version, rows } : null;

  const initialMapState = ecoregions;

  const [saved, setSaved] = useState(true);

  // set editor value state
  const [postValue, setPostValue] = useState(
    id !== "" ? initialEditorState : null
  );

  //set detail values state;
  const [details, setDetails] = useState(initialDetailsState);

  // set map state
  const [clickInfo, setClickInfo] = useState(initialMapState);

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const [loading, setLoading] = useState(false);

  // if values in form have changed set saved value accordingly
  useEffect(() => {
    // equality in js doesn't work on objects so use lodash function
    if (!isEqual(initialEditorState, postValue)) {
      setSaved(false);
    } else if (!isEqual(initialDetailsState, details)) {
      setSaved(false);
    } else if (initialMapState !== clickInfo) {
      setSaved(false);
    } else {
      setSaved(true);
    }
  }, [postValue, details, clickInfo]);

  // If user tries to leave page without saving show a dialog box warning them
  useEffect(() => {
    const confirmationMessage =
      "You have unsaved changes. Are you sure you want to leave?";
    const beforeUnloadHandler = (e) => {
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
    };
    const beforeRouteHandler = (url) => {
      if (router.pathname !== url && !confirm(confirmationMessage)) {
        // to inform NProgress or something ...
        router.events.emit("routeChangeError");
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };
    if (!saved) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      router.events.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    };
  }, [saved]);

  const handleOpenDialog = (action, type, postValue, details, clickInfo) => {
    const result = {
      title: details.title,
      description: details.description,
      category: details.category,
      originalUrl: details.originalUrl,
      tags: details.tags,
      ecoregions: clickInfo,
      _id: post._id,
      id: postValue.id,
      version: postValue.version,
      rows: postValue.rows,
      status: "published",
      approved: "pending",
      updated:
        post.status === "published" || post.updated === true ? true : false,
      featured: post.featured,
      feature: "false",
    };
    setItem(result);
    setAction({ action: action, type: type });

    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  // remove tag chip on delete. Take in label of chip as chip. If the tag value does not equal the tag label than return filtered array without that chip and set it to state.
  const handleRemoveChip = (tags, chip) => {
    setDetails((details) => ({
      ...details,
      tags: tags.filter((tag) => tag !== chip),
    }));
  };

  // Handle form details change
  const handleDetailChange = (e) => {
    //set name and value from targeted form props
    const { name, value } = e.target;

    // Set new values on form change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
    setDetails((details) => ({
      ...details,
      [name]: value,
    }));
  };

  // function to create a new draft. Takes in form values and editor value.
  const updateDraft = async (postValue, details, clickInfo) => {
    setLoading(true);
    const ecoObject = {
      ecoregions: clickInfo,
    };

    const postObject = {
      id: postValue !== null ? postValue.id : "",
      version: postValue !== null ? postValue.version : 1,
      rows: postValue !== null ? postValue.rows : [],
    };

    const silentObject = {
      _id: post._id,
      status: "draft",
      updated:
        post.status === "published" || post.updated === true ? true : false,
      featured: post.featured ? post.featured : false,
      name: user.name,
    };

    // combine form value and editor value into one object to pass to api.
    const value = { ...silentObject, ...postObject, ...details, ...ecoObject };

    const updateResponse = await updatePost(value, "dashboard");
    if (updateResponse.ok) {
      setSaved(true);

      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "success",
        message: "Draft saved successfully",
      });
    }
    if (!updateResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        vertical: "bottom",
        horizontal: "left",
        severity: "error",
        message: "There was a problem saving draft. Please try again later",
      });
    }
    setLoading(false);
  };

  // setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
  // Proceed to next step.
  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };
  // Go back to prev step
  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  //use switch statement that takes in current step and displays component for that step.
  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "20px",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                disabled
              >
                Back
              </Button>

              <>
                <Button
                  onClick={() => updateDraft(postValue, details, clickInfo)}
                  variant="contained"
                  color="secondary"
                  disabled={saved || loading}
                >
                  {loading ? (
                    <CircularProgress size={19} color="secondary" />
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  onClick={() =>
                    handleOpenDialog(
                      "publish",
                      "Post",
                      postValue,
                      details,
                      clickInfo
                    )
                  }
                  variant="contained"
                  color="secondary"
                  disabled={
                    details.title === "" ||
                    details.category === null ||
                    (details.category.title === "" &&
                      details.category.sub === "") ||
                    clickInfo.length === 0 ||
                    postValue === null ||
                    (postValue && postValue.rows.length <= 0)
                  }
                >
                  Publish
                </Button>
              </>

              <Button variant="outlined" color="secondary" onClick={handleNext}>
                Next
              </Button>
            </div>

            <PostDetails
              handleDetailChange={handleDetailChange}
              details={details}
              setDetails={setDetails}
              handleRemoveChip={handleRemoveChip}
            />
          </>
        );
      case 1:
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "20px",
              }}
            >
              <Button variant="outlined" color="secondary" onClick={handleBack}>
                Back
              </Button>

              <>
                <Button
                  onClick={() => updateDraft(postValue, details, clickInfo)}
                  variant="contained"
                  color="secondary"
                  disabled={saved || loading}
                >
                  {loading ? (
                    <CircularProgress size={19} color="secondary" />
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  onClick={() =>
                    handleOpenDialog(
                      "publish",
                      "Post",
                      postValue,
                      details,
                      clickInfo
                    )
                  }
                  variant="contained"
                  color="secondary"
                  disabled={
                    details.title === "" ||
                    details.category === null ||
                    (details.category.title === "" &&
                      details.category.sub === "") ||
                    clickInfo.length === 0 ||
                    postValue === null ||
                    (postValue && postValue.rows.length <= 0)
                  }
                >
                  Publish
                </Button>
              </>

              <Button variant="outlined" color="secondary" onClick={handleNext}>
                Next
              </Button>
            </div>
            <PostEditor value={postValue} setPostValue={setPostValue} />
          </>
        );
      case 2:
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "20px",
              }}
            >
              <Button variant="outlined" color="secondary" onClick={handleBack}>
                Back
              </Button>

              <>
                <Button
                  onClick={() => updateDraft(postValue, details, clickInfo)}
                  variant="contained"
                  color="secondary"
                  disabled={saved || loading}
                >
                  {loading ? (
                    <CircularProgress size={19} color="secondary" />
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  onClick={() =>
                    handleOpenDialog(
                      "publish",
                      "Post",
                      postValue,
                      details,
                      clickInfo
                    )
                  }
                  variant="contained"
                  color="secondary"
                  disabled={
                    details.title === "" ||
                    details.category === null ||
                    (details.category.title === "" &&
                      details.category.sub === "") ||
                    clickInfo.length === 0 ||
                    postValue === null ||
                    (postValue && postValue.rows.length <= 0)
                  }
                >
                  Publish
                </Button>
              </>

              <Button
                onClick={handleNext}
                variant="outlined"
                color="secondary"
                disabled
              >
                Next
              </Button>
            </div>
            <PostRegion clickInfo={clickInfo} setClickInfo={setClickInfo} />
          </>
        );

      default:
        break;
    }
  };

  return (
    <>
      <Link
        href="/dashboard"
        underline="hover"
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
          maxWidth: "fit-content",
        }}
      >
        <ArrowBackIcon fontSize="small" />
        Dashboard
      </Link>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        sx={{
          backgroundColor: theme.palette.primary.dark,
          padding: "24px",
          justifyContent: "space-around",
        }}
      >
        <Step sx={{ display: "flex", justifyContent: "center" }}>
          <StepButton
            onClick={handleStep(0)}
            sx={{
              "& .MuiStepLabel-label": {
                color: alpha(theme.palette.text.primary, 0.7),
              },
              "& .MuiStepLabel-active": {
                color: theme.palette.text.primary,
              },
              "& .MuiStepIcon-active": {
                color: `${theme.palette.secondary.dark}!important`,
              },
              "& .MuiStepIcon-root": {
                color: alpha(theme.palette.secondary.dark, 0.4),
              },
              maxWidth: "fit-content",
            }}
          >
            details
          </StepButton>
        </Step>
        <Step sx={{ display: "flex", justifyContent: "center" }}>
          <StepButton
            onClick={handleStep(1)}
            sx={{
              "& .MuiStepLabel-label": {
                color: alpha(theme.palette.text.primary, 0.7),
              },
              "& .MuiStepLabel-active": {
                color: theme.palette.text.primary,
              },
              "& .MuiStepIcon-active": {
                color: `${theme.palette.secondary.dark}!important`,
              },
              "& .MuiStepIcon-root": {
                color: alpha(theme.palette.secondary.dark, 0.4),
              },
              maxWidth: "fit-content",
            }}
          >
            body
          </StepButton>
        </Step>
        <Step sx={{ display: "flex", justifyContent: "center" }}>
          <StepButton
            onClick={handleStep(2)}
            sx={{
              "& .MuiStepLabel-label": {
                color: alpha(theme.palette.text.primary, 0.7),
              },
              "& .MuiStepLabel-active": {
                color: theme.palette.text.primary,
              },
              "& .MuiStepIcon-active": {
                color: `${theme.palette.secondary.dark}!important`,
              },
              "& .MuiStepIcon-root": {
                color: alpha(theme.palette.secondary.dark, 0.4),
              },
              maxWidth: "fit-content",
            }}
          >
            map
          </StepButton>
        </Step>
      </Stepper>
      {dialog && (
        <DynamicDashboardDialog
          contentType={action.type}
          action={action.action}
          open={dialog}
          handleClose={handleCloseDialog}
          result={item}
          snackbar={snackbar}
          setSnackbar={setSnackbar}
          name={user && user.name}
          setSaved={setSaved}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {handleSteps(activeStep)}
    </>
  );
};

export default StepForm;
