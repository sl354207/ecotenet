import MapMain from "@components/maps/MapMain";
import React from "react";

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
