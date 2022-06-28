import Description from "@components/Description";
import EmailInput from "@components/EmailInput";
import Header from "@components/Header";
import VerificationStep from "@components/VerificationStep";
import { Container } from "@mui/material";
import { getProviders, getSession } from "next-auth/react";
// import { getProviders, getSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

const SigninPage = ({ providers, isLoggedIn }) => {
  const { query } = useRouter();
  const { error } = query;
  // UPDATE
  const callbackUrl = "http://localhost:3000";

  // PERHAPS USE ISLOGGEDIN TO HIDE PAGE

  const [email, setEmail] = useState("");
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const emailProvider = Object.values(providers).filter(
    (provider) => provider.type === "email"
  );

  if (showVerificationStep) {
    return (
      <Container>
        <Header title="Verification Code" />
        <VerificationStep email={email} callbackUrl={callbackUrl} />
      </Container>
    );
  }

  return (
    <Container>
      {!isLoggedIn ? (
        <>
          <Header title="Email Sign in" />
          <Description description="Enter your email and we will send you a one time passcode that is only valid for 5 minutes" />

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
        </>
      ) : (
        <Header title="You are already signed in" />
      )}
    </Container>
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
