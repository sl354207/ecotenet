import { Button, Typography } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useMemo, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";

const MapStats = ({ isMobile, ecoregions }) => {
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;

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

  //   stats bubble layer
  const ecoStatsBubble = {
    id: "eco-stats-bubble",
    type: "circle",
    source: "data",
    // "source-layer": "ecomap-tiles",
    paint: {
      "circle-color": [
        "interpolate",
        ["linear"],
        ["get", "species_count"],
        0,
        "#c8fcff",
        100,
        "#c8fcff",
        1000,
        "#94c9ff",
        10000,
        "#94c9ff",
      ],
      "circle-opacity": 0.6,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "species_count"],
        0,
        2,
        100,
        5,
        1000,
        10,
        10000,
        20,
      ],
    },
  };

  //   bubble text layer
  const ecoStatsText = {
    id: "eco-stats-text",
    type: "symbol",
    source: "data",
    // "source-layer": "ecomap-tiles",
    layout: {
      "text-field": ["concat", ["to-string", ["get", "species_count"]]],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "rgba(255,255,255,1)",
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

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onHover = useCallback(
    (event) => {
      setShowPopup(true);
      const region = event.features && event.features[0];

      if (region.properties.unique_id !== "<NA>") {
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

  //   {type: "feature",
  //   geometry: {type : "Point", coordinates: [] },
  //   properties: {name    : "",
  //             category: ""
  //             }
  // }
  //   console.log(ecoregions);

  const data = {};
  data.type = "FeatureCollection";
  data.features = ecoregions.map((ecoregion) => {
    return {
      type: "feature",
      geometry: { type: "Point", coordinates: ecoregion.coordinates },
      properties: {
        name: ecoregion.name,
        unique_id: ecoregion.unique_id,
        species_count: ecoregion.species_count,
      },
    };
  });
  return (
    <>
      <Map
        reuseMaps
        style={{
          width: "auto",
          height: "80vh",
          margin: "10px 10px 0px 10px",
          border: "1px solid #94c9ff",
        }}
        initialViewState={{
          latitude: 37.8,
          longitude: -98,
          zoom: 3,
          bearing: 0,
          pitch: 0,
        }}
        minZoom={2}
        maxZoom={9}
        doubleClickZoom={false}
        boxZoom={false}
        dragRotate={false}
        touchPitch={false}
        mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs"
        mapboxAccessToken={mapBox}
        interactiveLayerIds={["eco-fill"]}
        onClick={onHover}
      >
        <Source id="eco-map" type="vector" url="mapbox://sl354207.ecomap-tiles">
          <Layer id="base" beforeId="waterway-label" {...ecoFill} />

          <Layer
            id="hover"
            beforeId="waterway-label"
            {...ecoFill1}
            filter={filter}
          />

          <Layer beforeId="waterway-label" {...ecoLine} />
        </Source>
        <Source id="eco-stats" type="geojson" data={data}>
          <Layer
            id="eco-stats-bubble"
            beforeId="waterway-label"
            {...ecoStatsBubble}
            // filter={clickFilter}
          />
          <Layer
            id="eco-stats-text"
            beforeId="waterway-label"
            {...ecoStatsText}
            // filter={clickFilter}
          />
        </Source>
        {selectedRegion && showPopup && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeOnClick={false}
            // onClose={() => setShowPopup(false)}
            maxWidth="500px"
            focusAfterOpen={false}
            closeButton={false}
          >
            <div style={{ display: "grid" }}>
              <Typography
                color="textSecondary"
                align="center"
                sx={{ fontWeight: 500 }}
              >
                Eco-{selectedRegion}
              </Typography>
              <Typography
                color="textSecondary"
                align="center"
                sx={{ fontWeight: 500, minWidth: "150px" }}
              >
                {ecoName}
              </Typography>
            </div>
            <Button
              size="small"
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "flex",
                justifyContent: "end",
                paddingRight: "10px",
              }}
              onClick={() => setShowPopup(false)}
            >
              x
            </Button>
          </Popup>
        )}
      </Map>
    </>
  );
};

export default MapStats;
