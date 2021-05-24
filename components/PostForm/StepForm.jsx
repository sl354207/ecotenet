import React, { useState } from 'react'

import PostDetails from './PostDetails'
import PostRegion from './PostRegion';
import PostEditor from './PostEditor'
import { Button } from '@material-ui/core';


const StepForm = ({_id, post, pathname}) => {

  if (post === undefined) {
    const initialValues = {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      date: "",
      city: "",
      phone: ""
    }

    // set step state
    const [activeStep, setActiveStep] = useState(0);

    //set form values state;
    const [formValues, setFormValues] = useState(initialValues)

    const [postValue, setPostValue] = useState(null);
    
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
        setFormValues(values => ({
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
              handleNext={handleNext} handleChange={handleChange} values={formValues}
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
                values={formValues}
                
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <PostRegion
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={formValues}
            
            />
            // add back in when ready  formErrors={formErrors}
          default:
            break
        }
      }

      const create = async (formValues, postValue) => {
    
        // console.log(_id);
        // console.log(value);

        const value = Object.assign(formValues, postValue);
        console.log(value);
        const res = await fetch('/api/createDraft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
        // console.log(res);
      }

      const publish = async (formValues, postValue) => {
    
        // console.log(_id);
        // console.log(value);
        const value = Object.assign(formValues, postValue);
        // console.log(value);
        const res1 = await fetch('/api/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
      }
      // console.log(formValues);
      // console.log(postValue);
    return (
        <>
            {handleSteps(activeStep)}
            <Button onClick={()=>create(formValues, postValue)}>Save</Button>
            <Button onClick={()=>publish(formValues, postValue)}>Publish</Button>
        </>
    )
  } else if(pathname === "/dashboard/drafts/[_id]")
  {
    
    const {firstName,
      lastName,
      email,
      gender,
      date,
      city,
      phone} = post;
  
    // set step state
    const [activeStep, setActiveStep] = useState(0);

    //set form values state;
    const [formValues, setFormValues] = useState({firstName,
      lastName,
      email,
      gender,
      date,
      city,
      phone})

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
        setFormValues(values => ({
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
              handleNext={handleNext} handleChange={handleChange} values={formValues}
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
                values={formValues}
                
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <PostRegion
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={formValues}
            
            />
            // add back in when ready  formErrors={formErrors}
          default:
            break
        }
      }

      const update = async (formValues, postValue) => {
    
        // console.log(_id);
        // console.log(value);

        const value = Object.assign(postValue, formValues);
        console.log(value);
        const res = await fetch('/api/updateDraft', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
        // console.log(res);
      }

      const publish = async (formValues, postValue) => {
    
        // console.log(_id);
        // console.log(value);
        const value = Object.assign(postValue, formValues);
        // console.log(value);
        const res1 = await fetch('/api/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
    
        const res2 = await fetch('/api/deleteDraft', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(value._id),
          });
        // console.log(res);
      }
      // console.log(formValues);
      // console.log(postValue);
    return (
        <>
            {handleSteps(activeStep)}
            <Button onClick={()=>update(formValues, postValue)}>Save</Button>
            <Button onClick={()=>publish(formValues, postValue)}>Publish</Button>
        </>
    )
  } else {
    const {firstName,
      lastName,
      email,
      gender,
      date,
      city,
      phone} = post;
  
    // set step state
    const [activeStep, setActiveStep] = useState(0);

    //set form values state;
    const [formValues, setFormValues] = useState({firstName,
      lastName,
      email,
      gender,
      date,
      city,
      phone})

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
        setFormValues(values => ({
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
              handleNext={handleNext} handleChange={handleChange} values={formValues}
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
                values={formValues}
                
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <PostRegion
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={formValues}
            
            />
            // add back in when ready  formErrors={formErrors}
          default:
            break
        }
      }

      const update = async (formValues, postValue) => {
    
        // console.log(_id);
        // console.log(value);

        const value = Object.assign(postValue, formValues);
        console.log(value);
        const res = await fetch('/api/updatePost', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
        // console.log(res);
      }

      // const publish = async (formValues, postValue) => {
    
      //   // console.log(_id);
      //   // console.log(value);
      //   const value = Object.assign(postValue, formValues);
      //   // console.log(value);
      //   const res1 = await fetch('/api/createPost', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(value),
      //   });
    
      //   const res2 = await fetch('/api/deleteDraft', {
      //     method: 'DELETE',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(value._id),
      //     });
      //   // console.log(res);
      // }
      // console.log(formValues);
      // console.log(postValue);
    return (
        <>
            {handleSteps(activeStep)}
            <Button onClick={()=>update(formValues, postValue)}>Save</Button>
            
        </>
    )
  }
}

export default StepForm
