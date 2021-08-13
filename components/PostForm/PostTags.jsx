import React, { Fragment } from "react";

import { Button } from "@material-ui/core";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

//pass in and destructure props.
const PostTags = ({
  handleNext,
  handleBack,
  handleChange,
  handleAlignment,
  values: { firstName, lastName, email, gender },
  value,
}) => {
  return (
    <Fragment>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="left" aria-label="left aligned">
          Left
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          Centered
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned">
          Right
        </ToggleButton>
      </ToggleButtonGroup>
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
      </div>
    </Fragment>
  );
};

export default PostTags;
