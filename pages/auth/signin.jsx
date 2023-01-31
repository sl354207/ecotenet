import EmailInput from "@components/inputFields/EmailInput";
import VerificationStep from "@components/inputFields/VerificationStep";
import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";

import { authOptions } from "@pages/api/auth/[...nextauth]";

import { useRouter } from "next/dist/client/router";
import { useState } from "react";

const SigninPage = ({ providers, isLoggedIn }) => {
  const { query } = useRouter();
  const { error } = query;
  // UPDATE
  // const callbackUrl = "http://localhost:3000";

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
        <VerificationStep email={email} callbackUrl={query.callbackUrl} />
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
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);
  return {
    props: {
      isLoggedIn: session !== null,
      providers: await getProviders(),
    },
  };
};

export default SigninPage;
