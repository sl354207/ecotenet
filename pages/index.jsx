import React from "react";
import MapMain from "../components/maps/MapMain";

export default function MapPage() {
  // need to dynamically import to work with mapbox
  // const MapMain = dynamic(() => import("../components/MapMain"), {
  //   loading: () => "Loading...",
  //   ssr: false,
  // });

  return (
    <div id="map">
      <MapMain />
    </div>
  );
}
