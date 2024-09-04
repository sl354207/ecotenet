import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Divider, List, ListItem, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const Data = () => {
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
          <ListItem divider key={"iucn"}>
            <Typography variant="h6">
              <Link
                href="https://www.iucnredlist.org/"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                IUCN Red List of Threatened Species:
              </Link>{" "}
              IUCN 2024. The IUCN Red List of Threatened Species. 2024-1.2.
              https://www.iucnredlist.org. Downloaded on 30 May 2024. The
              datasets can be found{" "}
              <Link
                href="https://www.iucnredlist.org/resources/spatial-data-download"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                here.
              </Link>
            </Typography>
          </ListItem>
          <ListItem divider key={"little"}>
            <Typography variant="h6">
              <Link
                href="https://www.fs.usda.gov/database/feis/pdfs/Little/aa_SupportingFiles/LittleMaps.html"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                Atlas of United States trees:
              </Link>{" "}
              Fryer, Janet L., comp. 2018. Tree species distribution maps from
              Little&apos;s &quot;Atlas of United States trees&quot; series. In:
              Fire Effects Information System, [Online]. U.S. Department of
              Agriculture, Forest Service, Rocky Mountain Research Station, Fire
              Sciences Laboratory (Producer). Will Petry, & Shawn Taylor.
              (2022). wpetry/USTreeAtlas: Initial release (v1.0). Zenodo. The
              dataset can be found{" "}
              <Link
                href="https://doi.org/10.5281/zenodo.7445016"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                here.
              </Link>
            </Typography>
          </ListItem>
          <ListItem divider key={"gap"}>
            <Typography variant="h6">
              <Link
                href="https://www.sciencebase.gov/catalog/item/5951527de4b062508e3b1e79"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                USGS Gap Analysis Project
              </Link>{" "}
              U.S. Geological Survey (USGS) Gap Analysis Project (GAP), 2018,
              U.S.Geological Survey - Gap Analysis Project Species Range Maps
              CONUS_2001: U.S. Geological Survey data release. The dataset can
              be found{" "}
              <Link
                href="https://doi.org/10.5066/F7Q81B3R"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                here.
              </Link>
            </Typography>
          </ListItem>
        </List>
      </Container>
      <Footer />
    </>
  );
};

export default Data;
