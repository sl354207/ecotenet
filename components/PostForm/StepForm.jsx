import React, { useState } from 'react'

import PostDetails from './PostDetails'
import PostTags from './PostTags';
import PostEditor from './PostEditor'
import { Button } from '@material-ui/core';

// pass in post and url path as props
const StepForm = ({post, pathname}) => {
  // if the post is undefined(no post was retrieved) then display a blank editor
  if (post === undefined) {
    // set initial values of form
    const initialDetailValues = {
      title: "",
      author: "",
      description: ""
    }

    // set form step state
    const [activeStep, setActiveStep] = useState(0);

    //set detail values state;
    const [detailValues, setDetailValues] = useState(initialDetailValues)

    // set editor value state
    const [postValue, setPostValue] = useState(null);

    // set category state
    const [categoryValue, setCategoryValue] = useState("");

    // set category input state
    const [categoryInputValue, setCategoryInputValue] = useState("");
    
    //setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
    // Proceed to next step.
    const handleNext = () => setActiveStep(step => step + 1)
    // Go back to prev step
    const handleBack = () => setActiveStep(step => step - 1)

    // Handle form change
    const handleChange = e => {
        //set name and value from targeted form props
        const { name, value } = e.target
        
        // Set new values on form change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
        setDetailValues(detailValues => ({
          ...detailValues,
          [name]: value
        }))

        // set errors
        // const error = formValidation(name, value, fieldsValidation) || ""

        // setFormErrors({
        //   [name]: error
        // })
    }

    //use switch statement that takes in current step and displays component for that step.
    const handleSteps = step => {
        switch (step) {
          case 0:
            return (
              <PostEditor
              handleNext={handleNext} 
              value={postValue}
              setPostValue={setPostValue}
              
              />
              // add back in when ready  formErrors={formErrors}
            )
          case 1:
            return (
              <PostDetails
                handleNext={handleNext}
                handleBack={handleBack}
                handleChange={handleChange}
                detailValues={detailValues}
                categoryValue={categoryValue}
                setCategoryValue={setCategoryValue}
                categoryInputValue={categoryInputValue}
                setCategoryInputValue={setCategoryInputValue}
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <PostTags
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            handleAlignment={handleAlignment}
            value={alignment}
            detailValues={detailValues}
            
            />
            // add back in when ready  formErrors={formErrors}
          default:
            break
        }
      }

      // function to create a new draft. Takes in form values and editor value.
      const create = async (detailValues, postValue) => {
        // combine form value and editor value into one object to pass to api.
        const value = Object.assign(detailValues, postValue);
        
        const res = await fetch('/api/createDraft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
      }

      // function to create a published post. Takes in form values and editor value
      const publish = async (detailValues, postValue) => {
        // combine form value and editor value into one object to pass to api. 
        const value = Object.assign(detailValues, postValue);
        
        const res = await fetch('/api/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
      }
      
    return (
        <>
            {handleSteps(activeStep)}
            <Button onClick={()=>create(detailValues, postValue)}>Save</Button>
            <Button onClick={()=>publish(detailValues, postValue)}>Publish</Button>
        </>
    )
    // if url path leads to a draft than populate form with draft data
  } else if(pathname === "/dashboard/drafts/[_id]")
  {
    // destructure values from post data
    const {title,
      author,
      description,
      category
      } = post;
  
    // set form step state
    const [activeStep, setActiveStep] = useState(0);

    //set form values state;
    const [detailValues, setDetailValues] = useState({title,
      author,
      description
      })

    // set editor state
    const [postValue, setPostValue] = useState(post);
    
    //setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
    // Proceed to next step.
    const handleNext = () => setActiveStep(step => step + 1)
    // Go back to prev step
    const handleBack = () => setActiveStep(step => step - 1)

    // Handle form change
    const handleChange = e => {
        //set name and value from targeted form props
        const { name, value } = e.target
        
        // Set new values on from change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
        setDetailValues(values => ({
          ...values,
          [name]: value
        }))

        // set errors
        // const error = formValidation(name, value, fieldsValidation) || ""

        // setFormErrors({
        //   [name]: error
        // })
    }

    //use switch statement that takes in current step and displays component for that step.
    const handleSteps = step => {
        switch (step) {
          case 0:
            return (
              <PostEditor
              handleNext={handleNext}  
              value={postValue}
              setPostValue={setPostValue}
              
              />
              // add back in when ready  formErrors={formErrors}
            )
          case 1:
            return (
              <PostDetails
                handleNext={handleNext}
                handleBack={handleBack}
                handleChange={handleChange}
                values={detailValues}
                
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <PostRegion
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={detailValues}
            
            />
            // add back in when ready  formErrors={formErrors}
          default:
            break
        }
      }

      // function to update the draft. Takes in the form values and editor value.
      const update = async (detailValues, postValue) => {
        // combine form values as post values. Add form values second otherwise they will be overridden by initial draft values.
        const value = Object.assign(postValue, detailValues);
        
        const res = await fetch('/api/updateDraft', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
      }

      // function to publish the draft
      const publish = async (detailValues, postValue) => {
    
        const value = Object.assign(postValue, detailValues);
        
        // create post
        const res1 = await fetch('/api/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
    
        // delete draft once published
        const res2 = await fetch('/api/deleteDraft', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(value._id),
          });
      }
    
    return (
        <>
            {handleSteps(activeStep)}
            <Button onClick={()=>update(detailValues, postValue)}>Save</Button>
            <Button onClick={()=>publish(detailValues, postValue)}>Publish</Button>
        </>
    )
    // if url path leads to a post than populate form with post data.
  } else {

    const {title,
      author,
      description,
      category} = post;
  
    // set step state
    const [activeStep, setActiveStep] = useState(0);

    //set form values state;
    const [detailValues, setDetailValues] = useState({title,
      author,
      description
      })

    const [postValue, setPostValue] = useState(post);
    
    //setActiveStep takes in arrow function with input variable step. It increments step forward or backward.
    // Proceed to next step.
    const handleNext = () => setActiveStep(step => step + 1)
    // Go back to prev step
    const handleBack = () => setActiveStep(step => step - 1)

    // Handle form change
    const handleChange = e => {
        //set name and value from targeted form props
        const { name, value } = e.target
        // console.log(e.target)
        // Set new values on from change. Take in the current values as input and add name and value key value pair to object. values uses destructuring and name is in brackets to allow for dynamically setting key in key value pair(see docs).
        setDetailValues(values => ({
          ...values,
          [name]: value
        }))

        // set errors
        // const error = formValidation(name, value, fieldsValidation) || ""

        // setFormErrors({
        //   [name]: error
        // })
    }

    //use switch statement that takes in current step and displays component for that step.
    const handleSteps = step => {
        switch (step) {
          case 0:
            return (
              <PostEditor
              handleNext={handleNext} 
              value={postValue}
              setPostValue={setPostValue}
              
              />
              // add back in when ready  formErrors={formErrors}
            )
          case 1:
            return (
              <PostDetails
                handleNext={handleNext}
                handleBack={handleBack}
                handleChange={handleChange}
                values={detailValues}
                
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <PostRegion
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={detailValues}
            
            />
            // add back in when ready  formErrors={formErrors}
          default:
            break
        }
      }

      // function to update post
      const update = async (detailValues, postValue) => {
        const value = Object.assign(postValue, detailValues);
        
        const res = await fetch('/api/updatePost', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
        
      }
      
    return (
        <>
            {handleSteps(activeStep)}
            <Button onClick={()=>update(detailValues, postValue)}>Save</Button>
            
        </>
    )
  }
}

export default StepForm
