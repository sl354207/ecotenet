import EcoSummary from "@components/EcoSummary";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {
  Box,
  Button,
  CircularProgress,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import Map, { AttributionControl, Layer, Popup, Source } from "react-map-gl";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const MapMain = ({ zoom, setEcoFilter }) => {
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;

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

  const [click, setClick] = useState(true);

  const [wiki, setWiki] = useState();

  const drawerBleeding = 56;
  const drawerWidth = 350;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onHover = useCallback(
    async (event) => {
      setShowPopup(true);

      setClick(false);

      if (click) {
        setOpen(true);
      }

      const region = event.features && event.features[0];

      if (region.properties.unique_id != "<NA>") {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && region.properties.name,
          regionNum: region && region.properties.unique_id,
        });
        sessionStorage.setItem(
          "ecoregion",
          region && region.properties.unique_id
        );
        setEcoFilter(region && region.properties.unique_id);
        console.log(region.properties.unique_id);

        const res = await fetch(
          `/api/ecoregions/${region.properties.unique_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(res);

        const data = await res.json();
        switch (data.url) {
          case undefined:
            setWiki(
              `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${data.name.replace(
                " ",
                "_"
              )}?redirect=true`,
              {
                method: "GET",

                "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
              }
            );

            // wiki = await wikiRes.json();

            break;
          case "undefined":
            setWiki(undefined);

            break;

          default:
            setWiki(
              `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${data.url.replace(
                " ",
                "_"
              )}?redirect=true`,
              {
                method: "GET",

                "Api-User-Agent": "ecotenet (sl354207@ohio.edu)",
              }
            );

            // wiki = await wikiRes.json();

            break;
        }
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

  const handleClick = (selectedRegion) => {
    setShowLoad(true);
    router.push(`/ecoregions/${selectedRegion}`);
  };

  const { data: results } = useSWR(wiki ? wiki : null, fetcher);

  return (
    <>
      <div style={{ height: "89vh" }}>
        <Map
          reuseMaps
          style={{ width: "auto", height: "89vh" }}
          initialViewState={{
            latitude: 37.8,
            longitude: -98,
            zoom: zoom,
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
          attributionControl={false}
        >
          {/* <Geocoder
            mapboxAccessToken={mapBox}
            position="top-left"
            placeholder="Search Location"
            clearAndBlurOnEsc
            clearOnBlur
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
              <div style={{ display: "grid" }}>
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
                      onClick={() => handleClick(selectedRegion)}
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
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        hideBackdrop
        variant="persistent"
        sx={{
          "&.MuiDrawer-root > .MuiPaper-root": {
            // height: `calc(50% - ${drawerBleeding}px)`,
            width: drawerWidth,
            overflow: "visible",
            top: 60,
            // bottom: 100,
          },
          width: drawerWidth,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            // top: drawerBleeding,
            borderBottomLeftRadius: 8,
            borderTopLeftRadius: 8,
            visibility: "visible",
            right: drawerWidth,
            // left: 0,
            backgroundColor: "#f5f5dc",
          }}
        >
          {/* <Puller /> */}
          <Box
            sx={{
              width: 6,
              height: 30,
              backgroundColor: "#000000",
              borderRadius: 3,
              position: "relative",
              top: "25px",
              // left: "calc(50% - 15px)",
            }}
          />
          <Button
            color="primary"
            onClick={toggleDrawer(!open)}
            sx={{
              marginBottom: 3,
              transform: "rotate(-90deg)",
              mr: "-10px",
            }}
          >
            Summary
          </Button>
        </Box>
        <Box
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
            backgroundColor: "#808080",
          }}
        >
          {/* <Skeleton variant="rectangular" height="100%" /> */}

          <EcoSummary
            wiki={wiki}
            results={results && results}
            ecoName={ecoName && ecoName}
            id={selectedRegion && selectedRegion}
          />
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default MapMain;
