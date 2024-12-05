import LayersIcon from "@mui/icons-material/Layers";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popper,
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
  layer,
  setLayer,
}) => {
  const mapBox = process.env.NEXT_PUBLIC_MAPBOX;
  useEffect(() => {
    setMapLoc(true);
  }, []);

  const [viewState, setViewState] = useState({
    latitude: 37.8,
    longitude: -98,
    zoom: 3,
  });

  // set hover info when hovering over map. useCallback memoizes function so it isn't recalled every time user hovers over new point and state changes causing re-render. This reduces reloading of map data(which is a lot). Second argument is used to determine on what variable change you want function to re-render on(in this case none). useCallback returns function
  // console.log(visitedHome);
  const onEcoClick = useCallback(
    async (event) => {
      // console.log(event.features);
      setShowPopup(true);

      if (!visitedHome && !click) {
        setTab({ id: 1, label: "Summary" });
      }

      const region = event.features && event.features[0];
      // console.log(region);

      if (region && region.properties.unique_id !== "<NA>") {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && region.properties.name,
          regionNum: region && region.properties.unique_id,
        });

        let eco = region.properties;
        eco.layer = "ecoregions";
        eco._id = region.properties.unique_id;

        if (region.geometry.coordinates[0][0][0].length > 1) {
          eco.coordinates = region.geometry.coordinates[0][0][0];
        } else {
          eco.coordinates = region.geometry.coordinates[0][0];
        }

        sessionStorage.setItem("ecoregion", JSON.stringify(eco));
        setEcoFilter(eco);

        const res = await fetch(
          `/api/ecoregions/${region.properties.unique_id}?layer=ecoregions`,
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
  const onFeowClick = useCallback(
    async (event) => {
      setShowPopup(true);

      if (!visitedHome && !click) {
        setTab({ id: 1, label: "Summary" });
      }

      const region = event.features && event.features[0];
      // console.log(region);

      if (region) {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && region.properties.name,
          regionNum: region && region.properties.id,
        });

        let eco = region.properties;
        eco.layer = "feow";
        eco._id = region.properties.id;

        if (region.geometry.coordinates[0][0][0].length > 1) {
          eco.coordinates = region.geometry.coordinates[0][0][0];
        } else {
          eco.coordinates = region.geometry.coordinates[0][0];
        }

        sessionStorage.setItem("ecoregion", JSON.stringify(eco));
        setEcoFilter(eco);

        setClick(true);
      }
    },
    [hoverInfo]
  );
  const onDsmwClick = useCallback(
    async (event) => {
      setShowPopup(true);

      if (!visitedHome && !click) {
        setTab({ id: 1, label: "Summary" });
      }

      const region = event.features && event.features[0];
      console.log(region);

      if (
        region &&
        region.properties.specific_soil_name !== "Inland water or ocean" &&
        region &&
        region.properties.specific_soil_name !== "No data"
      ) {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          regionName: region && {
            "FAO soil id": region.properties.FAOSOIL,
            "dominant soil type": region.properties.dominant_soil_name,
            "dominant soil type percentage":
              region.properties.dominant_soil_type_percentage,
            "soil texture": region.properties.soil_texture,
            "soil slope": region.properties.soil_slope,
          },
          regionNum: region && region.properties.specific_soil_name,
        });

        let eco = region.properties;
        eco.layer = "dsmw";
        eco._id = region.properties.specific_soil_name;

        if (region.geometry.coordinates[0][0][0].length > 1) {
          eco.coordinates = region.geometry.coordinates[0][0][0];
        } else {
          eco.coordinates = region.geometry.coordinates[0][0];
        }

        sessionStorage.setItem("ecoregion", JSON.stringify(eco));
        setEcoFilter(eco);

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

  const speciesSoil = [
    { id: "15783", count: 1 },
    { id: "15277", count: 2 },
    { id: "14552", count: 3 },
    { id: "16799", count: 4 },
    { id: "15955", count: 5 },
    { id: "17114", count: 6 },
    { id: "16452", count: 7 },
    { id: "15820", count: 8 },
    { id: "15834", count: 9 },
    { id: "16420", count: 10 },
  ];

  useEffect(() => {
    if (layer) {
      // console.log(layer);
      if (layer === "dsmw" && speciesSoil) {
        // console.log(speciesSoil);
        // const features = mapRef.current?.queryRenderedFeatures({
        //   layers: ["dsmw-fill"],
        // });
        // console.log(features);
        speciesSoil.forEach((datum) => {
          mapRef.current?.setFeatureState(
            {
              source: "dsmwmap",
              sourceLayer: "dsmw-tiles",
              id: datum.id,
            },
            {
              count: datum.count,
            }
          );
        });
      }
    }
  }, [layer]);

  // const soilFilter equals list if ids in speciesSoil

  const soilFilter = ["in", "id", ...speciesSoil.map((s) => s.id)];
  // console.log(soilFilter);

  const selectedRegion = (hoverInfo && hoverInfo.regionNum) || "";

  const ecoName = (hoverInfo && hoverInfo.regionName) || "";

  // check layer and style expressions in mapbox docs for array setup. useMemo memoizes the return value of a function(useCallback memoizes the function not the return value) so the return value can be reused between re-renders. Function is re-ran when value of selectedRegion changes.
  const ecoClickFilter = useMemo(
    () => ["in", "unique_id", selectedRegion],
    [selectedRegion]
  );

  const speciesRegions1 =
    ecoChips[0] && layer === "feow"
      ? ecoChips[0] && ecoChips[0].freshwater_ecoregions
        ? ecoChips[0].freshwater_ecoregions
        : []
      : ecoChips[0] &&
        ecoChips[0].observed_ecoregions &&
        ecoChips[0].native === false
      ? ecoChips[0] && ecoChips[0].observed_ecoregions
      : ecoChips[0] && ecoChips[0].native_ecoregions;

  const speciesFilter1 =
    ecoChips[0] && layer === "feow"
      ? ["in", "id", ...speciesRegions1]
      : ecoChips[0]
      ? ["in", "unique_id", ...speciesRegions1]
      : ["in", "unique_id"];

  const speciesRegions2 =
    ecoChips[1] && layer === "feow"
      ? ecoChips[1] && ecoChips[1].freshwater_ecoregions
        ? ecoChips[1].freshwater_ecoregions
        : []
      : ecoChips[1] &&
        ecoChips[1].observed_ecoregions &&
        ecoChips[1].native === false
      ? ecoChips[1] && ecoChips[1].observed_ecoregions
      : ecoChips[1] && ecoChips[1].native_ecoregions;

  const speciesFilter2 =
    ecoChips[1] && layer === "feow"
      ? ["in", "id", ...speciesRegions2]
      : ecoChips[1]
      ? ["in", "unique_id", ...speciesRegions2]
      : ["in", "unique_id"];

  const speciesRegions3 =
    ecoChips[2] && layer === "feow"
      ? ecoChips[2] && ecoChips[2].freshwater_ecoregions
        ? ecoChips[2].freshwater_ecoregions
        : []
      : ecoChips[2] &&
        ecoChips[2].observed_ecoregions &&
        ecoChips[2].native === false
      ? ecoChips[2] && ecoChips[2].observed_ecoregions
      : ecoChips[2] && ecoChips[2].native_ecoregions;

  const speciesFilter3 =
    ecoChips[2] && layer === "feow"
      ? ["in", "id", ...speciesRegions3]
      : ecoChips[2]
      ? ["in", "unique_id", ...speciesRegions3]
      : ["in", "unique_id"];

  const feowClickFilter = useMemo(
    () => ["in", "id", selectedRegion],
    [selectedRegion]
  );

  const dsmwClickFilter = useMemo(
    () => ["in", "specific_soil_name", selectedRegion],
    [selectedRegion]
  );

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
      // console.log(speciesRegions1);
      if (
        speciesRegions1 &&
        speciesRegions1.length > 0 &&
        prevCount1 !== speciesRegions1
      ) {
        const coord = coords.filter((region) => {
          if (layer === "feow") {
            return region.id === speciesRegions1[0];
          } else {
            return region.unique_id === speciesRegions1[0];
          }
        });
        // console.log(coord);
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
        const coord = coords.filter((region) => {
          if (layer === "feow") {
            return region.id === speciesRegions2[0];
          } else {
            return region.unique_id === speciesRegions2[0];
          }
        });

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
        const coord = coords.filter((region) => {
          if (layer === "feow") {
            return region.id === speciesRegions3[0];
          } else {
            return region.unique_id === speciesRegions3[0];
          }
        });

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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLayerClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleLayerChange = (event) => {
    setLayer(event.target.value);
    setShowPopup(false);
  };

  return (
    <>
      <IconButton
        sx={{
          position: "absolute",
          top: "80px",
          left: "10px",
          zIndex: 1,
          border: "2px solid #94c9ff",
        }}
        onClick={(event) => handleLayerClick(event)}
        color="inherit"
        aria-label="layer"
      >
        <LayersIcon />
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box
          sx={{
            border: "2px solid #94c9ff",
            borderRadius: "10px",
            p: 1,
            bgcolor: "background.paper",
          }}
        >
          <FormControl component="fieldset">
            <Typography component="legend" align="center">
              Layer
            </Typography>
            <RadioGroup
              aria-label="layer-toggle"
              name="layer-toggle"
              value={layer}
              onChange={handleLayerChange}
            >
              <FormControlLabel
                value="ecoregions"
                control={
                  <Radio
                    color="secondary"
                    sx={{
                      color: `${theme.palette.secondary.main}!important`,
                    }}
                  />
                }
                label="Ecoregions"
              />
              <FormControlLabel
                value="feow"
                control={
                  <Radio
                    color="secondary"
                    sx={{
                      color: `${theme.palette.secondary.main}!important`,
                    }}
                  />
                }
                label="Freshwater"
              />
              <FormControlLabel
                value="dsmw"
                control={
                  <Radio
                    color="secondary"
                    sx={{
                      color: `${theme.palette.secondary.main}!important`,
                    }}
                  />
                }
                label="Soil"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Popper>
      {layer === "ecoregions" && (
        <FormControl
          component="fieldset"
          sx={{
            position: "absolute",
            bottom: { xs: "inherit", md: "10px" },
            top: { xs: "80px", md: "inherit" },
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
      )}
      {layer === "dsmw" && speciesSoil && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "inherit", md: "10px" },
            top: { xs: "80px", md: "inherit" },
            right: 0,
            zIndex: 1,
            backgroundColor: "#001e3c",
            borderRadius: "3px",
            border: "3px solid #c8fcff",
            padding: "10px",
          }}
        >
          <Typography variant="body1" align="center">
            test
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Box
                sx={{
                  backgroundColor: "#FDE725",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#B8DE29",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#73D055",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#3CBB75",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#20A387",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#287D8E",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#33638D",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#404788",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#482677",
                  padding: "10px",
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#440154",
                  padding: "10px",
                }}
              ></Box>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                100
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                90
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                80
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                70
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                60
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                50
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                40
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                30
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                20
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "4px" }}>
                10
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

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
        interactiveLayerIds={["eco-fill", "feow-fill", "dsmw-fill"]}
        onClick={
          layer === "ecoregions"
            ? onEcoClick
            : layer === "feow"
            ? onFeowClick
            : onDsmwClick
        }
        ref={mapRef}
        onSourceData={onMove(prevCount1, prevCount2, prevCount3)}
        onMove={(evt) => setViewState(evt.viewState)}
        attributionControl={false}
      >
        {layer === "ecoregions" ? (
          <>
            <Source
              id="ecomap"
              key="ecomap"
              type="vector"
              url="mapbox://sl354207.ecomap-tiles"
            >
              <Layer
                id="ecobase"
                key="ecobase"
                beforeId="waterway-label"
                {...ecoFill}
              />

              <Layer
                id="ecospecies3"
                key="ecospecies3"
                beforeId="waterway-label"
                {...ecoFill5}
                filter={speciesFilter3}
              />
              <Layer
                id="ecospecies2"
                key="ecospecies2"
                beforeId="waterway-label"
                {...ecoFill4}
                filter={speciesFilter2}
              />
              <Layer
                id="ecospecies1"
                key="ecospecies1"
                beforeId="waterway-label"
                {...ecoFill3}
                filter={speciesFilter1}
              />

              <Layer
                id="ecoclick"
                key="ecoclick"
                beforeId="waterway-label"
                {...ecoFill1}
                filter={ecoClickFilter}
              />
              <Layer
                beforeId="waterway-label"
                id="ecoline"
                key="ecoline"
                {...ecoLine}
              />
            </Source>
          </>
        ) : (
          <>
            {layer === "feow" ? (
              <>
                <Source
                  id="feowmap"
                  key="feowmap"
                  type="vector"
                  url="mapbox://sl354207.feow-tiles"
                >
                  <Layer
                    id="feowbase"
                    key="feowbase"
                    beforeId="waterway-label"
                    {...feowFill}
                  />

                  <Layer
                    id="feowspecies3"
                    key="feowspecies3"
                    beforeId="waterway-label"
                    {...feowFill5}
                    filter={speciesFilter3}
                  />
                  <Layer
                    id="feowspecies2"
                    key="feowspecies2"
                    beforeId="waterway-label"
                    {...feowFill4}
                    filter={speciesFilter2}
                  />
                  <Layer
                    id="feowspecies1"
                    key="feowspecies1"
                    beforeId="waterway-label"
                    {...feowFill3}
                    filter={speciesFilter1}
                  />

                  <Layer
                    id="feowclick"
                    key="feowclick"
                    beforeId="waterway-label"
                    {...feowFill1}
                    filter={feowClickFilter}
                  />
                  <Layer
                    beforeId="waterway-label"
                    id="feoline"
                    key="feoline"
                    {...feowLine}
                  />
                </Source>
              </>
            ) : (
              <>
                <Source
                  id="dsmwmap"
                  key="dsmwmap"
                  type="vector"
                  url="mapbox://sl354207.dsmw-tiles"
                  promoteId={"id"}
                >
                  <Layer
                    id="dsmwbase"
                    key="dsmwbase"
                    beforeId="waterway-label"
                    {...dsmwFill}
                  />

                  <Layer
                    id="dsmwclick"
                    key="dsmwclick"
                    beforeId="waterway-label"
                    {...dsmwFill1}
                    filter={dsmwClickFilter}
                  />
                  <Layer
                    beforeId="waterway-label"
                    id="dsmwline"
                    key="dsmwline"
                    {...dsmwLine}
                  />
                  {speciesSoil && (
                    <Layer
                      id="dsmwspecies1"
                      key="dsmwspecies1"
                      beforeId="waterway-label"
                      {...dsmwFill3}
                      filter={soilFilter}
                    />
                  )}
                </Source>
              </>
            )}
          </>
        )}

        <AttributionControl
          compact={true}
          position="bottom-left"
          customAttribution="Ecoregion Citations: Olson, D. M., Dinerstein, E., Wikramanayake, E. D., Burgess, N. D., Powell, G. V. N., Underwood, E. C., D'Amico, J. A., Itoua, I., Strand, H. E., Morrison, J. C., Loucks, C. J., Allnutt, T. F., Ricketts, T. H., Kura, Y., Lamoreux, J. F., Wettengel, W. W., Hedao, P., Kassem, K. R. 2001. Terrestrial ecoregions of the world: a new map of life on Earth. Bioscience 51(11):933-938. The Nature Conservancy (2012). Marine Ecoregions and Pelagic Provinces of the World. GIS layers developed by The Nature Conservancy with multiple partners, combined from Spalding et al. (2007) and Spalding et al. (2012). Cambridge (UK): The Nature Conservancy. DOIs: 10.1641/B570707;10.1016/j.ocecoaman.2011.12.016. Data URL: http://data.unep-wcmc.org/datasets/38. Freshwater Ecoregions Citation: Originator: The Nature Conservancy and World Wildlife Fund, Inc. Publication_Date:  2008 Title: Freshwater Ecoregions of the World Geospatial_Data_Presentation_Form: vector digital data Online_Linkage: www.feow.org"
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
                sx={{
                  fontWeight: 500,
                  minWidth: "150px",
                  marginTop: layer === "dsmw" ? "10px" : "0px",
                }}
              >
                {layer === "ecoregions"
                  ? `Eco - ${selectedRegion}`
                  : layer === "feow"
                  ? `FEOW - ${selectedRegion}`
                  : selectedRegion}
              </Typography>
              {layer === "dsmw" ? (
                <>
                  <List dense disablePadding>
                    {ecoName &&
                      Object.keys(ecoName).map((key, index) => (
                        <ListItem
                          key={index}
                          dense
                          disablePadding
                          disableGutters
                        >
                          <ListItemText
                            primary={`${key}: ${ecoName[key]}`}
                            sx={{ color: "black" }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </>
              ) : (
                <Typography
                  color="textSecondary"
                  align="center"
                  sx={{ fontWeight: 500 }}
                >
                  {ecoName}
                </Typography>
              )}
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

const ecoFill = {
  id: "eco-fill",
  type: "fill",
  "source-layer": "ecomap-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#627BC1",
    "fill-opacity": 0,
  },
};
// ecoclick layer
const ecoFill1 = {
  id: "eco-fill1",
  type: "fill",
  "source-layer": "ecomap-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#94c9ff",
    "fill-opacity": 0.5,
  },
};

// selected layer 1
const ecoFill3 = {
  id: "eco-fill3",
  type: "fill",
  "source-layer": "ecomap-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#ff00ff",
    "fill-opacity": 0.4,
  },
};
// selected layer 2
const ecoFill4 = {
  id: "eco-fill4",
  type: "fill",
  "source-layer": "ecomap-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#ffff00",
    "fill-opacity": 0.6,
  },
};
// selected layer 3
const ecoFill5 = {
  id: "eco-fill5",
  type: "fill",
  "source-layer": "ecomap-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#00ffff",
    "fill-opacity": 0.8,
  },
};

// outline layer
const ecoLine = {
  id: "eco-line",
  type: "line",
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

const feowFill = {
  id: "feow-fill",
  type: "fill",
  "source-layer": "feow-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#627BC1",
    "fill-opacity": 0,
  },
};

// feowclick layer
const feowFill1 = {
  id: "feow-fill1",
  type: "fill",
  "source-layer": "feow-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#94c9ff",
    "fill-opacity": 0.5,
  },
};
// selected layer 1
const feowFill3 = {
  id: "feow-fill3",
  type: "fill",
  "source-layer": "feow-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#ff00ff",
    "fill-opacity": 0.4,
  },
};
// selected layer 2
const feowFill4 = {
  id: "feow-fill4",
  type: "fill",
  "source-layer": "feow-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#ffff00",
    "fill-opacity": 0.6,
  },
};
// selected layer 3
const feowFill5 = {
  id: "feow-fill5",
  type: "fill",
  "source-layer": "feow-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#00ffff",
    "fill-opacity": 0.8,
  },
};

