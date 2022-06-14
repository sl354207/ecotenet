import EmailInput from "@components/EmailInput";
import VerificationStep from "@components/VerificationStep";
import { getProviders, getSession } from "next-auth/react";
// import { getProviders, getSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

const SigninPage = ({ providers, isLoggedIn }) => {
  const { query } = useRouter();
  const { error } = query;
  const callbackUrl = "http://localhost:3000";

  const [email, setEmail] = useState("");
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const emailProvider = Object.values(providers).filter(
    (provider) => provider.type === "email"
  );

  if (showVerificationStep) {
    return (
      <div>
        <VerificationStep email={email} callbackUrl={callbackUrl} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>Sign in with your email</h2>

        {emailProvider.map((provider) => (
          <EmailInput
            key={provider.id}
            provider={provider}
            onSuccess={(email) => {
              setEmail(email);
              setShowVerificationStep(true);
            }}
          />
        ))}
      </div>

      {/* {credentials} */}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  return {
    props: {
      isLoggedIn: session !== null,
      providers: await getProviders(),
    },
  };
};

export default SigninPage;
