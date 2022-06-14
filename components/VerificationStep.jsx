import { useCallback, useState } from "react";

/**
 * User has inserted the email and now he can put the verification code
 */
const VerificationStep = ({ email, callbackUrl }) => {
  const [code, setCode] = useState("");

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
    <div>
      <h2>Verify email</h2>
      <p>Insert the magic code you received on your email</p>
      <label>
        Magic code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </label>

      <button onClick={onReady}>Go</button>
    </div>
  );
};

export default VerificationStep;
