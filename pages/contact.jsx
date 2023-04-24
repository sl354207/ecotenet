import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

const contact = () => {
  return (
    <>
      <NextSeo
        title="Contact Us"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/contact",
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
      <Container>
        <Header title="Contact Us" />
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          Details coming Soon
        </Typography>
        <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>
      </Container>
      <Footer />
    </>
  );
};

export default contact;
