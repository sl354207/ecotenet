import { Button, FormControl, FormHelperText, InputLabel } from "@mui/material";
import theme from "@utils/theme";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import TextBox from "./TextBox";

/**
 * User has inserted the email and now he can put the verification code
 */
const VerificationStep = ({ email, callbackUrl }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
          sx={{ color: theme.palette.text.primary, fontSize: 16 }}
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
                    variant="text"
                    color="secondary"
                    disabled={loading}
                  >
                    Resend
                  </Button>
                </>
              ) : (
                "We have sent another email. Please try restarting the sign in process or contact us if you are not receiving an email"
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