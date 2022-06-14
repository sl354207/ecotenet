import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";

const EmailInput = ({ provider, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = useCallback(async () => {
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
  }, [email, onSuccess]);

  const onKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSignin();
      }
    },
    [handleSignin]
  );

  return (
    <div>
      <input
        type="email"
        name="email"
        placeholder="e.g. jane.doe@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyPress={onKeyPress}
      />
      <button disabled={loading}>Next</button>
    </div>
  );
};

export default EmailInput;
