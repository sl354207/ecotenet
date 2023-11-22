import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const disclaimer = () => {
  return (
    <>
      <NextSeo
        title="Disclaimer"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/disclaimer",
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
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="Disclaimer" />
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          Details coming Soon
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default disclaimer;
