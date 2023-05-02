import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

const conduct = () => {
  return (
    <>
      <NextSeo
        title="Code of Conduct"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/conduct",
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
        <Header title="Code of Conduct" />
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          Details coming Soon
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default conduct;