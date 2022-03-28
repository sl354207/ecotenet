import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Map, { Popup, Source, Layer, mapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useRouter } from "next/router";
import {
  Button,
  useMediaQuery,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ContactSupportOutlined } from "@material-ui/icons";

import Coords from "../data/eco_coord.json";

// const { MAPBOX } = process.env;

const useStyles = makeStyles((theme) => ({
  popup: {
    display: "grid",
  },
}));

const MapEditor = ({ clickInfo, state, handleDblClick }) => {
  // console.log(speciesInfo1);
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // base layer
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
      // "fill-color": "#627BC1",
      "fill-color": "#94c9ff",
      "fill-opacity": 0.5,
    },
  };
  // click layer
  const ecoFill2 = {
    id: "eco-fill2",
    type: "fill",
    // source: "eco-fill",
    "source-layer": "ecomap-tiles",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#dddddd",
      "fill-opacity": 1,
    },
  };
  // selected layer
  const ecoFill3 = {
    id: "eco-fill3",
    type: "fill",
    // source: "eco-fill",
    "source-layer": "ecomap-tiles",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#ff00ff",
      // "fill-color": "#990399",
      "fill-opacity": 0.4,
    },
  };
  // selected layer
  const ecoFill4 = {
    id: "eco-fill4",
    type: "fill",
    // source: "eco-fill",
    "source-layer": "ecomap-tiles",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#ffff00",
      // "fill-color": "#fcfbcc",
      "fill-opacity": 0.6,
    },
  };
  // selected layer
  const ecoFill5 = {
    id: "eco-fill5",
    type: "fill",
    // source: "eco-fill",
    "source-layer": "ecomap-tiles",
    paint: {
      "fill-outline-color": "rgba(0,0,0,1)",
      "fill-color": "#00ffff",
      // "fill-color": "#00ffff",
      "fill-opacity": 0.8,
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

  const [hoverInfo, setHoverInfo] = useState(null);

  const [showPopup, setShowPopup] = useState(true);

  // const [showLoad, setShowLoad] = useState(false);

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onHover = useCallback(
    (event) => {
      setShowPopup(true);
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
  // console.log(selectedRegion);

  const ecoName = (hoverInfo && hoverInfo.regionName) || "";

  // check layer and style expressions in mapbox docs for array setup. useMemo memoizes the return value of a function(useCallback memoizes the function not the return value) so the return value can be reused between re-renders. Function is re-ran when value of selectedRegion changes.
  const filter = useMemo(
    () => ["in", "unique_id", selectedRegion],
    [selectedRegion]
  );

  // const [clickInfo, setClickInfo] = useState([]);

  // turn ecoregion name into proper slug
  // const slugify = (text) =>
  //   text
  //     .toString()
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "")
  //     .toLowerCase()
  //     .trim()
  //     .replace(/\s+/g, "-")
  //     .replace(/[^\w-]+/g, "")
  //     .replace(/--+/g, "-");

  // const handleClick = (event) => {
  //   // const handleClick = (event) => {
  //   // const region = event.features && event.features[0];
  //   // // console.log(selectedRegion);
  //   // if (selectedRegion !== "") {
  //   //   const slug = slugify(selectedRegion);
  //   //   // router.push(`/${slug}`);
  //   //   router.push("/success");
  //   // }
  //   setShowLoad(true);
  //   router.push("/success");
  // };

  const clickedRegions = clickInfo;
  // console.log(clickedRegions);

  // const clickFilter = useMemo(
  //   () => ["in", "ECO_NAME", ...clickedRegions],

  //   [clickedRegions]
  // );
  const clickFilter = ["in", "unique_id", ...clickedRegions];

  const speciesRegions1 = state[1].regions;
  // console.log(speciesRegions1);

  const speciesFilter1 = ["in", "unique_id", ...speciesRegions1];
  // const speciesFilter1 = ["in", "unique_id", "313"];
  // console.log(speciesFilter1);

  const speciesRegions2 = state[2].regions;
  // console.log(speciesRegions2);

  const speciesFilter2 = ["in", "unique_id", ...speciesRegions2];
  // console.log(speciesFilter2);

  const speciesRegions3 = state[3].regions;
  // console.log(speciesRegions3);

  const speciesFilter3 = ["in", "unique_id", ...speciesRegions3];
  // console.log(speciesFilter3);

  // console.log(clickFilter);

  const mapRef = useRef();

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const prevCount1 = usePrevious(speciesRegions1);
  const prevCount2 = usePrevious(speciesRegions2);
  const prevCount3 = usePrevious(speciesRegions3);

  const onMove = useCallback(
    (prevCount1, prevCount2, prevCount3) => {
      // console.log(event);
      // console.log(viewState);
      // console.log(prevViewState);
      if (speciesRegions1.length > 0 && prevCount1 !== speciesRegions1) {
        // setViewState(viewState);
        const coord = Coords.filter(
          (region) => region.unique_id == speciesRegions1[0]
        );
        // console.log(coord);
        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
      if (speciesRegions2.length > 0 && prevCount2 !== speciesRegions2) {
        const coord = Coords.filter(
          (region) => region.unique_id == speciesRegions2[0]
        );
        // console.log(coord);
        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
      if (speciesRegions3.length > 0 && prevCount3 !== speciesRegions3) {
        const coord = Coords.filter(
          (region) => region.unique_id == speciesRegions3[0]
        );
        // console.log(coord);
        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }

      // console.log(newViewState);
      // console.log(prevCount);
      // console.log(speciesRegions1);
    },
    [speciesRegions1, speciesRegions2, speciesRegions3]
  );

  //
  return (
    <>
      {/* {isMobile ? ( */}
      {/* <div style={{ height: "100vh" }}> */}
      {/* <div
            ref={geocoderContainerRef}
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1 }}
          /> */}
      {/* <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
            <Button variant="contained">test</Button>
          </div> */}
      {/* ref={mapRef}. ADD THIS IN REACTMAPGL COMPONENT IF YOU WANT SEARCH GEOCODER */}
      {/* <ReactMapGL
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
            onDblClick={handleMapClick}
          > */}
      {/* <Geocoder
              mapRef={mapRef}
              containerRef={geocoderContainerRef}
              onViewportChange={handleViewportChange}
              mapboxApiAccessToken={mapBox}
              position="top-left"
            /> */}
      {/* <Source
              id="eco-map"
              type="vector"
              url="mapbox://sl354207.ecomap-tiles"
            >
              <Layer beforeId="waterway-label" {...ecoLine} />
              <Layer beforeId="waterway-label" {...ecoFill} />
              <Layer beforeId="waterway-label" {...ecoFill1} filter={filter} />
              <Layer
                beforeId="waterway-label"
                {...ecoFill2}
                filter={clickFilter}
              />
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
          </ReactMapGL> */}
      {/* </div> */}
      {/* ) : ( */}
      <div>
        <Map
          reuseMaps
          style={{
            width: "auto",
            height: "80vh",
            margin: "0px 10px 0px 10px",
          }}
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
          boxZoom={false}
          dragRotate={false}
          touchPitch={false}
          // touchZoomRotate={false}
          mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
          mapboxAccessToken={mapBox}
          interactiveLayerIds={["eco-fill"]}
          onClick={onHover}
          onDblClick={handleDblClick}
          ref={mapRef}
          onSourceData={onMove(prevCount1, prevCount2, prevCount3)}
        >
          <Source
            id="eco-map"
            type="vector"
            url="mapbox://sl354207.ecomap-tiles"
          >
            <Layer id="base" beforeId="waterway-label" {...ecoFill} />

            <Layer
              beforeId="waterway-label"
              {...ecoFill5}
              filter={speciesFilter3}
            />
            <Layer
              beforeId="waterway-label"
              {...ecoFill4}
              filter={speciesFilter2}
            />
            <Layer
              id="species1"
              beforeId="waterway-label"
              {...ecoFill3}
              filter={speciesFilter1}
            />
            <Layer
              id="click"
              beforeId="waterway-label"
              {...ecoFill2}
              filter={clickFilter}
            />
            <Layer
              id="hover"
              beforeId="waterway-label"
              {...ecoFill1}
              filter={filter}
            />
            <Layer beforeId="waterway-label" {...ecoLine} />
          </Source>
          {selectedRegion && showPopup && (
            <Popup
              longitude={hoverInfo.longitude}
              latitude={hoverInfo.latitude}
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
              maxWidth="500px"
            >
              <div className={classes.popup}>
                <Typography color="textSecondary" align="center">
                  {ecoName}
                </Typography>
                <Typography color="textSecondary" align="center">
                  Eco-{selectedRegion}
                </Typography>
              </div>
            </Popup>
          )}
        </Map>
      </div>
      {/* )} */}
    </>
  );
};

export default MapEditor;
