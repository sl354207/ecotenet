import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Box, Container } from "@mui/material";

const how = () => {
  return (
    <>
      <Container>
        <Header title="How to Create a Post" />
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
            // sandbox=""
            loading="lazy"
          ></iframe>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default how;
