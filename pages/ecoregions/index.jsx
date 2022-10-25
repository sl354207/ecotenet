import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, List, ListItem } from "@mui/material";
import { getEcoregions } from "@utils/mongodb/helpers";

const ecoregions = ({ ecoregions }) => {
  const sorted = ecoregions.sort(function (a, b) {
    return a.unique_id - b.unique_id;
  });
  //   console.log(sorted);

  return (
    <Container>
      <Header title="Ecoregions" />
      <List>
        {sorted.map((ecoregion) => {
          return (
            <ListItem>
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
  );
};

export const getStaticProps = async () => {
  const ecoregions = await getEcoregions();
  //   console.log(ecoregions);

  return {
    props: {
      ecoregions: JSON.parse(JSON.stringify(ecoregions)),
    },
    revalidate: 60,
  };
};

export default ecoregions;
