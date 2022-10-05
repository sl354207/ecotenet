import { List, ListItem, Typography } from "@mui/material";
import { useCallback } from "react";
import { useMap } from "react-map-gl";

const EcoRegions = ({
  ecoregions,
  ecoMove,
  setEcoMove,
  setEcoFilter,
  setWiki,
  setHoverInfo,
  setShowPopup,
  visitedHome,
  setTab,
  click,
  setClick,
}) => {
  const sorted = ecoregions.sort(function (a, b) {
    return a.unique_id - b.unique_id;
  });

  const { mapA } = useMap();

  const ecoClick = useCallback(
    (ecoregion) => {
      setShowPopup(true);

      setHoverInfo({
        longitude: ecoregion.coordinates[0],
        latitude: ecoregion.coordinates[1],
        regionName: ecoregion.name,
        regionNum: ecoregion.unique_id,
      });
      sessionStorage.setItem("ecoregion", JSON.stringify(ecoregion));
      setEcoFilter(ecoregion);
      setEcoMove({ name: ecoregion.name, id: ecoregion.unique_id });

      setWiki(ecoregion);

      mapA.easeTo({
        center: ecoregion.coordinates,
        duration: 3000,
        zoom: 3.5,
        // speed: 0.2,
        // essential: true,
      });
      if (!visitedHome && !click) {
        setTab(2);
      }
      setClick(true);
    },
    [ecoMove]
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: "15px" }}>
          Ecoregions
        </Typography>
        <Typography variant="h6" align="center">
          Select an ecoregion from the map or from the list below
        </Typography>
      </div>

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
