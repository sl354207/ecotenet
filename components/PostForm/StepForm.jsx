import React, { useState, useCallback } from "react";

import PostDetails from "./PostDetails";
import PostRegion from "./PostRegion";
import PostEditor from "./PostEditor";
import {
  Button,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

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
}));

// pass in post and url path as props
const StepForm = ({ post, pathName }) => {
  const classes = useStyles();
  const theme = useTheme();

  const { title, author, description, category, tags, ecoregions } = post;

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
  const save = async (postValue, details, clickInfo) => {
    const ecoObject = {
      ecoregions: clickInfo,
    };
    // combine form value and editor value into one object to pass to api.
    const value = Object.assign(postValue, details, ecoObject);
    console.log(value);

    switch (pathName) {
      case "/dashboard/drafts/[_id]":
        const res1 = await fetch("/api/updateDraft", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        break;
      case "/dashboard/posts/[_id]":
        const res2 = await fetch("/api/updatePost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        break;
      case "editor":
        const res3 = await fetch("/api/createDraft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        // console.log(res3);
        break;

      default:
        break;
    }
  };

  // function to create a published post. Takes in form values and editor value
  const publish = async (postValue, details, clickInfo) => {
    const ecoObject = {
      ecoregions: clickInfo,
    };
    // combine form value and editor value into one object to pass to api.
    const value = Object.assign(postValue, details, ecoObject);

    switch (pathName) {
      case "/dashboard/drafts/[_id]":
        // create post
        const res1 = await fetch("/api/createPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        if (res1.ok) {
          // delete draft once published
          const res2 = await fetch("/api/deleteDraft", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value._id),
          });
        }

        break;
      case "/dashboard/posts/[_id]":
        break;
      case "editor":
        // send value to createPost api
        const res3 = await fetch("/api/createPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        break;

      default:
        break;
    }
  };

  // setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
  // Proceed to next step.
  const handleNext = () => setActiveStep((step) => step + 1);
  // Go back to prev step
  const handleBack = () => setActiveStep((step) => step - 1);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  //use switch statement that takes in current step and displays component for that step.
  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <PostEditor
            handleNext={handleNext}
            value={postValue}
            setPostValue={setPostValue}
          />
          // add back in when ready  formErrors={formErrors}
        );
      case 1:
        return (
          <PostDetails
            handleNext={handleNext}
            handleBack={handleBack}
            handleDetailChange={handleDetailChange}
            details={details}
            setDetails={setDetails}
            handleRemoveChip={handleRemoveChip}
          />

          // add back in when ready  formErrors={formErrors}
        );
      case 2:
        return (
          <PostRegion
            handleBack={handleBack}
            clickInfo={clickInfo}
            setClickInfo={setClickInfo}
          />
        );
      // add back in when ready  formErrors={formErrors}
      default:
        break;
    }
  };

  return (
    <>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        <Step>
          <StepButton onClick={handleStep(0)} className={classes.stepLabel}>
            body
          </StepButton>
        </Step>
        <Step>
          <StepButton onClick={handleStep(1)} className={classes.stepLabel}>
            details
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

      {handleSteps(activeStep)}
      <Button onClick={() => save(postValue, details, clickInfo)}>Save</Button>
      <Button onClick={() => publish(postValue, details, clickInfo)}>
        Publish
      </Button>
    </>
  );
};

export default StepForm;
