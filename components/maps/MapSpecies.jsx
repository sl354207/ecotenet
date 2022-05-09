import Coords from "@data/eco_coord.json";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";

const useStyles = makeStyles(() => ({
  popup: {
    display: "grid",
  },
}));

const MapSpecies = ({ clickInfo, state }) => {
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;
  const classes = useStyles();

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

  const [showLoad, setShowLoad] = useState(false);

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onHover = useCallback(
    (event) => {
      setShowPopup(true);
      const region = event.features && event.features[0];

      if (region.properties.unique_id != "<NA>") {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && region.properties.name,
          regionNum: region && region.properties.unique_id,
        });
      }
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

  const handleClick = (event) => {
    setShowLoad(true);
    router.push("/success");
  };

  const clickedRegions = clickInfo;

  const clickFilter = ["in", "unique_id", ...clickedRegions];

  const speciesRegions1 = state[1].regions;

  const speciesFilter1 = ["in", "unique_id", ...speciesRegions1];

  const speciesRegions2 = state[2].regions;

  const speciesFilter2 = ["in", "unique_id", ...speciesRegions2];

  const speciesRegions3 = state[3].regions;

  const speciesFilter3 = ["in", "unique_id", ...speciesRegions3];

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
      if (speciesRegions1.length > 0 && prevCount1 !== speciesRegions1) {
        const coord = Coords.filter(
          (region) => region.unique_id == speciesRegions1[0]
        );

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

        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
    },
    [speciesRegions1, speciesRegions2, speciesRegions3]
  );

  //
  return (
    <>
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
          mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs/draft"
          mapboxAccessToken={mapBox}
          interactiveLayerIds={["eco-fill"]}
          onClick={onHover}
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
                {!showLoad ? (
                  <>
                    <Typography color="textSecondary" align="center">
                      {ecoName}
                    </Typography>
                    <Typography color="textSecondary" align="center">
                      Eco-{selectedRegion}
                    </Typography>
                    <Button
                      variant="contained"
                      disableElevation={true}
                      size="small"
                      color="primary"
                      onClick={handleClick}
                    >
                      Enter
                    </Button>
                  </>
                ) : (
                  <CircularProgress
                    color="primary"
                    size={100}
                    disableShrink={true}
                  />
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </>
  );
};

export default MapSpecies;
