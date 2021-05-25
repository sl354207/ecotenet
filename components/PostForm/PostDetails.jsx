import React, { Fragment } from "react"
import  { Grid } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import { FormControl } from "@material-ui/core"
import { Select } from "@material-ui/core"
import { InputLabel } from "@material-ui/core"
import { MenuItem } from "@material-ui/core"
import { Button } from "@material-ui/core"

//pass in and destructure props.
const PostDetails = ({ handleNext, handleBack,handleChange, values: { firstName, lastName, email, gender } }) => {
    return (
        <Fragment>
            <Grid container spacing={2} noValidate>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        placeholder="Your first name"
                        margin="normal"
                        value={firstName || ""}
                        onChange={handleChange}
                        
                        
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        placeholder="Your last name"
                        margin="normal"
                        value={lastName || ""}
                        onChange={handleChange}
                        
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        placeholder="Your email address"
                        type="email"
                        value={email || ""}
                        onChange={handleChange}
                        margin="normal"
                        
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required margin="normal">
                        <InputLabel>Gender</InputLabel>
                        <Select value={gender} onChange={handleChange} name="gender">
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <div style={{ display: "flex", marginTop: 50, justifyContent: "flex-end" }}>
                <Button variant="contained" color="default" onClick={handleBack} style={{ marginRight: 10 }}>
                Back
                </Button>
                <Button variant="contained"  color="primary" onClick={ handleNext }>
                Next
                </Button>
            </div>
        </Fragment>
    )
}

export default PostDetails
