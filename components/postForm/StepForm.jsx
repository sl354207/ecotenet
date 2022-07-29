import DashboardDialog from "@components/dialogs/DashboardDialog";
import Link from "@components/Link";
import { useSnackbarContext } from "@components/SnackbarContext";
import { Button, Step, StepButton, Stepper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { updatePost } from "@utils/api-helpers";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import { useState } from "react";
import PostDetails from "./PostDetails";
import PostEditor from "./PostEditor";
import PostRegion from "./PostRegion";

// pass in post and url path as props
const StepForm = ({ post, user }) => {
  const router = useRouter();

  const { title, description, category, tags, ecoregions } = post;

  const { snackbar, setSnackbar } = useSnackbarContext();

  // set form step state
  const [activeStep, setActiveStep] = useState(0);

  // set editor value state
  const [postValue, setPostValue] = useState(post.id != "" ? post : null);

  //set detail values state;
  const [details, setDetails] = useState({
    title,
    description,
    category,
    tags,
  });

  // set map state
  const [clickInfo, setClickInfo] = useState(ecoregions);

  const [dialog, setDialog] = useState(false);
  const [action, setAction] = useState({ action: "", type: "" });
  const [item, setItem] = useState("");

  const handleOpenDialog = (action, type, postValue, details, clickInfo) => {
    const result = {
      title: details.title,
      description: details.description,
      category: details.category,
      tags: details.tags,
      ecoregions: clickInfo,
      _id: post._id,
      id: postValue.id,
      version: postValue.version,
      rows: postValue.rows,
      status: "published",
      approved: "pending",
      updated: true,
      featured: post.featured,
      date: new Date().toUTCString(),
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

    // set errors
    // const error = formValidation(name, value, fieldsValidation) || ""

    // setFormErrors({
    //   [name]: error
    // })
  };

  // function to create a new draft. Takes in form values and editor value.
  const updateDraft = async (postValue, details, clickInfo) => {
    const ecoObject = {
      ecoregions: clickInfo,
    };

    const postObject = {
      id: postValue != null ? postValue.id : "",
      version: postValue != null ? postValue.version : 1,
      rows: postValue != null ? postValue.rows : [],
    };

    const silentObject = {
      _id: post._id,
      status: "draft",
      approved: "false",
      updated: false,
      featured: false,
      feature: "false",
      date: "",
      name: user.name,
    };

    // combine form value and editor value into one object to pass to api.

    const value = { ...silentObject, ...postObject, ...details, ...ecoObject };

    const updateResponse = await updatePost(value, "dashboard");
    if (updateResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "success",
        message: "Draft saved successfully",
      });
      router.reload();
    }
    if (!updateResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: "There was a problem saving draft. Please try again later",
      });
    }
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
          // add back in when ready  formErrors={formErrors}
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

              {post.status == "published" ? (
                <>
                  <Button variant="contained" color="secondary" disabled>
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
                    <Button
                      onClick={() =>
                        handleOpenDialog(
                          "update",
                          "Post",
                          postValue,
                          details,
                          clickInfo
                        )
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" disabled>
                      Publish
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => updateDraft(postValue, details, clickInfo)}
                    variant="contained"
                    color="secondary"
                  >
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
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
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" disabled>
                      Publish
                    </Button>
                  )}
                </>
              )}

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
          // add back in when ready  formErrors={formErrors}
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

              {post.status == "published" ? (
                <>
                  <Button variant="contained" color="secondary" disabled>
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
                    <Button
                      onClick={() =>
                        handleOpenDialog(
                          "update",
                          "Post",
                          postValue,
                          details,
                          clickInfo
                        )
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" disabled>
                      Publish
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => updateDraft(postValue, details, clickInfo)}
                    variant="contained"
                    color="secondary"
                  >
                    Save
                  </Button>

                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
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
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" disabled>
                      Publish
                    </Button>
                  )}
                </>
              )}

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

              {post.status == "published" ? (
                <>
                  <Button variant="contained" color="secondary" disabled>
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
                    <Button
                      onClick={() =>
                        handleOpenDialog(
                          "update",
                          "Post",
                          postValue,
                          details,
                          clickInfo
                        )
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" disabled>
                      Publish
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => updateDraft(postValue, details, clickInfo)}
                    variant="contained"
                    color="secondary"
                  >
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
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
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" disabled>
                      Publish
                    </Button>
                  )}
                </>
              )}

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
      // add back in when ready  formErrors={formErrors}
      default:
        break;
    }
  };

  return (
    <>
      <Link href="/dashboard" underline="hover">
        &#10229;Dashboard
      </Link>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        sx={{ backgroundColor: theme.palette.primary.dark, padding: "24px" }}
      >
        <Step>
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
            }}
          >
            details
          </StepButton>
        </Step>
        <Step>
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
            }}
          >
            body
          </StepButton>
        </Step>
        <Step>
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
            }}
          >
            map
          </StepButton>
        </Step>
      </Stepper>
      <DashboardDialog
        contentType={action.type}
        action={action.action}
        open={dialog}
        handleClose={handleCloseDialog}
        result={item}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
        name={user && user.name}
      />

      {handleSteps(activeStep)}
    </>
  );
};

export default StepForm;
