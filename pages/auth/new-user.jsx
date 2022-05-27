import Description from "@components/Description";
import Header from "@components/Header";
import TextBox from "@components/TextBox";
import { Button, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  layout: {
    display: "grid",
  },
}));

const newUser = () => {
  const classes = useStyles();
  return (
    <Container>
      <Header title="New Profile" />
      <Description description="Please select a profile name that you wish to be shown on your posts and comments. This name will not be able to be changed once submitted. If your name has not already been used you will be redirected back to the site" />
      <div className={classes.layout}>
        <TextBox
          defaultValue=""
          placeHolder="profile name"
          id="name"
          autoFocus={true}
          // handleChange={handleChange}
          rows={1}
          inputProps={{ maxLength: 60 }}
        />
        <Button variant="contained" color="secondary">
          Submit
        </Button>
      </div>
    </Container>
  );
};

export default newUser;
