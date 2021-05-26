import React, { Fragment } from "react"
import  { Grid } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import { FormControl } from "@material-ui/core"
import { Select } from "@material-ui/core"
import { InputLabel } from "@material-ui/core"
import { MenuItem } from "@material-ui/core"
import { Autocomplete } from '@material-ui/lab'
import { Button } from "@material-ui/core"

//pass in and destructure props.
const PostDetails = ({ handleNext, handleBack,handleChange, detailValues: { title, author, description }, categoryValue, setCategoryValue, categoryInputValue, setCategoryInputValue }) => {

    const options = ["Hunt", "Gather"]
    return (
        <Fragment>
            <Grid container spacing={2} noValidate>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        placeholder=" title of post(max length 60 characters)"
                        margin="normal"
                        value={title || ""}
                        onChange={handleChange}
                        inputProps={{ maxLength: 60 }}
                        
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Author"
                        name="author"
                        placeholder="author name"
                        margin="normal"
                        value={author || ""}
                        onChange={handleChange}
                        inputProps={{ maxLength: 60 }}
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        placeholder=" short summary of post(max length 160 characters) "
                        value={description || ""}
                        onChange={handleChange}
                        margin="normal"
                        inputProps={{ maxLength: 160 }}
                        multiline
                        rows={2}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                    id="combo-box-demo"
                    name="category"
                    autoHighlight
                    onChange={(event, categoryValue) => {
                        setCategoryValue(categoryValue)}} 
                    value={categoryValue}
                    onInputChange={(event, categoryInputValue) => {
                        setCategoryInputValue(categoryInputValue)}} 
                    inputValue={categoryInputValue}
                    options={options}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                    />
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
