import React from "react";
import dynamic from "next/dynamic";

export default function MapTest1(){
    const MapTest1 = dynamic(() => import("../components/Map1"), {
        loading: () => "Loading...",
        ssr: false
      });

      return (
    
        <div id="map" >
          <MapTest1 />
        </div>
      
    );
}
