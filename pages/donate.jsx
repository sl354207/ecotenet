import DonateForm from "@components/forms/DonateForm";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Typography } from "@mui/material";
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
        <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
          Ecotenet is 501(c)(3) nonprofit organization. We rely on donations
          from people like you to keep running and growing.
        </Typography>
        <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
          Thank You!
        </Typography>
        <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
          For larger donations or other questions email us at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default donate;
