import Link from "@components/layouts/Link";
import { Button, FormControl, FormHelperText, InputLabel } from "@mui/material";
import theme from "@utils/theme";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import TextBox from "./TextBox";

/**
 * User has inserted the email and now he can put the verification code
 */
const VerificationStep = ({ email, callbackUrl }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resend, setResend] = useState(false);

  const [resendDisabledForTime, setResendDisabledForTime] = useState(true);
  const [remainingTime, setRemainingTime] = useState(60); // 60 seconds

  // Set a timeout to enable the resend button after 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000); // Update the remaining time every second

    const timeout = setTimeout(() => {
      setResendDisabledForTime(false);
      clearInterval(interval); // Clear the interval when the timeout is reached
    }, 60000); // 1 minute in milliseconds

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
      clearTimeout(timeout); // Cleanup the timeout when the component unmounts
    };
  }, []);

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
      setError(true);

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
    <div style={{ display: "grid" }}>
      <FormControl
        sx={{ display: "flex", flexGrow: 1, margin: "10px 0 10px 0" }}
        error={error}
      >
        <InputLabel htmlFor="verify" shrink></InputLabel>
        <TextBox
          defaultValue={""}
          autoFocus={true}
          handleChange={handleChange}
          id="verify"
          onKeyPress={onKeyPress}
          inputProps={{ type: "text", maxLength: 100 }}
          error={error}
        />
        <FormHelperText
          sx={{
            color: theme.palette.text.primary,
            fontSize: 16,
            marginTop: "10px",
          }}
          id="component-error-text"
        >
          {error ? (
            "There a was a problem sending email. Please try again later"
          ) : (
            <>
              {!resend ? (
                <>
                  If you did not receive an email:{" "}
                  <Button
                    onClick={handleResend}
                    variant="outlined"
                    color="secondary"
                    // sx={{ marginTop: "5px" }}
                    disabled={loading || resendDisabledForTime}
                  >
                    {resendDisabledForTime
                      ? `Resend ${remainingTime}`
                      : "Resend"}
                  </Button>
                </>
              ) : (
                <>
                  We have sent another email. Please try restarting the sign in
                  process or contact us at{" "}
                  <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>{" "}
                  if you are not receiving an email
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
        disabled={code.length < 8 || loading}
      >
        Submit
      </Button>
    </div>
  );
};

export default VerificationStep;
