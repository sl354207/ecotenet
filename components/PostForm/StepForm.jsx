import React, { useState, useCallback } from "react";

import PostDetails from "./PostDetails";
import PostTags from "./PostTags";
import PostEditor from "./PostEditor";
import { Button } from "@material-ui/core";

// pass in post and url path as props
const StepForm = ({ post, pathname }) => {
  // if the post is undefined(no post was retrieved) then display a blank editor for creating new post or draft. Remove any repetitive code out of if statements?
  if (post === undefined) {
    // set initial values of form
    const initialDetailValues = {
      title: "",
      author: "",
      description: "",
    };

    // set form step state
    const [activeStep, setActiveStep] = useState(0);

    // set editor value state
    const [postValue, setPostValue] = useState(null);

    //set detail values state;
    const [detailValues, setDetailValues] = useState(initialDetailValues);

    // set category options. Move above if statements since doesn't change?
    const categoryOptions = ["Hunt", "Gather"];

    // set category state
    const [categoryValue, setCategoryValue] = useState();

    // set category input state. Recommended to keep separate than category state by MUI docs.
    const [categoryInputValue, setCategoryInputValue] = useState("");

    // set tag options for autocomplete
    const tags = [];

    // set tag state
    const [tagValue, setTagValue] = useState([]);

    // set map state
    const [clickInfo, setClickInfo] = useState([]);

    // remove tag chip on delete. Take in label of chip as chip. If the tag value does not equal the tag label than return filtered array without that chip and set it to state.
    const handleRemoveChip = (chip) => {
      setTagValue(tagValue.filter((tag) => tag !== chip));
    };

    //setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
    // Proceed to next step.
    const handleNext = () => setActiveStep((step) => step + 1);
    // Go back to prev step
    const handleBack = () => setActiveStep((step) => step - 1);

    // Handle form details change
    const handleDetailChange = (e) => {
      //set name and value from targeted form props
      const { name, value } = e.target;

      // Set new values on form change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
      setDetailValues((detailValues) => ({
        ...detailValues,
        [name]: value,
      }));

      // set errors
      // const error = formValidation(name, value, fieldsValidation) || ""

      // setFormErrors({
      //   [name]: error
      // })
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
              detailValues={detailValues}
              categoryOptions={categoryOptions}
              categoryValue={categoryValue}
              setCategoryValue={setCategoryValue}
              categoryInputValue={categoryInputValue}
              setCategoryInputValue={setCategoryInputValue}
              tags={tags}
              tagValue={tagValue}
              setTagValue={setTagValue}
              handleRemoveChip={handleRemoveChip}
              clickInfo={clickInfo}
              setClickInfo={setClickInfo}
            />

            // add back in when ready  formErrors={formErrors}
          );
        case 2:
          return (
            <PostTags
              handleNext={handleNext}
              handleBack={handleBack}
              handleDetailChange={handleDetailChange}
              handleAlignment={handleAlignment}
              value={alignment}
              detailValues={detailValues}
            />
          );
        // add back in when ready  formErrors={formErrors}
        default:
          break;
      }
    };

    // function to create a new draft. Takes in form values and editor value.
    const create = async (
      postValue,
      detailValues,
      categoryValue,
      tagValue,
      clickInfo
    ) => {
      // turn category string into object with key value pair
      const categoryObject = {
        category: categoryValue,
      };
      // turn tag string into object with key value pair.
      const tagObject = {
        tags: tagValue,
      };

      const ecoObject = {
        ecoregions: clickInfo,
      };
      // combine form value and editor value into one object to pass to api.
      const value = Object.assign(
        postValue,
        detailValues,
        categoryObject,
        tagObject,
        ecoObject
      );

      // send value to createDraft api
      const res = await fetch("/api/createDraft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
    };

    // function to create a published post. Takes in form values and editor value
    const publish = async (
      postValue,
      detailValues,
      categoryValue,
      tagValue,
      clickInfo
    ) => {
      // turn category string into object with key value pair
      const categoryObject = {
        category: categoryValue,
      };
      // turn tag string into object with key value pair.
      const tagObject = {
        tags: tagValue,
      };

      const ecoObject = {
        ecoregions: clickInfo,
      };
      // combine form value and editor value into one object to pass to api.
      const value = Object.assign(
        postValue,
        detailValues,
        categoryObject,
        tagObject,
        ecoObject
      );

      // send value to createPost api
      const res = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
    };

    return (
      <>
        {handleSteps(activeStep)}
        <Button
          onClick={() =>
            create(postValue, detailValues, categoryValue, tagValue, clickInfo)
          }
        >
          Save
        </Button>
        <Button
          onClick={() =>
            publish(postValue, detailValues, categoryValue, tagValue, clickInfo)
          }
        >
          Publish
        </Button>
      </>
    );
    // if url path leads to a draft than populate form with draft data
  } else if (pathname === "/dashboard/drafts/[_id]") {
    // destructure values from post data
    const { title, author, description, category, tags, ecoregions } = post;

    // set form step state
    const [activeStep, setActiveStep] = useState(0);

    // set editor state
    const [postValue, setPostValue] = useState(post);

    //set form detail values state;
    const [detailValues, setDetailValues] = useState({
      title,
      author,
      description,
    });

    // set category options
    const categoryOptions = ["Hunt", "Gather"];

    // set category state
    const [categoryValue, setCategoryValue] = useState(category);

    // set category input state
    const [categoryInputValue, setCategoryInputValue] = useState("");

    // set tag state
    const [tagValue, setTagValue] = useState(tags);

    // set map state
    const [clickInfo, setClickInfo] = useState(ecoregions);

    // remove tag chip on delete
    const handleRemoveChip = (chip) => {
      setTagValue(tagValue.filter((tag) => tag !== chip));
    };

    //setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
    // Proceed to next step.
    const handleNext = () => setActiveStep((step) => step + 1);
    // Go back to prev step
    const handleBack = () => setActiveStep((step) => step - 1);

    // Handle form change
    const handleDetailChange = (e) => {
      //set name and value from targeted form props
      const { name, value } = e.target;

      // Set new values on from change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
      setDetailValues((values) => ({
        ...values,
        [name]: value,
      }));

      // set errors
      // const error = formValidation(name, value, fieldsValidation) || ""

      // setFormErrors({
      //   [name]: error
      // })
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
              detailValues={detailValues}
              categoryOptions={categoryOptions}
              categoryValue={categoryValue}
              setCategoryValue={setCategoryValue}
              categoryInputValue={categoryInputValue}
              setCategoryInputValue={setCategoryInputValue}
              tags={tags}
              tagValue={tagValue}
              setTagValue={setTagValue}
              handleRemoveChip={handleRemoveChip}
              clickInfo={clickInfo}
              setClickInfo={setClickInfo}
            />
            // add back in when ready  formErrors={formErrors}
          );
        case 2:
          return (
            <PostRegion
              handleNext={handleNext}
              handleBack={handleBack}
              handleDetailChange={handleDetailChange}
              values={detailValues}
            />
          );
        // add back in when ready  formErrors={formErrors}
        default:
          break;
      }
    };

    // function to update the draft. Takes in the form values and editor value.
    const update = async (
      postValue,
      detailValues,
      categoryValue,
      tagValue,
      clickInfo
    ) => {
      const categoryObject = {
        category: categoryValue,
      };
      const tagObject = {
        tags: tagValue,
      };
      const ecoObject = {
        ecoregions: clickInfo,
      };
      // combine form value and editor value into one object to pass to api.
      const value = Object.assign(
        postValue,
        detailValues,
        categoryObject,
        tagObject,
        ecoObject
      );

      const res = await fetch("/api/updateDraft", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
    };

    // function to publish the draft
    const publish = async (
      postValue,
      detailValues,
      categoryValue,
      tagValue,
      clickInfo
    ) => {
      const categoryObject = {
        category: categoryValue,
      };
      const tagObject = {
        tags: tagValue,
      };
      const ecoObject = {
        ecoregions: clickInfo,
      };
      // combine form value and editor value into one object to pass to api.
      const value = Object.assign(
        postValue,
        detailValues,
        categoryObject,
        tagObject,
        ecoObject
      );

      // create post
      const res1 = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      // delete draft once published
      const res2 = await fetch("/api/deleteDraft", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value._id),
      });
    };

    return (
      <>
        {handleSteps(activeStep)}
        <Button
          onClick={() =>
            update(postValue, detailValues, categoryValue, tagValue, clickInfo)
          }
        >
          Save
        </Button>
        <Button
          onClick={() =>
            publish(postValue, detailValues, categoryValue, tagValue, clickInfo)
          }
        >
          Publish
        </Button>
      </>
    );
    // if url path leads to a post than populate form with post data.
  } else {
    // destructure values from post data
    const { title, author, description, category, tags, ecoregions } = post;

    // set form step state
    const [activeStep, setActiveStep] = useState(0);

    // set editor state
    const [postValue, setPostValue] = useState(post);

    //set form detail values state;
    const [detailValues, setDetailValues] = useState({
      title,
      author,
      description,
    });

    // set category options
    const categoryOptions = ["Hunt", "Gather"];

    // set category state
    const [categoryValue, setCategoryValue] = useState(category);

    // set category input state
    const [categoryInputValue, setCategoryInputValue] = useState("");

    // set tag state
    const [tagValue, setTagValue] = useState(tags);

    // set map state
    const [clickInfo, setClickInfo] = useState(ecoregions);

    // remove tag chip on delete
    const handleRemoveChip = (chip) => {
      setTagValue(tagValue.filter((tag) => tag !== chip));
    };

    //setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
    // Proceed to next step.
    const handleNext = () => setActiveStep((step) => step + 1);
    // Go back to prev step
    const handleBack = () => setActiveStep((step) => step - 1);

    // Handle form change
    const handleDetailChange = (e) => {
      //set name and value from targeted form props
      const { name, value } = e.target;

      // Set new values on from change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
      setDetailValues((values) => ({
        ...values,
        [name]: value,
      }));

      // set errors
      // const error = formValidation(name, value, fieldsValidation) || ""

      // setFormErrors({
      //   [name]: error
      // })
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
              detailValues={detailValues}
              categoryOptions={categoryOptions}
              categoryValue={categoryValue}
              setCategoryValue={setCategoryValue}
              categoryInputValue={categoryInputValue}
              setCategoryInputValue={setCategoryInputValue}
              tags={tags}
              tagValue={tagValue}
              setTagValue={setTagValue}
              handleRemoveChip={handleRemoveChip}
              clickInfo={clickInfo}
              setClickInfo={setClickInfo}
            />
            // add back in when ready  formErrors={formErrors}
          );
        case 2:
          return (
            <PostRegion
              handleNext={handleNext}
              handleBack={handleBack}
              handleDetailChange={handleDetailChange}
              values={detailValues}
            />
          );
        // add back in when ready  formErrors={formErrors}
        default:
          break;
      }
    };

    // function to update post
    const update = async (
      postValue,
      detailValues,
      categoryValue,
      tagValue,
      clickInfo
    ) => {
      const categoryObject = {
        category: categoryValue,
      };
      const tagObject = {
        tags: tagValue,
      };
      const ecoObject = {
        ecoregions: clickInfo,
      };
      // combine form value and editor value into one object to pass to api.
      const value = Object.assign(
        postValue,
        detailValues,
        categoryObject,
        tagObject,
        ecoObject
      );

      const res = await fetch("/api/updatePost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
    };

    return (
      <>
        {handleSteps(activeStep)}
        <Button
          onClick={() =>
            update(postValue, detailValues, categoryValue, tagValue, clickInfo)
          }
        >
          Save
        </Button>
      </>
    );
  }
};

export default StepForm;
