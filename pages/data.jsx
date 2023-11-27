import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Divider, List, ListItem, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const data = () => {
  return (
    <>
      <NextSeo
        title="Data"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="A list of all the data sources that are used on Ecotenet"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/data",
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
        <Header title="Datasets" />
        <Divider sx={{ marginTop: "20px" }} />
        <List>
          <ListItem divider key={"gbif"}>
            <Typography variant="h6">
              <Link
                href="https://www.gbif.org/"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                Global Biodiversity Information Facility:
              </Link>{" "}
              GBIF is an international network and data infrastructure aimed at
              providing anyone, anywhere, open access to data about all types of
              life on Earth. We use two different datasets that aggregate data
              from many sources including the iNaturalist Research-grade
              Observations dataset. These datasets can be found{" "}
              <Link
                href="https://doi.org/10.15468/dl.hjpkwr"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>{" "}
              and{" "}
              <Link
                href="https://doi.org/10.15468/dl.pxqgjf"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              . GBIF.org (11 July 2023) GBIF Occurrence Download.
            </Typography>
          </ListItem>

          <ListItem divider key={"obis"}>
            <Typography variant="h6">
              <Link
                href="https://obis.org/data/access/"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ocean Biodiversity Information System:
              </Link>{" "}
              OBIS is a global open-access data and information clearing-house
              on marine biodiversity for science, conservation and sustainable
              development. OBIS (2023) Ocean Biodiversity Information System.
              Intergovernmental Oceanographic Commission of UNESCO.
              www.obis.org.
            </Typography>
          </ListItem>
          <ListItem divider key={"wwf"}>
            <Typography variant="h6">
              <Link
                href="https://www.worldwildlife.org/publications/wildfinder-database"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                WildFinder Database:
              </Link>{" "}
              World Wildlife Fund. 2006. WildFinder: Online database of species
              distributions, ver. Jan-06. www.worldwildlife.org/WildFinder
            </Typography>
          </ListItem>
          <ListItem divider key={"usda"}>
            <Typography variant="h6">
              <Link
                href="https://plants.sc.egov.usda.gov/home"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                The PLANTS Database:
              </Link>{" "}
              USDA, NRCS. 2021. The PLANTS Database (http://plants.usda.gov,
              10/27/2021). National Plant Data Team, Greensboro, NC USA.
            </Typography>
          </ListItem>
        </List>
      </Container>
      <Footer />
    </>
  );
};

export default data;
