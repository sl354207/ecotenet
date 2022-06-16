import { Button, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const onReady = useCallback(() => {
    window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
      email
    )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
  }, [callbackUrl, code, email]);

  const onKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onReady();
      }
    },
    [onReady]
  );

  return (
    // <div>
    //   <h2>Verify email</h2>
    //   <p>Insert the magic code you received on your email</p>
    //   <label>
    //     Magic code:
    //     <input
    //       type="text"
    //       value={code}
    //       onChange={(e) => setCode(e.target.value)}
    //       onKeyPress={onKeyPress}
    //     />
    //   </label>

    //   <button onClick={onReady}>Go</button>
    // </div>
    <div className={classes.layout}>
      <FormControl className={classes.form}>
        <TextBox
          defaultValue={""}
          autoFocus={true}
          handleChange={handleChange}
          rows={1}
          multiline={false}
          onKeyPress={onKeyPress}
        />
        {/* <FormHelperText className={classes.helper} id="component-error-text">
        {error && error.message}
      </FormHelperText> */}
      </FormControl>
      <Button variant="contained" color="secondary" onClick={onReady}>
        Submit
      </Button>
    </div>
  );
};

export default VerificationStep;
