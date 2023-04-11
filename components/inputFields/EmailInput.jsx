import { Button, FormControl, FormHelperText, InputLabel } from "@mui/material";
import theme from "@utils/theme";
import { validEmail } from "@utils/validationHelpers";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import TextBox from "./TextBox";

const EmailInput = ({ provider, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSignin = useCallback(async () => {
    if (!validEmail(email)) {
      setError(true);
    } else {
      setError(false);

      setLoading(true);
      const res = await signIn("email", {
        email: email,
        redirect: false,
      });
      setLoading(false);

      if (res?.error) {
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
    <div style={{ display: "grid" }}>
      <FormControl
        sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
        error={error}
      >
        <InputLabel htmlFor="email" shrink></InputLabel>
        <TextBox
          defaultValue={""}
          placeHolder="email@site.com"
          id="email"
          autoFocus={true}
          handleChange={handleChange}
          inputProps={{ type: "email", maxLength: 100 }}
          onKeyPress={onKeyPress}
          error={error}
        />
        <FormHelperText
          sx={{ color: theme.palette.text.primary, fontSize: 16 }}
          id="component-error-text"
        >
          {error ? "Invalid Email" : " "}
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
