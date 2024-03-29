import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Box, Container, Divider, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo, VideoJsonLd } from "next-seo";

const How = () => {
  return (
    <>
      <NextSeo
        title="How-to videos"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Videos showing how to use different features of Ecotenet"
        openGraph={{
          title: "How-to videos",
          description:
            "Videos showing how to use different features of Ecotenet",
          url: "https://www.ecotenet.org/how",
          type: "video.movie",
          video: {
            duration: 1020,
            releaseDate: "2022-12-21T22:04:11Z",
            // Multiple Open Graph tags is only available in version `7.0.2-canary.35`+ of next
            tags: ["Ecotenet", "post", "ecoregions"],
          },
          siteName: "Ecotenet",
        }}
      />
      <VideoJsonLd
        name="How to create a post on Ecotenet"
        description="Video showing how to create, save and submit a post"
        contentUrl="https://www.ecotenet.org/how"
        embedUrl="https://www.youtube-nocookie.com/embed/Ll2A6GenqM4?rel=0"
        uploadDate="2022-12-21T22:04:11Z"
        duration="PT17M"
      />
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="How-to Videos for Ecotenet" />
        <Divider sx={{ marginBlock: "20px" }} />
        <Typography
          align="center"
          variant="h5"
          sx={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          How to Create a Post
        </Typography>
        <Box
          sx={{
            overflow: "hidden",
            /* 16:9 aspect ratio */
            paddingTop: "56.25%",
            position: "relative",
            marginTop: "20px",
          }}
        >
          <iframe
            style={{
              border: 0,
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
            src="https://www.youtube-nocookie.com/embed/Ll2A6GenqM4?rel=0"
            title="Creating a Post on Ecotenet"
            allow="fullscreen;
            accelerometer 'none';	
            ambient-light-sensor 'none';	
            autoplay 'none';	
            battery 'none';	
            camera 'none';	
            geolocation 'none';	
            gyroscope	'none';
            magnetometer 'none';	 
            microphone 'none';	
            midi 'none';	
            payment 'none';	
            usb 'none';	
            vibrate 'none';"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>
        <Divider sx={{ marginTop: "30px", marginBottom: "20px" }} />
        <Typography
          align="center"
          variant="h5"
          sx={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Species Distributions Overlay
        </Typography>

        <Box
          sx={{
            overflow: "hidden",
            /* 16:9 aspect ratio */
            paddingTop: "56.25%",
            position: "relative",
            marginTop: "20px",
          }}
        >
          <iframe
            style={{
              border: 0,
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
            src="https://www.youtube-nocookie.com/embed/H1sFXE2MwXs?rel=0"
            title="Feature Highlight | Species Distributions Overlay"
            allow="fullscreen;
            accelerometer 'none';	
            ambient-light-sensor 'none';	
            autoplay 'none';	
            battery 'none';	
            camera 'none';	
            geolocation 'none';	
            gyroscope	'none';
            magnetometer 'none';	 
            microphone 'none';	
            midi 'none';	
            payment 'none';	
            usb 'none';	
            vibrate 'none';"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>

        <Divider sx={{ marginTop: "30px", marginBottom: "20px" }} />
        <Typography
          align="center"
          variant="h5"
          sx={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Ecoregion Filter
        </Typography>
        <Box
          sx={{
            overflow: "hidden",
            /* 16:9 aspect ratio */
            paddingTop: "56.25%",
            position: "relative",
            marginTop: "20px",
          }}
        >
          <iframe
            style={{
              border: 0,
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
            src="https://www.youtube-nocookie.com/embed/Xwa6HilvPaM?rel=0"
            title="Feature Highlight | Ecoregion Filter"
            allow="fullscreen;
            accelerometer 'none';	
            ambient-light-sensor 'none';	
            autoplay 'none';	
            battery 'none';	
            camera 'none';	
            geolocation 'none';	
            gyroscope	'none';
            magnetometer 'none';	 
            microphone 'none';	
            midi 'none';	
            payment 'none';	
            usb 'none';	
            vibrate 'none';"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>

        <Divider sx={{ marginTop: "30px", marginBottom: "20px" }} />
        <Typography
          align="center"
          variant="h5"
          sx={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Flagging System
        </Typography>
        <Box
          sx={{
            overflow: "hidden",
            /* 16:9 aspect ratio */
            paddingTop: "56.25%",
            position: "relative",
            marginTop: "20px",
          }}
        >
          <iframe
            style={{
              border: 0,
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
            src="https://www.youtube-nocookie.com/embed/ypbFw0jG3Qs?rel=0"
            title="Feature Highlight | Flagging System"
            allow="fullscreen;
            accelerometer 'none';	
            ambient-light-sensor 'none';	
            autoplay 'none';	
            battery 'none';	
            camera 'none';	
            geolocation 'none';	
            gyroscope	'none';
            magnetometer 'none';	 
            microphone 'none';	
            midi 'none';	
            payment 'none';	
            usb 'none';	
            vibrate 'none';"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>

        <Divider sx={{ marginTop: "30px", marginBottom: "20px" }} />
        <Typography
          align="center"
          variant="h5"
          sx={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Stats Page
        </Typography>
        <Box
          sx={{
            overflow: "hidden",
            /* 16:9 aspect ratio */
            paddingTop: "56.25%",
            position: "relative",
            marginTop: "20px",
          }}
        >
          <iframe
            style={{
              border: 0,
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
            src="https://www.youtube-nocookie.com/embed/qXuGMnt7S6I?rel=0"
            title="Feature Highlight | Ecoregion Stats Page"
            allow="fullscreen;
            accelerometer 'none';	
            ambient-light-sensor 'none';	
            autoplay 'none';	
            battery 'none';	
            camera 'none';	
            geolocation 'none';	
            gyroscope	'none';
            magnetometer 'none';	 
            microphone 'none';	
            midi 'none';	
            payment 'none';	
            usb 'none';	
            vibrate 'none';"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default How;
