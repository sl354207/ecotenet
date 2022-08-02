import Header from "@components/Header";
import Link from "@components/Link";
import { Container, List, ListItem } from "@mui/material";
import { getEcoregions } from "@utils/mongodb";

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
  };
};

export default ecoregions;
