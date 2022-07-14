import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Button, CircularProgress, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import Map, { AttributionControl, Layer, Popup, Source } from "react-map-gl";
import Geocoder from "./Geocoder";

const useStyles = makeStyles(() => ({
  popup: {
    display: "grid",
  },
}));

const MapMain = () => {
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;
  const classes = useStyles();

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
      // "fill-color": "#627BC1",
      "fill-color": "#94c9ff",
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

  // turn ecoregion name into proper slug
  const slugify = (text) =>
    text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "_");

  const handleClick = (ecoName, selectedRegion) => {
    const slug = slugify(ecoName);
    setShowLoad(true);
    router.push(`/ecoregion/${slug}?id=${selectedRegion}`);
  };

  return (
    <>
      <div style={{ height: "91vh" }}>
        <Map
          style={{ width: "auto", height: "91vh" }}
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
          attributionControl={false}
        >
          <Geocoder
            mapboxAccessToken={mapBox}
            position="top-left"
            placeholder="Search Map"
            clearAndBlurOnEsc
            clearOnBlur
          />
          <Source
            id="ecomap"
            type="vector"
            url="mapbox://sl354207.ecomap-tiles"
          >
            <Layer beforeId="waterway-label" {...ecoLine} />
            <Layer beforeId="waterway-label" {...ecoFill} />
            <Layer beforeId="waterway-label" {...ecoFill1} filter={filter} />
          </Source>
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
                      onClick={() => handleClick(ecoName, selectedRegion)}
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

export default MapMain;