const feowLine = {
  id: "feow-line",
  type: "line",
  "source-layer": "feow-tiles",
  layout: {},
  paint: {
    "line-color": "rgb(5, 11, 15)",
    "line-width": 2,
  },
};

const dsmwFill = {
  id: "dsmw-fill",
  type: "fill",
  "source-layer": "dsmw-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#627BC1",
    "fill-opacity": 0,
  },
};

// dsmwclick layer
const dsmwFill1 = {
  id: "dsmw-fill1",
  type: "fill",
  "source-layer": "dsmw-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": "#94c9ff",
    "fill-opacity": 0.5,
  },
};

// outline layer
const dsmwLine = {
  id: "dsmw-line",
  type: "line",
  "source-layer": "dsmw-tiles",
  layout: {},
  paint: {
    "line-color": "rgb(5, 11, 15)",
    "line-width": ["step", ["zoom"], 0.5, 3, 1, 5, 2, 8, 3],
  },
};

const dsmwFill3 = {
  id: "dsmw-fill3",
  type: "fill",
  source: "dsmwmap",
  "source-layer": "dsmw-tiles",
  paint: {
    "fill-outline-color": "rgba(0,0,0,1)",
    "fill-color": [
      "case",
      ["==", ["feature-state", "count"], 1],
      "#440154",
      ["==", ["feature-state", "count"], 2],
      "#482677",
      ["==", ["feature-state", "count"], 3],
      "#404788",
      ["==", ["feature-state", "count"], 4],
      "#33638D",
      ["==", ["feature-state", "count"], 5],
      "#287D8E",
      ["==", ["feature-state", "count"], 6],
      "#20A387",
      ["==", ["feature-state", "count"], 7],
      "#3CBB75",
      ["==", ["feature-state", "count"], 8],
      "#73D055",
      ["==", ["feature-state", "count"], 9],
      "#B8DE29",
      ["==", ["feature-state", "count"], 10],
      "#FDE725",
      "red",
    ],

    "fill-opacity": 0.8,
  },
};

// #440154FF 1

// #481567FF 2
// #482677FF 3
// #453781FF 4
// #404788FF 5
// #39568CFF 6
// #33638DFF 7
// #2D708EFF 8
// #287D8EFF 9
// #238A8DFF 10

// #1F968BFF 11
// #20A387FF 12
// #29AF7FFF 13
// #3CBB75FF 14
// #55C667FF 15
// #73D055FF 16
// #95D840FF 17
// #B8DE29FF 18
// #DCE319FF 19

// #FDE725FF 20

// #440154FF 1 1
// #482677FF 3 2
// #404788FF 5 3
// #33638DFF 7 4
// #287D8EFF 9 5
// #20A387FF 12 6
// #3CBB75FF 14 7
// #73D055FF 16 8
// #B8DE29FF 18 9
// #FDE725FF 20 10
// Freedman-Diaconis rule, Sturges’ rule, and Scott’s rule

export default MapMain;
