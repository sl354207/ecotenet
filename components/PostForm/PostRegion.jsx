import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

//pass in and destructure props.
const PostRegion = ({ handleNext, handleBack, handleChange, values }) => {
  //testing. change this
  // const { firstName, lastName, email, gender, date, phone, city } = values;

  //testing. change this
  const handleSubmit = () => {
    // Do whatever with the values
    // console.log(values)
    // Show last compinent or success message
    // handleNext()
  };

  return (
    <>
      <div
        style={{ display: "flex", marginTop: 50, justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="default"
          onClick={handleBack}
          style={{ marginRight: 10 }}
        >
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          Confirm & Continue
        </Button>
      </div>
    </>
  );
};

export default PostRegion;
