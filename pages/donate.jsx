import DonateForm from "@components/forms/DonateForm";
import Header from "@components/layouts/Header";
import { Container } from "@mui/material";
import { NextSeo } from "next-seo";

const donate = () => {
  return (
    <>
      <NextSeo
        title="Donate"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Ecotenet is a non-profit supported by donations from from people like you. Thank you"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/donate",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo.svg",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />
      <Container maxWidth="sm">
        <Header title="Donations" />
        <DonateForm />
      </Container>
    </>
  );
};

export default donate;
