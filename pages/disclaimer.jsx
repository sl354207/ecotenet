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
        <Typography
          align="center"
          variant="h6"
          sx={{ marginTop: "20px" }}
        ></Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>WEBSITE DISCLAIMER:</b> The information provided by Ecotenet
          (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) on
          https://www.ecotenet.org (the &quot;Site&quot;), or any subdomain, is
          for general informational purposes only. All information on the Site
          is provided in good faith, however we make no representation or
          warranty of any kind, express or implied, regarding the accuracy,
          adequacy, validity, reliability, availability, or completeness of any
          information on the the Site. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY
          LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A
          RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED
          ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION
          ON THE SITE IS SOLELY AT YOUR OWN RISK.
        </Typography>

        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>EXTERNAL LINKS DISCLAIMER:</b> The Site may contain (or you may be
          sent through the Site) links to other websites or content belonging to
          or originating from third parties. Such external links are not
          investigated, monitored, or checked for accuracy, adequacy, validity,
          reliability, availability, or completeness by us. WE DO NOT WARRANT,
          ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR
          RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED
          THROUGH THE SITE. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE
          RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY
          PROVIDERS OF PRODUCTS OR SERVICES.
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default disclaimer;
