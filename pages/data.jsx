import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Divider, List, ListItem, Typography } from "@mui/material";

const data = () => {
  return (
    <Container>
      <Header title="Datasets" />
      <Divider sx={{ marginTop: "20px" }} />
      <List>
        <ListItem divider>
          <Typography variant="h6">
            <Link
              href="https://www.worldwildlife.org/pages/wildfinder-database"
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
        <ListItem divider>
          <Typography variant="h6">
            <Link
              href="https://www.gbif.org/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              iNaturalist Research-grade Observations:
            </Link>{" "}
            GBIF.org (20 November 2021) GBIF Occurrence Download
            https://doi.org/10.15468/dl.nuajth
          </Typography>
        </ListItem>
        <ListItem divider>
          <Typography variant="h6">
            <Link
              href="https://obis.org/data/access/"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ocean Biodiversity Information System:
            </Link>{" "}
            OBIS (2021) Ocean Biodiversity Information System. Intergovernmental
            Oceanographic Commission of UNESCO. www.obis.org.
          </Typography>
        </ListItem>
        <ListItem divider>
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
  );
};

export default data;
