import React, { useState, useCallback } from "react";

import { useRouter } from "next/router";

import PostDetails from "./PostDetails";
import PostRegion from "./PostRegion";
import PostEditor from "./PostEditor";
import {
  Button,
  Step,
  StepButton,
  Stepper,
  Typography,
  IconButton,
  Snackbar,
} from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

import CloseIcon from "@material-ui/icons/Close";
import SurePost from "../SurePost";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    // border: "2px solid #94c9ff",
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,

    "&:focus-within": {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.secondary.main, 1)}`,
      borderRadius: theme.shape.borderRadius,
    },
    // marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginTop: 6,
    marginBottom: 10,
    // marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },

  select: {
    color: theme.palette.text.primary,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        // border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
      "&:hover fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      },
    },
  },
  stepLabel: {
    "& .MuiStepLabel-label": {
      color: alpha(theme.palette.text.primary, 0.7),
    },
    "& .MuiStepLabel-active": {
      color: theme.palette.text.primary,
      // fontWeight: 700,
    },
    "& .MuiStepIcon-active": {
      color: `${theme.palette.secondary.dark}!important`,

      // fontWeight: 700,
    },
    "& .MuiStepIcon-root": {
      color: alpha(theme.palette.secondary.dark, 0.4),

      // fontWeight: 700,
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
}));

// pass in post and url path as props
const StepForm = ({ post, pathName }) => {
  const classes = useStyles();
  const theme = useTheme();
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
  // console.log(details);

  // set map state
  const [clickInfo, setClickInfo] = useState(ecoregions);

  const [dialog, setDialog] = useState(false);

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
      };
    } else {
      silentObject = {
        _id: post._id,
        name: "Muskrat",
        status: "draft",
        approved: "false",
        updated: false,
        featured: false,
      };
    }
    // combine form value and editor value into one object to pass to api.
    const value = Object.assign(postObject, details, ecoObject, silentObject);
    // console.log(value);

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
        // console.log(res3);
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
              {/* <div> */}
              {pathName == "/dashboard/posts/[_id]" ? (
                <>
                  <Button
                    // onClick={() => save(postValue, details, clickInfo)}
                    variant="contained"
                    color="secondary"
                    disabled
                  >
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
                    <Button
                      onClick={() =>
                        // {() => publish(postValue, details, clickInfo)}
                        setDialog(true)
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      // onClick={() => publish(postValue, details, clickInfo)}
                      variant="contained"
                      color="secondary"
                      disabled
                    >
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
                        // {() => publish(postValue, details, clickInfo)}
                        setDialog(true)
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      // onClick={() => publish(postValue, details, clickInfo)}
                      variant="contained"
                      color="secondary"
                      disabled
                    >
                      Publish
                    </Button>
                  )}
                </>
              )}

              {/* </div> */}
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
              {/* <div> */}
              {pathName == "/dashboard/posts/[_id]" ? (
                <>
                  <Button
                    // onClick={() => save(postValue, details, clickInfo)}
                    variant="contained"
                    color="secondary"
                    disabled
                  >
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
                    <Button
                      onClick={() =>
                        // {() => publish(postValue, details, clickInfo)}
                        setDialog(true)
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      // onClick={() => publish(postValue, details, clickInfo)}
                      variant="contained"
                      color="secondary"
                      disabled
                    >
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
                        // {() => publish(postValue, details, clickInfo)}
                        setDialog(true)
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      // onClick={() => publish(postValue, details, clickInfo)}
                      variant="contained"
                      color="secondary"
                      disabled
                    >
                      Publish
                    </Button>
                  )}
                </>
              )}
              {/* </div> */}
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
              {/* <div> */}
              {pathName == "/dashboard/posts/[_id]" ? (
                <>
                  <Button
                    // onClick={() => save(postValue, details, clickInfo)}
                    variant="contained"
                    color="secondary"
                    disabled
                  >
                    Save
                  </Button>
                  {details.title != "" &&
                  details.category != "" &&
                  clickInfo.length > 0 &&
                  postValue.rows.length > 0 ? (
                    <Button
                      onClick={() =>
                        // {() => publish(postValue, details, clickInfo)}
                        setDialog(true)
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      // onClick={() => publish(postValue, details, clickInfo)}
                      variant="contained"
                      color="secondary"
                      disabled
                    >
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
                        // {() => publish(postValue, details, clickInfo)}
                        setDialog(true)
                      }
                      variant="contained"
                      color="secondary"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      // onClick={() => publish(postValue, details, clickInfo)}
                      variant="contained"
                      color="secondary"
                      disabled
                    >
                      Publish
                    </Button>
                  )}
                </>
              )}
              {/* </div> */}

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
          <StepButton
            onClick={handleStep(2)}
            className={classes.stepLabel}
            // classes={{ label: classes.stepLabel }}
          >
            map
          </StepButton>
        </Step>
      </Stepper>
      <SurePost
        open={dialog}
        handleClose={handleCloseDialog}
        // handleSubmit={deletePost}
        ariaLabeledBy="alert-dialog-title"
        ariaDescribedBy="alert-dialog-description"
        id="alert-dialog-description"
        className={classes.dialog}
        sure="Are you sure you want to publish item?"
        action="submit"
        postValue={postValue}
        details={details}
        clickInfo={clickInfo}
        approved={post.approved}
        resultID={post._id}
        pathName={pathName}
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
