import DashboardDialog from "@components/dialogs/DashboardDialog";
import {
  Button,
  Link,
  Snackbar,
  Step,
  StepButton,
  Stepper,
} from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import { useState } from "react";
import PostDetails from "./PostDetails";
import PostEditor from "./PostEditor";
import PostRegion from "./PostRegion";

const useStyles = makeStyles((theme) => ({
  stepLabel: {
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
  },
  stepper: {
    backgroundColor: theme.palette.primary.dark,
  },
  stepNav: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dialog: {
    backgroundColor: theme.palette.primary.light,
  },
  link: {
    marginLeft: 10,
  },
}));

// pass in post and url path as props
const StepForm = ({ post, pathName }) => {
  const classes = useStyles();
  const router = useRouter();

  const { title, description, category, tags, ecoregions } = post;

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

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

  // UPDATE ONCE AUTHENTICATION IS USED
  // function to create a new draft. Takes in form values and editor value.
  const save = async (postValue, details, clickInfo) => {
    const ecoObject = {
      ecoregions: clickInfo,
    };

    const postObject = {
      id: postValue != null ? postValue.id : "",
      version: postValue != null ? postValue.version : 1,
      rows: postValue != null ? postValue.rows : [],
    };

    let silentObject = {};

    if (pathName == "editor") {
      silentObject = {
        name: "Muskrat",
        status: "draft",
        approved: "false",
        updated: false,
        featured: false,
        feature: "false",
        date: "",
      };
    } else {
      silentObject = {
        _id: post._id,
        status: "draft",
        approved: "false",
        updated: false,
        featured: false,
        feature: "false",
        date: "",
      };
    }
    // combine form value and editor value into one object to pass to api.

    const value = { ...silentObject, ...postObject, ...details, ...ecoObject };

    switch (pathName) {
      case "/dashboard/drafts/[_id]":
        const res1 = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        if (res1.ok) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Draft saved successfully",
          });
        }
        if (!res1.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: "There was a problem saving draft. Please try again later",
          });
        }
        break;
      case "/dashboard/posts/[_id]":
        break;
      case "editor":
        const res3 = await fetch("/api/createPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        if (res3.ok) {
          const ID = await res3.json();
          router.push(`/dashboard/drafts/${ID.insertedId}`);
          setSnackbar({
            open: true,
            severity: "success",
            message: "Draft saved successfully",
          });
        }
        if (!res3.ok) {
          setSnackbar({
            open: true,
            severity: "error",
            message: "There was a problem saving draft. Please try again later",
          });
        }

        break;

      default:
        break;
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
          <>
            <div className={classes.stepNav}>
              <Button
                variant="contained"
                color="default"
                onClick={handleBack}
                disabled
              >
                Back
              </Button>

              {pathName == "/dashboard/posts/[_id]" ? (
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
                          "Publish",
                          "post",
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
                    onClick={() => save(postValue, details, clickInfo)}
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
                          "Publish",
                          pathName == "editor" ? "create" : "draft",
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

              <Button variant="contained" color="default" onClick={handleNext}>
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

          // add back in when ready  formErrors={formErrors}
        );
      case 1:
        return (
          <>
            <div className={classes.stepNav}>
              <Button variant="contained" color="default" onClick={handleBack}>
                Back
              </Button>

              {pathName == "/dashboard/posts/[_id]" ? (
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
                          "Publish",
                          "post",
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
                    onClick={() => save(postValue, details, clickInfo)}
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
                          "Publish",
                          pathName == "editor" ? "create" : "draft",
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

              <Button variant="contained" color="default" onClick={handleNext}>
                Next
              </Button>
            </div>
            <PostEditor value={postValue} setPostValue={setPostValue} />
          </>

          // add back in when ready  formErrors={formErrors}
        );
      case 2:
        return (
          <>
            <div className={classes.stepNav}>
              <Button variant="contained" color="default" onClick={handleBack}>
                Back
              </Button>

              {pathName == "/dashboard/posts/[_id]" ? (
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
                          "Publish",
                          "post",
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
                    onClick={() => save(postValue, details, clickInfo)}
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
                          "Publish",
                          pathName == "editor" ? "create" : "draft",
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
                variant="contained"
                color="default"
                onClick={handleNext}
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
      <Link href="/dashboard" className={classes.link}>
        &#10229;Dashboard
      </Link>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        className={classes.stepper}
      >
        <Step>
          <StepButton onClick={handleStep(0)} className={classes.stepLabel}>
            details
          </StepButton>
        </Step>
        <Step>
          <StepButton onClick={handleStep(1)} className={classes.stepLabel}>
            body
          </StepButton>
        </Step>
        <Step>
          <StepButton onClick={handleStep(2)} className={classes.stepLabel}>
            map
          </StepButton>
        </Step>
      </Stepper>
      <DashboardDialog
        contentType={action.type}
        action={action.action}
        open={dialog}
        handleClose={handleCloseDialog}
        className={classes.dialog}
        result={item}
        setSnackbar={setSnackbar}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {handleSteps(activeStep)}
    </>
  );
};

export default StepForm;
