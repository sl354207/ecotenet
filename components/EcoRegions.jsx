import { List, ListItem } from "@mui/material";
import { useCallback } from "react";
import { useMap } from "react-map-gl";
import Header from "./Header";

const EcoRegions = ({
  ecoregions,
  ecoMove,
  setEcoMove,
  setEcoFilter,
  coords,
  setWiki,
  setHoverInfo,
  setEcoName,
  setEcoId,
}) => {
  //   console.log(ecoregions);
  const sorted = ecoregions.sort(function (a, b) {
    return a.unique_id - b.unique_id;
  });

  const { mapA } = useMap();

  const ecoClick = useCallback(
    (ecoregion) => {
      //   console.log(ecoregion);
      // setShowPopup(true);

      // setClick(false);

      // if (click) {
      //   setOpenSummary(true);
      // }

      // const region = event.features && event.features[0];

      // if (region.properties.unique_id != "<NA>") {
      //   sessionStorage.setItem("ecoregion", ecoregion.unique_id);
      //   //   const coord = ecoregion.coordinates;
      //   //   console.log(coord);
      setHoverInfo({
        longitude: ecoregion.coordinates[0],
        latitude: ecoregion.coordinates[1],
        regionName: ecoregion.name,
        regionNum: ecoregion.unique_id,
      });
      setEcoFilter(ecoregion.unique_id);
      setEcoMove({ name: ecoregion.name, id: ecoregion.unique_id });
      setEcoName(ecoregion.name);
      setEcoId(ecoregion.unique_id);

      //   switch (ecoregion.url) {
      //     case undefined:
      //       setWiki(
      //         `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${ecoregion.name.replace(
      //           " ",
      //           "_"
      //         )}?redirect=true`,
      //         {
      //           method: "GET",

      //           "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
      //         }
      //       );

      //       // wiki = await wikiRes.json();

      //       break;
      //     case "undefined":
      //       setWiki(undefined);

      //       break;

      //     default:
      //       setWiki(
      //         `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${ecoregion.url.replace(
      //           " ",
      //           "_"
      //         )}?redirect=true`,
      //         {
      //           method: "GET",

      //           "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
      //         }
      //       );

      //       // wiki = await wikiRes.json();

      //       break;
      //   }

      // console.log(region.properties.unique_id);
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

  //   const handleClick = (e) => {
  //     console.log(e);
  //     sessionStorage.setItem(
  //         "ecoregion",

  //       );
  //       setEcoFilter(region && region.properties.unique_id);
  //   };
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
