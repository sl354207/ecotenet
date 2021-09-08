import { useState, useMemo, useCallback, useRef } from "react";
import ReactMapGL, { Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useRouter } from "next/router";
import { Button, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const Map = () => {
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //  base layer
  const ecoFill = {
    id: "eco-fill",
    type: "fill",
    // source: "eco-data",
    "source-layer": "zoom",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#627BC1",
      "fill-opacity": 0,
    },
  };

  // hover layer
  const ecoFill1 = {
    id: "eco-fill1",
    type: "fill",
    // source: "eco-fill",
    "source-layer": "zoom",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#627BC1",
      "fill-opacity": 0.5,
    },
  };

  // outline layer
  const ecoLine = {
    id: "eco-line",
    type: "line",
    // source: "eco-fill",
    "source-layer": "zoom",
    layout: {},
    paint: {
      "line-color": "rgba(0,0,0,1)",
      "line-width": 2,
    },
  };

  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -98,
    zoom: 4,
    bearing: 0,
    pitch: 0,
  });

  const [hoverInfo, setHoverInfo] = useState(null);

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onHover = useCallback((event) => {
    const region = event.features && event.features[0];

    setHoverInfo({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
      regionName: region && region.properties.ECO_NAME,
      regionNum: region && region.properties.unique_id,
    });
    // console.log(region);
  }, []);

  const selectedRegion = (hoverInfo && hoverInfo.regionName) || "";

  const ecoID = (hoverInfo && hoverInfo.regionNum) || "";

  // check layer and style expressions in mapbox docs for array setup. useMemo memoizes the return value of a function(useCallback memoizes the function not the return value) so the return value can be reused between re-renders. Function is re-ran when value of selectedRegion changes.
  const filter = useMemo(
    () => ["in", "ECO_NAME", selectedRegion],
    [selectedRegion]
  );

  const [clickInfo, setClickInfo] = useState([]);

  // turn ecoregion name into proper slug
  const slugify = (text) =>
    text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  const handleClick = (event) => {
    const region = event.features && event.features[0];
    // console.log(selectedRegion);
    if (selectedRegion !== "") {
      const slug = slugify(selectedRegion);
      // router.push(`/${slug}`);
      router.push("/success");
    }
  };

  // set ref and functionality for geocoder
  const geocoderContainerRef = useRef();
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  return (
    <>
      {isMobile ? (
        <div style={{ height: "100vh" }}>
          <div
            ref={geocoderContainerRef}
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1 }}
          />
          {/* <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
            <Button variant="contained">test</Button>
          </div> */}
          <ReactMapGL
            ref={mapRef}
            {...viewport}
            width="100vw"
            height="100vh"
            minZoom={2}
            maxZoom={9}
            doubleClickZoom={false}
            mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
            onViewportChange={handleViewportChange}
            mapboxApiAccessToken={mapBox}
            interactiveLayerIds={["eco-fill"]}
            onHover={onHover}
            onDblClick={handleClick}
          >
            <Geocoder
              mapRef={mapRef}
              containerRef={geocoderContainerRef}
              onViewportChange={handleViewportChange}
              mapboxApiAccessToken={mapBox}
              position="top-left"
            />
            <Source
              id="eco-data"
              type="vector"
              url="mapbox://sl354207.ecozoom-tiles"
            >
              <Layer beforeId="waterway-label" {...ecoLine} />
              <Layer beforeId="waterway-label" {...ecoFill} />
              <Layer beforeId="waterway-label" {...ecoFill1} filter={filter} />
            </Source>
            {selectedRegion && (
              <Popup
                longitude={hoverInfo.longitude}
                latitude={hoverInfo.latitude}
                closeButton={false}
              >
                <div>{selectedRegion}</div>
                <div>{ecoID}</div>
              </Popup>
            )}
          </ReactMapGL>
        </div>
      ) : (
        <div style={{ height: "100vh" }}>
          <div
            ref={geocoderContainerRef}
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1 }}
          />
          {/* <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
            <Button variant="contained">test</Button>
          </div> */}
          <ReactMapGL
            ref={mapRef}
            {...viewport}
            width="100vw"
            height="100vh"
            minZoom={2}
            maxZoom={9}
            doubleClickZoom={false}
            mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
            onViewportChange={handleViewportChange}
            mapboxApiAccessToken={mapBox}
            interactiveLayerIds={["eco-fill"]}
            onHover={onHover}
            onClick={handleClick}
          >
            <Geocoder
              mapRef={mapRef}
              containerRef={geocoderContainerRef}
              onViewportChange={handleViewportChange}
              mapboxApiAccessToken={mapBox}
              position="top-left"
            />
            <Source
              id="eco-data"
              type="vector"
              url="mapbox://sl354207.ecozoom-tiles"
            >
              <Layer beforeId="waterway-label" {...ecoLine} />
              <Layer beforeId="waterway-label" {...ecoFill} />
              <Layer beforeId="waterway-label" {...ecoFill1} filter={filter} />
            </Source>
            {selectedRegion && (
              <Popup
                longitude={hoverInfo.longitude}
                latitude={hoverInfo.latitude}
                closeButton={false}
              >
                <div>{selectedRegion}</div>
                <div>Eco-{ecoID}</div>
              </Popup>
            )}
          </ReactMapGL>
        </div>
      )}
    </>
  );
};

export default Map;
