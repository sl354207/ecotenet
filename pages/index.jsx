// import MapMain from "@components/maps/MapMain";
import { useMediaQuery } from "@mui/material";
import theme from "@utils/theme";
// import dynamic from "next/dynamic";
import MapMain from "@components/maps/MapMain";

export default function MapPage({ setEcoFilter }) {
  // need to dynamically import to work with mapbox
  // const MapMain = dynamic(() => import("@components/maps/MapMain"), {
  //   ssr: false,
  // });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div id="map-main">
      <MapMain zoom={isMobile ? 3 : 4} setEcoFilter={setEcoFilter} />
    </div>
  );
}
