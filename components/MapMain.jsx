import { useState, useMemo, useCallback, useRef } from "react";
import Map, { Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useRouter } from "next/router";
import { Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   popup: {
//     alignItems: "center",
//   },
// }));

const MapMain = () => {
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;
  // const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  //  base layer
  const ecoFill = {
    id: "eco-fill",
    type: "fill",
    // source: "eco-data",
    "source-layer": "ecomap-tiles",
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
    "source-layer": "ecomap-tiles",
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
    "source-layer": "ecomap-tiles",
    layout: {},
    paint: {
      "line-color": [
        "case",
        ["==", ["get", "TYPE"], "TEOW"],
        "rgb(5, 11, 15)",
        "rgb(62, 136, 185)",
      ],
      "line-width": ["case", ["==", ["get", "TYPE"], "TEOW"], 2, 1],
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
  const onHover = useCallback(
    (event) => {
      const region = event.features && event.features[0];
      // console.log(region.properties.unique_id);
      if (region.properties.unique_id != "<NA>") {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && region.properties.name,
          regionNum: region && region.properties.unique_id,
        });
      }

      // console.log(hoverInfo);
    },
    [hoverInfo]
  );

  const selectedRegion = (hoverInfo && hoverInfo.regionNum) || "";

  const ecoName = (hoverInfo && hoverInfo.regionName) || "";

  // check layer and style expressions in mapbox docs for array setup. useMemo memoizes the return value of a function(useCallback memoizes the function not the return value) so the return value can be reused between re-renders. Function is re-ran when value of selectedRegion changes.
  const filter = useMemo(
    () => ["in", "unique_id", selectedRegion],
    [selectedRegion]
  );

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
        <div style={{ height: "94vh" }}>
          {/* <div
            ref={geocoderContainerRef}
            style={{ position: "absolute", top: 100, left: 20, zIndex: 1 }}
          /> */}
          {/* <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
            <Button variant="contained">test</Button>
          </div> */}
          <Map
            style={{ width: "100vw", height: "94vh" }}
            // ref={mapRef}
            // {...viewport}
            // width="100vw"
            // height="94vh"
            initialViewState={{
              latitude: 37.8,
              longitude: -98,
              zoom: 4,
              bearing: 0,
              pitch: 0,
            }}
            minZoom={2}
            maxZoom={9}
            doubleClickZoom={false}
            mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
            // onViewportChange={handleViewportChange}
            mapboxAccessToken={mapBox}
            interactiveLayerIds={["eco-fill"]}
            // onMouseMove={onHover}
            onDblClick={handleClick}
          >
            {/* <Geocoder
              mapRef={mapRef}
              containerRef={geocoderContainerRef}
              onViewportChange={handleViewportChange}
              mapboxAccessToken={mapBox}
              position="top-left"
              placeholder="Search Map"
              clearAndBlurOnEsc="true"
              clearOnBlur="true"
            /> */}
            <Source
              id="ecomap"
              type="vector"
              url="mapbox://sl354207.ecomap-tiles"
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
                <Typography color="textSecondary" align="center">
                  {ecoName}
                </Typography>
                <Typography color="textSecondary" align="center">
                  Eco-{selectedRegion}
                </Typography>
              </Popup>
            )}
          </Map>
        </div>
      ) : (
        <div style={{ height: "94vh" }}>
          {/* <div
            ref={geocoderContainerRef}
            style={{
              position: "absolute",
              top: 100,
              left: 20,
              zIndex: 1,
            }}
          /> */}
          {/* <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
            <Button variant="contained">test</Button>
          </div> */}
          <Map
            style={{ width: "100vw", height: "94vh" }}
            // ref={mapRef}
            // {...viewport}
            // width="100vw"
            // height="94vh"
            initialViewState={{
              latitude: 37.8,
              longitude: -98,
              zoom: 4,
              bearing: 0,
              pitch: 0,
            }}
            minZoom={2}
            maxZoom={9}
            doubleClickZoom={false}
            mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
            // onViewportChange={handleViewportChange}
            mapboxAccessToken={mapBox}
            interactiveLayerIds={["eco-fill"]}
            onMouseMove={onHover}
            onClick={handleClick}
          >
            {/* <Geocoder
              mapRef={mapRef}
              containerRef={geocoderContainerRef}
              onViewportChange={handleViewportChange}
              mapboxAccessToken={mapBox}
              position="top-left"
              placeholder="Search Map"
              clearAndBlurOnEsc="true"
              clearOnBlur="true"
            /> */}
            <Source
              id="ecomap"
              type="vector"
              url="mapbox://sl354207.ecomap-tiles"
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
                maxWidth="500px"
                // className={classes.pointer}
              >
                <Typography color="textSecondary" align="center">
                  {ecoName}
                </Typography>
                <Typography color="textSecondary" align="center">
                  Eco-{selectedRegion}
                </Typography>
              </Popup>
              // <></>
            )}
          </Map>
        </div>
      )}
    </>
  );
};

export default MapMain;
