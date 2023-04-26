import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, List, ListItem } from "@mui/material";
import { getEcoregions } from "@utils/mongodb/mongoHelpers";
import { CollectionPageJsonLd, NextSeo } from "next-seo";

const ecoregions = ({ ecoregions }) => {
  const sorted = ecoregions.sort(function (a, b) {
    return a.unique_id - b.unique_id;
  });

  const ecoregionsSEO = ecoregions.map((eco) => {
    const seo = {
      name: eco.name,
    };
    return seo;
  });

  return (
    <>
      <NextSeo
        title="Ecoregions"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="A list of all of the ecoregions you can explore on Ecotenet"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/ecoregions",
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
      <CollectionPageJsonLd name="Ecoregions" hasPart={ecoregionsSEO} />
      <Container>
        <Header title="Ecoregions" />
        <List>
          {sorted.map((ecoregion) => {
            return (
              <ListItem key={ecoregion.unique_id}>
                Eco-{ecoregion.unique_id}:{" "}
                <Link
                  sx={{ marginLeft: "5px" }}
                  href={`/ecoregions/${ecoregion.unique_id}`}
                >
                  {ecoregion.name}
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </>
  );
};

export const getStaticProps = async () => {
  const ecoregions = await getEcoregions();

  return {
    props: {
      ecoregions: JSON.parse(JSON.stringify(ecoregions)),
    },
    revalidate: 60,
  };
};

export default ecoregions;
