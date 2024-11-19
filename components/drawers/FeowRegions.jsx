import { List, ListItemButton, Typography } from "@mui/material";
import { useCallback } from "react";
import { useMap } from "react-map-gl";

const FeowRegions = ({
  ecoMove,
  setEcoMove,
  setEcoFilter,
  setHoverInfo,
  setShowPopup,
  visitedHome,
  setTab,
  click,
  setClick,
  isMobile,
  feow,
}) => {
  // for map context provider
  const { mapMain } = useMap();

  const ecoClick = useCallback(
    (ecoregion) => {
      if (mapMain) {
        setShowPopup(true);

        setHoverInfo({
          longitude: ecoregion.coordinates[0],
          latitude: ecoregion.coordinates[1],
          regionName: ecoregion.name,
          regionNum: ecoregion.id,
        });

        ecoregion._id = ecoregion.id;
        ecoregion.layer = "feow";
        sessionStorage.setItem("ecoregion", JSON.stringify(ecoregion));
        setEcoFilter(ecoregion);
        setEcoMove({ name: ecoregion.name, id: ecoregion.id });

        if (!visitedHome && !click) {
          setTab({ id: 1, label: "Summary" });
        }
        setClick(true);

        mapMain.easeTo({
          center: ecoregion.coordinates,
          duration: 3000,
          zoom: 3.5,
        });
      }
    },
    [mapMain, ecoMove]
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {!isMobile && (
          <Typography
            variant="h5"
            align="center"
            sx={{ marginBottom: "4px", marginTop: "10px", fontWeight: 500 }}
          >
            Freshwater Ecoregions
          </Typography>
        )}

        <Typography variant="h6" align="center">
          Select a freshwater ecoregion on the map, or from the list below, to
          view a summary and filter an ecoregion by category
        </Typography>
      </div>

      <List>
        {feow.map((ecoregion) => {
          return (
            <ListItemButton
              onClick={() => ecoClick(ecoregion)}
              key={ecoregion.id}
            >
              FEOW-{ecoregion.id}: {ecoregion.name}
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
};

export default FeowRegions;
