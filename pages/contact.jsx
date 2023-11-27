import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Container, IconButton, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const TikTokIcon = ({ color = "#000000", width = "1em", height = "1em" }) => {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width={width}
      height={height}
    >
      <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
    </svg>
  );
};

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
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="Contact Us" />
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          For general support you can contact us through the forum at{" "}
          <Link href="https://forum.ecotenet.org/category/3/support">
            Support.
          </Link>
        </Typography>
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          Or you can contact us directly at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Typography align="center" variant="h6" sx={{ marginBlock: "auto" }}>
            Socials:
          </Typography>
          <IconButton
            color="inherit"
            aria-label="facebook"
            size="large"
            href="https://www.facebook.com/ecotenet.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="instagram"
            size="large"
            href="https://www.instagram.com/ecotenet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="twitter"
            size="large"
            href="https://twitter.com/ecotenet_org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="youtube"
            size="large"
            href="https://www.youtube.com/@ecotenet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YouTubeIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="tiktok"
            size="large"
            href="https://www.tiktok.com/@ecotenet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TikTokIcon color="white" width="24px" height="24px" />
          </IconButton>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default contact;
