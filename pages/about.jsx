import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Box, Container, Divider, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const About = () => {
  return (
    <>
      <NextSeo
        title="About"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Learn about the goals behind Ecotenet"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/about",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo_social.png",
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
        <Header title="About Ecotenet" />
        <Divider sx={{ marginBlock: "20px" }} />
        <Typography variant="h5" align="center">
          Mission
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          Our goal at Ecotenet is to help people learn and share nature-based
          knowledge that is connected to place.
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          There is a lot of great information out there about the species on
          this planet, and there is a lot of great information on how we as
          people interact with our environment. But we find this information to
          largely be separated from each other. And to us, how we interact with
          our environment is too intertwined with the species <em>within</em>{" "}
          that environment to keep them separate.
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          In our minds, the perfect way to connect that knowledge is through
          place. That is where ecoregions come in, instead of categorizing the
          information on political boundaries that aren&apos;t connected to the
          environment, let&apos;s categorize it on ecological boundaries.
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          We not only want to help you learn and share knowledge about the
          environment, but we want to help you learn and share knowledge about{" "}
          <b>
            <em>YOUR</em>
          </b>{" "}
          environment
        </Typography>
        <Divider sx={{ marginBlock: "20px" }} />
        <Typography variant="h5" align="center">
          Ecoregions
        </Typography>

        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          &quot;Biodiversity is not spread evenly across the Earth but follows
          complex patterns determined by climate, geology and the evolutionary
          history of the planet. These patterns are called
          &apos;ecoregions&apos;.
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          WWF defines an ecoregion as a large unit of land or water containing a
          geographically distinct assemblage of species, natural communities,
          and environmental conditions&quot;. -{" "}
          <Link
            href="https://www.worldwildlife.org/biomes"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            World Wildlife Fund
          </Link>
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "20px" }}>
          <Link
            href="https://en.wikipedia.org/wiki/Ecoregion"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more here.
          </Link>
        </Typography>
        <Divider sx={{ marginBlock: "20px" }} />
        <Typography variant="h5" align="center">
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
            // sandbox=""
            loading="lazy"
          ></iframe>
        </Box>

        <Divider sx={{ marginBlock: "20px" }} />
        <Typography variant="h5" align="center">
          Our Data
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "10px" }}>
          Post Data: {"  "}Posts are uploaded by anybody who wants to share
          their knowledge about the environment. And without people like you
          sharing this site wouldn&apos;t exist. So thank you.
        </Typography>
        <Typography variant="h6" align="left" sx={{ marginTop: "10px" }}>
          Species Data: Species distribution data is collected from a variety of
          sources and we will continue to add more. We use data that has
          location coordinates which are then mapped to the proper ecoregions.
          We currently use data from the{" "}
          <Link
            href="https://www.gbif.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Global Biodiversity Information Facility
          </Link>
          ,{" "}
          <Link
            href="https://www.worldwildlife.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            World Wildlife Fund
          </Link>
          ,{" "}
          <Link
            href="https://www.iucnredlist.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            IUCN Red List of Threatened Species
          </Link>
          ,{" "}
          <Link
            href="https://plants.sc.egov.usda.gov/home"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            USDA
          </Link>
          ,{" "}
          <Link
            href="https://obis.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ocean Biodiversity Information System
          </Link>{" "}
          and a few others. To see a full list of our datasets click{" "}
          <Link href="/data" underline="hover">
            here
          </Link>
          . Our species and ecoregion summaries are sourced from{" "}
          <Link
            href="https://www.wikipedia.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikipedia
          </Link>
          .
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default About;
