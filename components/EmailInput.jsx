import { Button, FormControl, FormHelperText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import theme from "@utils/theme";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import TextBox from "./TextBox";

const useStyles = makeStyles((theme) => ({
  // form: {
  //   display: "flex",
  //   flexGrow: 1,
  //   margin: "10px 0 10px 0",
  // },
  // label: {
  //   color: theme.palette.text.primary,
  //   position: "relative",
  //   transform: "none",
  // },
  // helper: {
  //   color: theme.palette.text.primary,
  //   fontSize: 16,
  // },
  // layout: {
  //   display: "grid",
  // },
}));

const EmailInput = ({ provider, onSuccess }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ on: false });

  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

  const handleSignin = useCallback(async () => {
    if (!regex.test(email)) {
      setError({ on: true, message: "Invalid Email Address" });
    } else {
      setLoading(true);
      const res = await signIn("email", {
        email: email,
        redirect: false,
      });
      setLoading(false);

      if (res?.error) {
        setError({
          on: true,
          message:
            "There a was a problem sending email. Please try again later",
        });

        if (res?.url) {
          window.location.replace(res.url);
        }
      } else {
        onSuccess(email);
      }
    }
  }, [email, onSuccess]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const onKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSignin();
      }
    },
    [handleSignin]
  );

  return (
    <div
      // className={classes.layout}
      style={{ display: "grid" }}
    >
      <FormControl
        // className={classes.form}
        sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
        error={error.on}
      >
        <TextBox
          defaultValue={""}
          placeHolder="email@site.com"
          id="email"
          autoFocus={true}
          handleChange={handleChange}
          rows={1}
          inputProps={{ type: "email" }}
          multiline={false}
          onKeyPress={onKeyPress}
        />
        <FormHelperText
          // className={classes.helper}
          sx={{ color: theme.palette.text.primary, fontSize: 16 }}
          id="component-error-text"
        >
          {error && error.message}
        </FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSignin}
        disabled={loading}
      >
        Submit
      </Button>
    </div>
  );
};

export default EmailInput;
