import { useSnackbarContext } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import TextBox from "@components/inputFields/TextBox";
import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import Nav from "@components/layouts/Nav";
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import theme from "@utils/theme";
import { validName } from "@utils/validationHelpers";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";

const newUser = () => {
  const router = useRouter();

  const { user, update } = useUserContext();
  const { setSnackbar } = useSnackbarContext();

  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [updated, setUpdated] = useState(false);

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
    if (validName(name)) {
      const submission = {
        email: user.email,
        name: name,
      };

      const res = await fetch(`/api/dashboard/name?name=${name}`, {
        method: "GET",
      });
      if (res.ok) {
        setError(false);
        const check = await res.text();
        // console.log(check);
        if (check === "null") {
          const res1 = await fetch(`/api/dashboard/users/${name}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
          });
          if (res1.ok) {
            setUpdated(true);
            update({ name });
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
    } else {
      setError(true);
    }
  };

  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      {!user || (user && user.status === "loading") || updated === true ? (
        <>
          <CircularProgress
            color="secondary"
            size={100}
            disableShrink={true}
            sx={{
              margin: "100px auto",
              display: "flex",
              justifySelf: "center",
            }}
          />
        </>
      ) : (
        <>
          {user &&
          user.status === "authenticated" &&
          (user.name === null ||
            user.name === "" ||
            user.name === undefined) ? (
            <>
              <Container>
                <Header title="New Profile" />
                <Description description="Please select a profile name that you wish to be shown on your posts and comments. This name will not be able to be changed once submitted. If your name has not already been used you will be redirected back to the site" />
                <div style={{ display: "grid" }}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      margin: "10px 0 10px 0",
                    }}
                    error={error}
                  >
                    <InputLabel htmlFor="name" shrink></InputLabel>
                    <TextBox
                      defaultValue=""
                      placeHolder="profile name"
                      id="name"
                      autoFocus={true}
                      handleChange={handleChange}
                      inputProps={{ type: "text", maxLength: 60 }}
                      onKeyPress={onKeyPress}
                      error={error}
                    />
                    <FormHelperText
                      sx={{ color: theme.palette.text.primary, fontSize: 16 }}
                      id="component-error-text"
                    >
                      {error ? "Invalid Name" : " "}
                    </FormHelperText>
                  </FormControl>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleNameUpdate(name)}
                    disabled={name === "" ? true : false}
                    sx={{ marginTop: "10px" }}
                  >
                    Submit
                  </Button>
                </div>
              </Container>
            </>
          ) : (
            <>
              <Nav />
              <Container>
                <Header title="Access Denied" />
              </Container>
            </>
          )}
        </>
      )}
    </>
  );
};

export default newUser;
