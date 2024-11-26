import { List, ListItemButton, Typography } from "@mui/material";
import { useCallback } from "react";
import { useMap } from "react-map-gl";

const DsmwRegions = ({
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
  dsmw,
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

          regionName: {},
          regionNum: ecoregion.specific_soil_name,
        });

        ecoregion._id = ecoregion.specific_soil_name;
        ecoregion.layer = "dsmw";
        sessionStorage.setItem("ecoregion", JSON.stringify(ecoregion));
        setEcoFilter(ecoregion);
        setEcoMove({ name: ecoregion.specific_soil_name, id: ecoregion.id });

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
            Soil Regions
          </Typography>
        )}

        <Typography variant="h6" align="center">
          Select a soil region on the map, or from the list below, to view a
          summary and filter a region by category
        </Typography>
      </div>

      <List>
        {dsmw
          .filter(
            (ecoregion) => !["No data"].includes(ecoregion.specific_soil_name)
          )
          .sort((a, b) => {
            const lastItems = [
              "Rock debris or desert detritus",
              "Salt flats",
              "Glacier",
              "Dunes or shifting sands",
              "Inland water or ocean",
            ];
            if (
              lastItems.includes(a.specific_soil_name) &&
              !lastItems.includes(b.specific_soil_name)
            ) {
              return 1;
            } else if (
              !lastItems.includes(a.specific_soil_name) &&
              lastItems.includes(b.specific_soil_name)
            ) {
              return -1;
            } else {
              const wordsA = a.specific_soil_name.split(" ");
              const wordsB = b.specific_soil_name.split(" ");
              const sortKeyA = wordsA.length > 1 ? wordsA[1] : wordsA[0];
              const sortKeyB = wordsB.length > 1 ? wordsB[1] : wordsB[0];
              const secondWordCompare = sortKeyA
                .toLowerCase()
                .localeCompare(sortKeyB.toLowerCase());
              if (secondWordCompare === 0) {
                // If second words are equal, prioritize single-word strings
                if (wordsA.length === 1) {
                  return -1;
                } else if (wordsB.length === 1) {
                  return 1;
                } else {
                  // If both are multi-word, sort by first word
                  return wordsA[0]
                    .toLowerCase()
                    .localeCompare(wordsB[0].toLowerCase());
                }
              } else {
                return secondWordCompare;
              }
            }
          })
          .map((ecoregion) => {
            return (
              <ListItemButton
                onClick={() => ecoClick(ecoregion)}
                key={ecoregion.specific_soil_name}
              >
                {ecoregion.specific_soil_name}
              </ListItemButton>
            );
          })}
      </List>
    </>
  );
};

export default DsmwRegions;
