import Header from "@components/layouts/Header";
import { Container } from "@mui/material";
import { NextSeo } from "next-seo";

const terms = () => {
  return (
    <>
      <NextSeo
        title="Terms of Service"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/terms",
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
        <Header title="details coming soon" />
      </Container>
    </>
  );
};

export default terms;
