import { CircularProgress, Typography } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Map, { AttributionControl, Layer, Source } from "react-map-gl";

const MapStats = ({ ecoregions, isLoading, mapRef }) => {
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;

  const [data, setData] = useState();

  const [display, setDisplay] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();

  const [clickInfo, setClickInfo] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    if (ecoregions) {
      const dataTemp = {};
      dataTemp.type = "FeatureCollection";
      dataTemp.features = ecoregions.map((ecoregion) => {
        return {
          type: "feature",
          geometry: { type: "Point", coordinates: ecoregion.coordinates },
          properties: {
            name: ecoregion.name,
            unique_id: ecoregion.unique_id,
            species_count: ecoregion.species_count,
            rank: ecoregion.rank,
          },
        };
      });
      setData(dataTemp);
      // find the min and max values of the species_count in ecoregions
      setMin(
        Math.min(...ecoregions.map((ecoregion) => ecoregion.species_count))
      );
      setMax(
        Math.max(...ecoregions.map((ecoregion) => ecoregion.species_count))
      );
    } else {
      setData(undefined);
      setDisplay(undefined);
      setHoverInfo(null);
      setClickInfo(null);
    }
  }, [ecoregions]);

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
  // click layer
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
        min,
        "#c8fcff",
        max,
        "#0071e4",
      ],
      "circle-opacity": 0.6,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "species_count"],
        min,
        10,
        max,
        30,
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
      "text-field": ["to-string", ["get", "rank"]],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "rgba(255,255,255,1)",
    },
  };

  // hover layer
  const ecoStatsHover = {
    id: "eco-stats-hover",
    type: "circle",
    source: "data",
    // "source-layer": "ecomap-tiles",

    paint: {
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "click"], true],
        [
          "interpolate",
          ["linear"],
          ["get", "species_count"],
          min,
          "#c8fcff",
          max,
          "#0071e4",
        ],
        "#fff",
      ],
      "circle-stroke-color": "#000",
      "circle-stroke-width": 3,
      "circle-opacity": 0.6,
      "circle-radius": [
        "case",
        ["boolean", ["feature-state", "hover"], true],
        ["interpolate", ["linear"], ["get", "species_count"], min, 10, max, 30],
        0,
      ],
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

  // set click info when clicking over map. useCallback memoizes function so it isn't recalled every time user clicks over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onClick = useCallback(
    (event) => {
      const region = event.features && event.features[0];

      if (region) {
        if (region?.layer.id == "eco-stats-bubble") {
          const properties = region.properties;
          setDisplay({
            name: properties.name,
            unique_id: properties.unique_id,
            species_count: properties.species_count,
            rank: properties.rank,
          });

          if (properties.unique_id !== "<NA>") {
            setClickInfo({
              regionNum: region && region.properties.unique_id,
            });
          }
        }
        if (region?.layer.id == "eco-fill") {
          const properties = region.properties;

          if (
            data &&
            data.features.some(
              (ecoregion) => ecoregion.properties.name == properties.name
            )
          ) {
            const found = data.features.find(
              (ecoregion) => ecoregion.properties.name == properties.name
            );

            setDisplay({
              name: properties.name,
              unique_id: properties.unique_id,
              species_count: found.properties.species_count,
              rank: found.properties.rank,
            });

            if (properties.unique_id !== "<NA>") {
              setClickInfo({
                regionNum: region && region.properties.unique_id,
              });
            }
          }
        }
      }
    },
    [hoverInfo, data]
  );

  const selectedRegion = (clickInfo && clickInfo.regionNum) || "";

  // check layer and style expressions in mapbox docs for array setup. useMemo memoizes the return value of a function(useCallback memoizes the function not the return value) so the return value can be reused between re-renders. Function is re-ran when value of selectedRegion changes.
  const clickFilter = useMemo(
    () => ["in", "unique_id", selectedRegion],
    [selectedRegion]
  );

  const selectedHover = (hoverInfo && hoverInfo.species_count) || "";

  const hoverFilter = useMemo(
    () => ["in", "species_count", selectedHover],
    [selectedHover]
  );

  const onHover = useCallback(
    (event) => {
      const region = event.features && event.features[0];

      if (region) {
        if (region?.layer.id == "eco-stats-bubble") {
          setHoverInfo({
            species_count: region && region.properties.species_count,
          });
        }
      }
    },
    [hoverInfo]
  );

  return (
    <>
      {display && (
        <div
          style={{
            position: "absolute",
            maxWidth: "320px",
            background: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            padding: "12px 12px",
            margin: "20px",
            fontSize: "13px",
            lineHeight: "2",
            color: "#6b6b76",
            textTransform: "uppercase",
            outline: "none",
            zIndex: 1,
          }}
        >
          <Typography sx={{ wordBreak: "break-word" }}>
            <b>eco-{display.unique_id}</b>: {display.name}
          </Typography>
          <Typography>
            <b>rank</b>: {display.rank}
          </Typography>
          <Typography>
            <b>species count</b>: {display.species_count}
          </Typography>
        </div>
      )}

      <Map
        reuseMaps
        ref={mapRef}
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
        interactiveLayerIds={["eco-fill", "eco-stats-bubble"]}
        onClick={onClick}
        onMouseMove={onHover}
        attributionControl={false}
      >
        <Source id="eco-map" type="vector" url="mapbox://sl354207.ecomap-tiles">
          <Layer id="base" beforeId="waterway-label" {...ecoFill} />

          <Layer
            id="click"
            beforeId="waterway-label"
            {...ecoFill1}
            filter={clickFilter}
          />

          <Layer beforeId="waterway-label" {...ecoLine} />
        </Source>
        {data && (
          <Source
            id="eco-stats"
            type="geojson"
            data={data && data}
            tolerance={0}
          >
            <Layer
              id="eco-stats-bubble"
              beforeId="waterway-label"
              {...ecoStatsBubble}
            />

            <Layer
              id="eco-stats-hover"
              beforeId="waterway-label"
              {...ecoStatsHover}
              filter={hoverFilter}
            />

            <Layer
              id="eco-stats-text"
              beforeId="waterway-label"
              {...ecoStatsText}
            />
          </Source>
        )}
        <AttributionControl
          compact={true}
          customAttribution="Ecoregion Citations: Olson, D. M., Dinerstein, E., Wikramanayake, E. D., Burgess, N. D., Powell, G. V. N., Underwood, E. C., D'Amico, J. A., Itoua, I., Strand, H. E., Morrison, J. C., Loucks, C. J., Allnutt, T. F., Ricketts, T. H., Kura, Y., Lamoreux, J. F., Wettengel, W. W., Hedao, P., Kassem, K. R. 2001. Terrestrial ecoregions of the world: a new map of life on Earth. Bioscience 51(11):933-938. The Nature Conservancy (2012). Marine Ecoregions and Pelagic Provinces of the
            World. GIS layers developed by The Nature Conservancy with multiple partners,
            combined from Spalding et al. (2007) and Spalding et al. (2012). Cambridge (UK):
            The Nature Conservancy. DOIs: 10.1641/B570707;
            10.1016/j.ocecoaman.2011.12.016. Data URL: http://data.unep-
            wcmc.org/datasets/38"
          style={{ color: "black" }}
        />

        {isLoading && (
          <CircularProgress
            color="secondary"
            size={100}
            disableShrink={true}
            sx={{
              margin: "200px auto",
              display: "flex",
              justifySelf: "center",

              zIndex: 1,
            }}
          />
        )}
      </Map>
    </>
  );
};

export default MapStats;
