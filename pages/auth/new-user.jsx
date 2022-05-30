import Description from "@components/Description";
import Header from "@components/Header";
import TextBox from "@components/TextBox";
import { Button, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  layout: {
    display: "grid",
  },
}));

const newUser = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(session);
  // console.log(status);

  const [name, setName] = useState("");

  // update text input field
  const handleChange = (event) => {
    setName(event.target.value);
  };

  // handle comment submission to database through api
  const handleNameUpdate = async (name) => {
    //combine all objects and send to api
    const user = {
      email: session.user.email,
      name: name,
      isNew: false,
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
          router.push("/");
        } else {
        }
      } else {
      }
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
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};

export default newUser;
