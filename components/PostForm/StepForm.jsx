import React, { useState } from 'react'

import PostDetails from './PostDetails'

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    date: "",
    city: "",
    phone: ""
}

const StepForm = () => {
    // set step state
    const [activeStep, setActiveStep] = useState(0);

    //set form values state;
    const [formValues, setFormValues] = useState(initialValues)
    
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
              <PostDetails handleNext={handleNext} handleChange={handleChange} values={formValues}  />
              // add back in when ready  formErrors={formErrors}
            )
          case 1:
            return (
              <SecondStep
                handleNext={handleNext}
                handleBack={handleBack}
                handleChange={handleChange}
                values={formValues}
                
              />
            // add back in when ready  formErrors={formErrors}
            )
          case 2:
            return <Confirm handleNext={handleNext} handleBack={handleBack} values={formValues} />
          default:
            break
        }
      }

    return (
        <div>
            {handleSteps(activeStep)}
        </div>
    )
}

export default StepForm
