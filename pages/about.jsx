import Footer from "@components/Footer";
import Header from "@components/Header";
import Link from "@components/Link";
import { Container, Typography } from "@mui/material";

const about = () => {
  return (
    <>
      <Container>
        <Header title="About Ecotenet" />
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          Our goal at Ecotenet is to help people learn and share nature-based
          knowledge that is connected to place.
        </Typography>
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          There is a lot of great information out there about the species on
          this planet, and there is a lot of great information on how we as
          people interact with our environment. But we find this information to
          largely be separated from each other, and to us, how we interact with
          our environment is too intertwined with the species <em>within</em>{" "}
          that environment to keep them separate.
        </Typography>
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          In our minds, the perfect way to connect that knowledge is through
          place. That is where ecoregions come in, instead of categorizing the
          information on political boundaries that aren't connected to the
          environment, let's categorize it on ecological boundaries.
        </Typography>
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          We not only want to help you learn and share knowledge about the
          environment, but we want to help you learn and share knowledge about{" "}
          <b>
            <em>YOUR</em>
          </b>{" "}
          environment
        </Typography>
        <Header title="About ecoregions" />
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          "Biodiversity is not spread evenly across the Earth but follows
          complex patterns determined by climate, geology and the evolutionary
          history of the planet. These patterns are called 'ecoregions'.
        </Typography>
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          WWF defines an ecoregion as a large unit of land or water containing a
          geographically distinct assemblage of species, natural communities,
          and environmental conditions". -{" "}
          <Link
            href="https://www.worldwildlife.org/biomes"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            World Wildlife Fund
          </Link>
        </Typography>
        <Typography variant="h5" align="left" sx={{ marginTop: "20px" }}>
          <Link
            href="https://en.wikipedia.org/wiki/Ecoregion"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more here.
          </Link>
        </Typography>
        <Header title="About our data" />
        <Typography variant="h5" align="left" sx={{ marginTop: "10px" }}>
          Post Data: {"  "}Posts are uploaded by anybody who wants to share
          their knowledge about the environment. And without people like you
          sharing this site wouldn't exist. So thank you.
        </Typography>
        <Typography variant="h5" align="left" sx={{ marginTop: "10px" }}>
          Species Data: Species distribution data is collected from a variety of
          sources and we will continue to add more. We use data that has
          location coordinates which are then mapped to the proper ecoregions.
          We currently use data from the{" "}
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
            href="https://www.inaturalist.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            iNaturalist
          </Link>
          , and the{" "}
          <Link
            href="https://obis.org/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ocean Biodiversity Information System
          </Link>
          . To see a list of our datasets click{" "}
          <Link href="/data" underline="hover">
            here
          </Link>
          . Our species summaries are sourced from{" "}
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

export default about;
