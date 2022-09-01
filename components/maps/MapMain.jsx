// import Coords from "@data/eco_coord.json";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Button, CircularProgress, Typography } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { AttributionControl, Layer, Popup, Source } from "react-map-gl";

// const fetcher = (url) => fetch(url).then((r) => r.json());

const MapMain = ({
  zoom,
  setEcoFilter,
  setWiki,
  setEcoName,
  setEcoId,
  click,
  setClick,
  setOpenSummary,
  state,
  ecoMove,
  coords,
  hoverInfo,
  setHoverInfo,
}) => {
  const router = useRouter();
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;

  //  base layer
  // const ecoFill = {
  //   id: "eco-fill",
  //   type: "fill",
  //   // source: "eco-data",
  //   "source-layer": "ecomap-tiles",
  //   paint: {
  //     "fill-outline-color": "rgba(0,0,0,1)",
  //     "fill-color": "#627BC1",
  //     "fill-opacity": 0,
  //   },
  // };

  // // hover layer
  // const ecoFill1 = {
  //   id: "eco-fill1",
  //   type: "fill",
  //   // source: "eco-fill",
  //   "source-layer": "ecomap-tiles",
  //   paint: {
  //     "fill-outline-color": "rgba(0,0,0,1)",
  //     // "fill-color": "#627BC1",
  //     "fill-color": "#94c9ff",
  //     "fill-opacity": 0.5,
  //   },
  // };

  // // outline layer
  // const ecoLine = {
  //   id: "eco-line",
  //   type: "line",
  //   // source: "eco-fill",
  //   "source-layer": "ecomap-tiles",
  //   layout: {},
  //   paint: {
  //     "line-color": [
  //       "case",
  //       ["==", ["get", "TYPE"], "TEOW"],
  //       "rgb(5, 11, 15)",
  //       "rgb(62, 136, 185)",
  //     ],
  //     "line-width": ["case", ["==", ["get", "TYPE"], "TEOW"], 2, 1],
  //   },
  // };

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

  // const { data: ecoregions } = useSWR("/api/ecoregions", fetcher);
  // console.log(ecoregions);

  // const [hoverInfo, setHoverInfo] = useState(null);

  const [showPopup, setShowPopup] = useState(true);

  const [showLoad, setShowLoad] = useState(false);

  // const [click, setClick] = useState(true);

  // const [wiki, setWiki] = useState();

  // const drawerBleeding = 56;
  // const drawerWidth = 350;
  // const [openSummary, setOpenSummary] = useState(false);
  // const [openEco, setOpenEco] = useState(true);

  // const toggleDrawerSummary = (newOpen) => () => {
  //   setOpenSummary(newOpen);
  // };

  // const toggleDrawerEco = (newOpen) => () => {
  //   setOpenEco(newOpen);
  // };

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  const onHover = useCallback(
    async (event) => {
      setShowPopup(true);

      setClick(false);

      if (click) {
        setOpenSummary(true);
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
        setEcoName(region && region.properties.name);
        setEcoId(region && region.properties.unique_id);
        // console.log(region.properties.unique_id);

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

  // const ecoClick = useCallback(() => {
  //   setShowPopup(true);
  //   const coord = Coords.filter((region) => region.unique_id == ecoMove);

  //   // setClick(false);

  //   // if (click) {
  //   //   setOpenSummary(true);
  //   // }

  //   // const region = event.features && event.features[0];

  //   // if (region.properties.unique_id != "<NA>") {
  //   setHoverInfo({
  //     longitude: coord[0].coordinates[0],
  //     latitude: coord[0].coordinates[1],
  //     regionName: ecoMove.name,
  //     regionNum: ecoMove.id,
  //   });

  //   mapRef.current?.flyTo({
  //     center: coord[0].coordinates,
  //     duration: 2000,
  //     zoom: 3.5,
  //   });
  //   // console.log(region.properties.unique_id);
  // }, [ecoMove]);

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

  // const clickedRegions = clickInfo;

  const clickFilter = ["in", "unique_id", []];

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
        const coord = coords.filter(
          (region) => region.unique_id == speciesRegions1[0]
        );

        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
      if (speciesRegions2.length > 0 && prevCount2 !== speciesRegions2) {
        const coord = coords.filter(
          (region) => region.unique_id == speciesRegions2[0]
        );

        mapRef.current?.flyTo({
          center: coord[0].coordinates,
          duration: 2000,
          zoom: 3.5,
        });
      }
      if (speciesRegions3.length > 0 && prevCount3 !== speciesRegions3) {
        const coord = coords.filter(
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

  // const { data: results } = useSWR(wiki ? wiki : null, fetcher);

  return (
    <>
      <div style={{ height: "89vh" }}>
        <Map
          id="mapA"
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
          ref={mapRef}
          onSourceData={onMove(prevCount1, prevCount2, prevCount3)}
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
            {/* <Layer beforeId="waterway-label" {...ecoLine} />
            <Layer beforeId="waterway-label" {...ecoFill} />
            <Layer beforeId="waterway-label" {...ecoFill1} filter={filter} /> */}
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
      {/* <SwipeableDrawer
        anchor="right"
        open={openEco}
        onClose={toggleDrawerEco(false)}
        onOpen={toggleDrawerEco(true)}
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
            // top: 100,
            borderBottomLeftRadius: 8,
            borderTopLeftRadius: 8,
            visibility: "visible",
            right: drawerWidth,
            // left: 0,
            backgroundColor: "#f5f5dc",
          }}
        >
         
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
            onClick={toggleDrawerEco(!openEco)}
            sx={{
              marginBottom: 5,
              transform: "rotate(-90deg)",
              mr: "-25px",
            }}
          >
            ecoregions
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
          
          {ecoregions && <EcoRegions ecoregions={ecoregions && ecoregions} ecoClick={ecoClick}/>}
        </Box>
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor="right"
        open={openSummary}
        onClose={toggleDrawerSummary(false)}
        onOpen={toggleDrawerSummary(true)}
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
            top: 120,
            borderBottomLeftRadius: 8,
            borderTopLeftRadius: 8,
            visibility: "visible",
            right: drawerWidth,
            // left: 0,
            backgroundColor: "#f5f5dc",
          }}
        >
          
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
            onClick={toggleDrawerSummary(!openSummary)}
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
          

          <EcoSummary
            wiki={wiki}
            results={results && results}
            ecoName={ecoName && ecoName}
            id={selectedRegion && selectedRegion}
          />
        </Box>
      </SwipeableDrawer> */}
    </>
  );
};

export default MapMain;
