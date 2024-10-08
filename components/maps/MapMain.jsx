import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import theme from "@utils/theme";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { AttributionControl, Layer, Popup, Source } from "react-map-gl";

const MapMain = ({
  isMobile,
  ecoFilter,
  setEcoFilter,
  setWiki,
  click,
  setClick,
  ecoChips,
  setEcoChips,
  coords,
  hoverInfo,
  setHoverInfo,
  showPopup,
  setShowPopup,
  visitedHome,
  setTab,
  mapLoc,
  setMapLoc,
  nativeToggleValue,
  setNativeToggleValue,
}) => {
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;
  useEffect(() => {
    setMapLoc(true);
  }, []);

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

  const [viewState, setViewState] = useState({
    latitude: 37.8,
    longitude: -98,
    zoom: 3,
  });

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  // console.log(visitedHome);
  const onHover = useCallback(
    async (event) => {
      setShowPopup(true);

      if (!visitedHome && !click) {
        setTab({ id: 1, label: "Summary" });
      }

      const region = event.features && event.features[0];

      if (region.properties.unique_id !== "<NA>") {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && region.properties.name,
          regionNum: region && region.properties.unique_id,
        });

        let eco = region.properties;

        if (region.geometry.coordinates[0][0][0].length > 1) {
          eco.coordinates = region.geometry.coordinates[0][0][0];
        } else {
          eco.coordinates = region.geometry.coordinates[0][0];
        }

        sessionStorage.setItem("ecoregion", JSON.stringify(eco));
        setEcoFilter(eco);

        const res = await fetch(
          `/api/ecoregions/${region.properties.unique_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        setWiki(data);
        setClick(true);
      }
    },
    [hoverInfo]
  );

  useEffect(() => {
    if (ecoFilter && !click) {
      setViewState({
        longitude: ecoFilter.coordinates[0],
        latitude: ecoFilter.coordinates[1],
      });
    }
  }, [mapLoc]);

  const selectedRegion = (hoverInfo && hoverInfo.regionNum) || "";

  const ecoName = (hoverInfo && hoverInfo.regionName) || "";

  // check layer and style expressions in mapbox docs for array setup. useMemo memoizes the return value of a function(useCallback memoizes the function not the return value) so the return value can be reused between re-renders. Function is re-ran when value of selectedRegion changes.
  const filter = useMemo(
    () => ["in", "unique_id", selectedRegion],
    [selectedRegion]
  );

  const speciesRegions1 =
    ecoChips[0] &&
    ecoChips[0].observed_ecoregions &&
    ecoChips[0].native === false
      ? ecoChips[0] && ecoChips[0].observed_ecoregions
      : ecoChips[0] && ecoChips[0].native_ecoregions;

  const speciesFilter1 = ecoChips[0]
    ? ["in", "unique_id", ...speciesRegions1]
    : ["in", "unique_id"];

  const speciesRegions2 =
    ecoChips[1] &&
    ecoChips[1].observed_ecoregions &&
    ecoChips[1].native === false
      ? ecoChips[1] && ecoChips[1].observed_ecoregions
      : ecoChips[1] && ecoChips[1].native_ecoregions;

  const speciesFilter2 = ecoChips[1]
    ? ["in", "unique_id", ...speciesRegions2]
    : ["in", "unique_id"];

  const speciesRegions3 =
    ecoChips[2] &&
    ecoChips[2].observed_ecoregions &&
    ecoChips[2].native === false
      ? ecoChips[2] && ecoChips[2].observed_ecoregions
      : ecoChips[2] && ecoChips[2].native_ecoregions;

  const speciesFilter3 = ecoChips[2]
    ? ["in", "unique_id", ...speciesRegions3]
    : ["in", "unique_id"];

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
      if (
        speciesRegions1 &&
        speciesRegions1.length > 0 &&
        prevCount1 !== speciesRegions1
      ) {
        const coord = coords.filter(
          (region) => region.unique_id === speciesRegions1[0]
        );

        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
      if (
        speciesRegions2 &&
        speciesRegions2.length > 0 &&
        prevCount2 !== speciesRegions2
      ) {
        const coord = coords.filter(
          (region) => region.unique_id === speciesRegions2[0]
        );

        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
      if (
        speciesRegions3 &&
        speciesRegions3.length > 0 &&
        prevCount3 !== speciesRegions3
      ) {
        const coord = coords.filter(
          (region) => region.unique_id === speciesRegions3[0]
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

  const handleNativeToggleChange = (event) => {
    const scientificName =
      ecoChips && ecoChips[0] && ecoChips[0].scientific_name;
    if (scientificName) {
      if (event.target.value === "observed") {
        setEcoChips((prevState) =>
          prevState.map((item) =>
            item.scientific_name === scientificName
              ? { ...item, native: false }
              : item
          )
        );

        setNativeToggleValue("observed");
      } else {
        setEcoChips((prevState) =>
          prevState.map((item) =>
            item.scientific_name === scientificName
              ? { ...item, native: true }
              : item
          )
        );
        setNativeToggleValue("native");
      }
    }
  };

  return (
    <>
      <FormControl
        component="fieldset"
        sx={{
          position: "absolute",
          bottom: { xs: "inherit", md: "10px" },
          right: 0,
          zIndex: 1,
          display:
            ecoChips &&
            ecoChips.length === 1 &&
            ecoChips[0].native_ecoregions &&
            ecoChips[0].native_ecoregions.length > 0
              ? "block"
              : "none",
        }}
      >
        <RadioGroup
          aria-label="native-toggle"
          name="native-toggle"
          value={
            (ecoChips &&
              ecoChips[0] &&
              ecoChips[0].native_ecoregions &&
              ecoChips[0].native_ecoregions.length === 0) ||
            (ecoChips && ecoChips[0] && !ecoChips[0].native_ecoregions)
              ? "observed"
              : nativeToggleValue
          }
          onChange={handleNativeToggleChange}
          row
        >
          <FormControlLabel
            value="observed"
            control={
              <Radio
                color="secondary"
                sx={{
                  color: `${theme.palette.secondary.main}!important`,
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  },
                }}
              />
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "900",
                fontSize: "1.4rem",
                "-webkit-text-stroke": "1px black",
              },
            }}
            label="observed"
          />
          <FormControlLabel
            value="native"
            disabled={
              (ecoChips &&
                ecoChips[0] &&
                ecoChips[0].native_ecoregions &&
                ecoChips[0].native_ecoregions.length === 0) ||
              (ecoChips && ecoChips[0] && !ecoChips[0].native_ecoregions)
            }
            control={
              <Radio
                color="secondary"
                sx={{
                  color: `${theme.palette.secondary.main}!important`,
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  },
                }}
              />
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "900",
                fontSize: "1.4rem",
                "-webkit-text-stroke": "1px black",
              },
            }}
            label="native"
          />
        </RadioGroup>
      </FormControl>
      <Map
        id="mapMain"
        reuseMaps
        style={{ width: "auto", height: isMobile ? "85vh" : "90vh" }}
        {...viewState}
        minZoom={1}
        maxZoom={10}
        doubleClickZoom={false}
        boxZoom={false}
        dragRotate={false}
        touchPitch={false}
        mapStyle="mapbox://styles/sl354207/ckph5dyvu1xio17tfsiau4wjs"
        mapboxAccessToken={mapBox}
        interactiveLayerIds={["eco-fill"]}
        onClick={onHover}
        ref={mapRef}
        onSourceData={onMove(prevCount1, prevCount2, prevCount3)}
        onMove={(evt) => setViewState(evt.viewState)}
        attributionControl={false}
      >
        <Source id="ecomap" type="vector" url="mapbox://sl354207.ecomap-tiles">
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
            id="hover"
            beforeId="waterway-label"
            {...ecoFill1}
            filter={filter}
          />
          <Layer beforeId="waterway-label" {...ecoLine} />
        </Source>
        <AttributionControl
          compact={true}
          position="bottom-left"
          customAttribution="Ecoregion Citations: Olson, D. M., Dinerstein, E., Wikramanayake, E. D., Burgess, N. D., Powell, G. V. N., Underwood, E. C., D'Amico, J. A., Itoua, I., Strand, H. E., Morrison, J. C., Loucks, C. J., Allnutt, T. F., Ricketts, T. H., Kura, Y., Lamoreux, J. F., Wettengel, W. W., Hedao, P., Kassem, K. R. 2001. Terrestrial ecoregions of the world: a new map of life on Earth. Bioscience 51(11):933-938. The Nature Conservancy (2012). Marine Ecoregions and Pelagic Provinces of the
            World. GIS layers developed by The Nature Conservancy with multiple partners,
            combined from Spalding et al. (2007) and Spalding et al. (2012). Cambridge (UK):
            The Nature Conservancy. DOIs: 10.1641/B570707;
            10.1016/j.ocecoaman.2011.12.016. Data URL: http://data.unep-
            wcmc.org/datasets/38"
          style={{ color: "black", marginLeft: "100px", marginBottom: "-20px" }}
        />
        {selectedRegion && showPopup && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeOnClick={false}
            maxWidth="500px"
            focusAfterOpen={false}
            closeButton={false}
          >
            <div style={{ display: "grid" }}>
              <Typography
                color="textSecondary"
                align="center"
                sx={{ fontWeight: 500, minWidth: "150px" }}
              >
                Eco-{selectedRegion}
              </Typography>
              <Typography
                color="textSecondary"
                align="center"
                sx={{ fontWeight: 500 }}
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

export default MapMain;
