import React from "react";
import dynamic from "next/dynamic";

import Map from "../components/Map";

export default function MapPage() {
  // const Map = dynamic(() => import("../components/Map"), {
  //   loading: () => "Loading...",
  //   ssr: false,
  // });

  return (
    <div id="map">
      <Map />
    </div>
  );
}
