import { Button, FormControl, FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import TextBox from "./TextBox";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexGrow: 1,
    margin: "10px 0 10px 0",
  },
  label: {
    color: theme.palette.text.primary,
    position: "relative",
    transform: "none",
  },
  helper: {
    color: theme.palette.text.primary,
    fontSize: 16,
  },
  layout: {
    display: "grid",
  },
}));

/**
 * User has inserted the email and now he can put the verification code
 */
const VerificationStep = ({ email, callbackUrl }) => {
  const classes = useStyles();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ on: false });
  const [resend, setResend] = useState(false);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleResend = useCallback(async () => {
    setLoading(true);
    const res = await signIn("email", {
      email: email,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError({
        on: true,
        message: "There a was a problem sending email. Please try again later",
      });

      // UPDATE. FIND OUT IF NECESSARY
      if (res?.url) {
        window.location.replace(res.url);
      }
    } else {
      setResend(true);
    }
  }, [email]);

  const onReady = useCallback(() => {
    window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
      email
    )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
  }, [callbackUrl, code, email]);

  const onKeyPress = useCallback(
    (e) => {
      // console.log(e);
      if (e.key === "Enter" && e.target.value.length >= 8) {
        onReady();
      }
    },
    [onReady]
  );

  return (
    <div className={classes.layout}>
      <FormControl className={classes.form} error={error.on}>
        <TextBox
          defaultValue={""}
          autoFocus={true}
          handleChange={handleChange}
          rows={1}
          multiline={false}
          onKeyPress={onKeyPress}
        />
        <FormHelperText className={classes.helper} id="component-error-text">
          {error && error.message ? (
            <>{error.message}</>
          ) : (
            <>
              {!resend ? (
                <>
                  If you did not receive an email:{" "}
                  <Button onClick={handleResend}>Resend</Button>
                </>
              ) : (
                <>
                  We have sent another email. Please try restarting the sign in
                  process or contact us if you are not receiving an email
                </>
              )}
            </>
          )}
        </FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        color="secondary"
        onClick={onReady}
        disabled={code.length < 8}
      >
        Submit
      </Button>
    </div>
  );
};

export default VerificationStep;
