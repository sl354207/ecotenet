import Description from "@components/Description";
import Header from "@components/Header";
import { useSnackbarContext } from "@components/SnackbarContext";
import TextBox from "@components/TextBox";
import { useUserContext } from "@components/UserContext";
import { Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

// const useStyles = makeStyles((theme) => ({
//   // layout: {
//   //   display: "grid",
//   // },
//   // origin: {
//   //   marginTop: 400,
//   //   [theme.breakpoints.up("sm")]: {
//   //     marginTop: 300,
//   //   },
//   // },
//   // button: {
//   //   marginTop: 10,
//   // },
// }));

const newUser = () => {
  // const classes = useStyles();
  const router = useRouter();

  const { user, setUser } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();

  const [name, setName] = useState("");

  // update text input field
  const handleChange = (event) => {
    setName(event.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNameUpdate(name);
    }
  };

  // handle comment submission to database through api
  const handleNameUpdate = async (name) => {
    //combine all objects and send to api
    const submission = {
      email: user.email,
      name: name,
    };

    const res = await fetch(`/api/dashboard/name?name=${name}`, {
      method: "GET",
    });
    if (res.ok) {
      const check = await res.text();
      // console.log(check);
      if (!check.length) {
        // const test = JSON.parse(check);
        const res1 = await fetch(`/api/dashboard/users/${name}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission),
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
          // setUser({ ...user, name: name });
          sessionStorage.setItem("name", name);
          router.push("/");
        } else {
          setSnackbar({
            class: true,
            vertical: "top",
            horizontal: "center",
            open: true,
            severity: "error",
            message:
              "There was a problem submitting your name. Please try again",
          });
        }
      } else {
        setSnackbar({
          class: true,
          vertical: "top",
          horizontal: "center",
          open: true,
          severity: "error",
          message: "That name is already taken. Please try another name",
        });
      }
    } else {
      setSnackbar({
        class: true,
        vertical: "top",
        horizontal: "center",
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
      <div
        // className={classes.layout}
        style={{ display: "grid" }}
      >
        <TextBox
          defaultValue=""
          placeHolder="profile name"
          id="name"
          autoFocus={true}
          handleChange={handleChange}
          rows={1}
          multiline={false}
          inputProps={{ maxLength: 60 }}
          onKeyPress={onKeyPress}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleNameUpdate(name)}
          disabled={name == "" ? true : false}
          // className={classes.button}
          sx={{ marginTop: "10px" }}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};

export default newUser;
