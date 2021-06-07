import { useState, useMemo, useCallback } from "react";
import ReactMapGL, { Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useRouter } from "next/router";

const Map1 = () => {
  const router = useRouter();
  const mapBox =
    "pk.eyJ1Ijoic2wzNTQyMDciLCJhIjoiY2twaDJ1OTU1MDhtZDJ1b2x0N3c3ZnYwdiJ9.P7qlEddqung5yTH_u8VF7Q";

  const ecoFill = {
    id: "eco-fill",
    type: "fill",
    source: "eco-data",
    "source-layer": "wwf_terr_ecos-bwy8bw",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#627BC1",
      "fill-opacity": 0,
    },
  };
  const ecoFill1 = {
    id: "eco-fill1",
    type: "fill",
    source: "eco-data",
    "source-layer": "wwf_terr_ecos-bwy8bw",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#627BC1",
      "fill-opacity": 0.5,
    },
  };
  const ecoFill2 = {
    id: "eco-fill2",
    type: "fill",
    source: "eco-data",
    "source-layer": "wwf_terr_ecos-bwy8bw",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#627BC1",
      "fill-opacity": 0.6,
    },
  };
  const ecoLine = {
    id: "eco-line",
    type: "line",
    source: "eco-data",
    "source-layer": "wwf_terr_ecos-bwy8bw",
    layout: {},
    paint: {
      "line-color": "rgba(0,0,0,1)",
      "line-width": 2,
    },
  };
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 4,
    bearing: 0,
    pitch: 0,
  });

  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback((event) => {
    const region = event.features && event.features[0];

    setHoverInfo({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
      regionName: region && region.properties.ECO_NAME,
    });
    // console.log(region);
  }, []);

  const selectedRegion = (hoverInfo && hoverInfo.regionName) || "";
  // console.log(selectedRegion);

  const filter = useMemo(
    () => ["in", "ECO_NAME", selectedRegion],
    [selectedRegion]
  );
  // console.log(filter);

  const [clickInfo, setClickInfo] = useState([]);

  // const handleClick = () => {
  //     if (selectedRegion !== ''){
  //         router.push('/');
  //     }

  //   }

  const onClick = useCallback((event) => {
    const region = event.features && event.features[0];

    setClickInfo((clickInfo) => {
      if (!clickInfo.includes(region && region.properties.ECO_NAME)) {
        return [...clickInfo, region && region.properties.ECO_NAME];
      } else {
        const removed = clickInfo.splice(
          clickInfo.indexOf(region.properties.ECO_NAME),
          1
        );
        // console.log(removed);
        // console.log(clickInfo);
        return clickInfo;
      }
    });
    // console.log(clickInfo);
  }, []);

  const clickedRegions = clickInfo;
  // console.log(clickedRegions);

  // const clickFilter = useMemo(
  //   () => ["in", "ECO_NAME", ...clickedRegions],

  //   [clickedRegions]
  // );
  const clickFilter = ["in", "ECO_NAME", ...clickedRegions];

  return (
    <ReactMapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
      onViewportChange={setViewport}
      mapboxApiAccessToken={mapBox}
      interactiveLayerIds={["eco-fill"]}
      onHover={onHover}
      onClick={onClick}
    >
      <Source id="eco-data" type="vector" url="mapbox://sl354207.0w3ac669">
        <Layer beforeId="waterway-label" {...ecoLine} />
        <Layer beforeId="waterway-label" {...ecoFill} />
        <Layer beforeId="waterway-label" {...ecoFill1} filter={filter} />
        <Layer beforeId="waterway-label" {...ecoFill2} filter={clickFilter} />
      </Source>
      {selectedRegion && (
        <Popup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          closeButton={false}
        >
          {selectedRegion}
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map1;
