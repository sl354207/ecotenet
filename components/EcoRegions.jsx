import { List, ListItem } from "@mui/material";
import { useCallback } from "react";
import { useMap } from "react-map-gl";
import Header from "./Header";

const EcoRegions = ({
  ecoregions,
  ecoMove,
  setEcoMove,
  setEcoFilter,
  setWiki,
  setHoverInfo,
}) => {
  //   console.log(ecoregions);
  const sorted = ecoregions.sort(function (a, b) {
    return a.unique_id - b.unique_id;
  });

  const { mapA } = useMap();

  const ecoClick = useCallback(
    (ecoregion) => {
      // if (click) {
      //   setOpenSummary(true);
      // }

      setHoverInfo({
        longitude: ecoregion.coordinates[0],
        latitude: ecoregion.coordinates[1],
        regionName: ecoregion.name,
        regionNum: ecoregion.unique_id,
      });
      setEcoFilter(ecoregion.unique_id);
      setEcoMove({ name: ecoregion.name, id: ecoregion.unique_id });

      setWiki(ecoregion);

      mapA.easeTo({
        center: ecoregion.coordinates,
        duration: 3000,
        zoom: 3.5,
        // speed: 0.2,
        // essential: true,
      });
    },
    [ecoMove]
  );

  return (
    <>
      <Header title="Ecoregions" />
      <List>
        {sorted.map((ecoregion) => {
          return (
            <ListItem button onClick={() => ecoClick(ecoregion)}>
              Eco-{ecoregion.unique_id}: {ecoregion.name}
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default EcoRegions;
