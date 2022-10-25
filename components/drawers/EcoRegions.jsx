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
  isMobile,
}) => {
  const sorted = ecoregions.sort(function (a, b) {
    return a.unique_id - b.unique_id;
  });

  const { mapA } = useMap();
  console.log(`initial ${mapA}`);

  const ecoClick = useCallback(
    (ecoregion) => {
      console.log(`initial click ${mapA}`);
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
        setTab({ id: 1, label: "Summary" });
      }
      setClick(true);
      console.log(`final ${mapA}`);
    },
    [ecoMove, mapA]
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {!isMobile && (
          <Typography
            variant="h4"
            align="center"
            sx={{ marginBottom: "15px", paddingTop: 3 }}
          >
            Ecoregions
          </Typography>
        )}

        <Typography variant="h6" align="center">
          Select an ecoregion on the map, or from the list below, to view a
          summary and filter an ecoregion by category
        </Typography>
      </div>

      {/* {ecoregions ? ( */}
      <List>
        {sorted.map((ecoregion) => {
          return (
            <ListItem
              button
              onClick={() => ecoClick(ecoregion)}
              key={ecoregion.unique_id}
            >
              Eco-{ecoregion.unique_id}: {ecoregion.name}
            </ListItem>
          );
        })}
      </List>
      {/* ) : (
        <CircularProgress
          color="secondary"
          size={50}
          disableShrink={true}
          sx={{
            margin: "100px auto",
            display: "flex",
            justifySelf: "center",
          }}
        />
      )} */}
    </>
  );
};

export default EcoRegions;
