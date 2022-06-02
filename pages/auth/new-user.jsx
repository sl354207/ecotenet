import Description from "@components/Description";
import Header from "@components/Header";
import TextBox from "@components/TextBox";
import { useUserContext } from "@components/UserContext";
import { Button, Container, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  layout: {
    display: "grid",
  },
  origin: {
    marginTop: 400,
    [theme.breakpoints.up("sm")]: {
      marginTop: 300,
    },
  },
}));

const newUser = () => {
  const classes = useStyles();
  const router = useRouter();
  // const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);
  const { userName, setUserName } = useUserContext();
  // console.log(userName);

  const [name, setName] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "Post submitted successfully",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }

    setSnackbar({ ...snackbar, open: false });
  };

  // update text input field
  const handleChange = (event) => {
    setName(event.target.value);
  };

  // handle comment submission to database through api
  const handleNameUpdate = async (name) => {
    //combine all objects and send to api
    const user = {
      email: userName.email,
      name: name,
    };

    const res = await fetch(`/api/checkName?q=${name}`, {
      method: "GET",
    });
    if (res.ok) {
      const check = await res.text();
      // console.log(check);
      if (!check.length) {
        // const test = JSON.parse(check);
        const res1 = await fetch("/api/updatePerson", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (res1.ok) {
          // mutate();
          // setSnackbar({
          //   open: true,
          //   severity: "success",
          //   message: "Comment updated successfully",
          // });
          // setCommentValue("");
          // console.log("ok");
          setUserName({ ...userName, name: name });
          router.push("/");
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "There was a problem submitting your name. Please try again",
          });
        }
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "That name is already taken. Please try another name",
        });
      }
    } else {
      setSnackbar({
        open: true,
        severity: "error",
        message: "There was a problem please try again",
      });
    }
  };

  //

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
          handleChange={handleChange}
          rows={1}
          inputProps={{ maxLength: 60 }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleNameUpdate(name)}
          disabled={name == "" ? true : false}
        >
          Submit
        </Button>
      </div>
      <Snackbar
        classes={{
          anchorOriginTopCenter: classes.origin,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default newUser;
