import { Box, Button, SwipeableDrawer, useMediaQuery } from "@mui/material";
import theme from "@utils/theme";
// import dynamic from "next/dynamic";
import EcoDist from "@components/EcoDist";
import EcoRegions from "@components/EcoRegions";
import EcoSummary from "@components/EcoSummary";
import MapMain from "@components/maps/MapMain";
import Coords from "@data/eco_coord.json";

import { useReducer, useState } from "react";
import { MapProvider } from "react-map-gl";
import useSWR from "swr";

const coords = Coords;

const fetcher = (url) => fetch(url).then((r) => r.json());
const speciesChips = [
  { count: 0 },
  {
    id: 1,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 2,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 3,
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
];

// reducer function used by useReducer hook. Toggles the openList value from true to false in menuItems to open and close the correct dropdowns on the drawer
const reducer = (speciesChips, action) => {
  if (action.type == "remove") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = speciesChips[2].open;
        speciesChips[1].regions = speciesChips[2].regions;
        speciesChips[1].scientific_name = speciesChips[2].scientific_name;
        speciesChips[1].common_name = speciesChips[2].common_name;

        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[0].count -= 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
  if (action.type == "add") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = true;
        speciesChips[1].regions = action.value;
        speciesChips[1].scientific_name = action.s_name;
        speciesChips[1].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = true;
        speciesChips[2].regions = action.value;
        speciesChips[2].scientific_name = action.s_name;
        speciesChips[2].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = true;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
};

export default function MapPage({ setEcoFilter }) {
  // need to dynamically import to work with mapbox
  // const MapMain = dynamic(() => import("@components/maps/MapMain"), {
  //   ssr: false,
  // });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: ecoregions } = useSWR("/api/ecoregions", fetcher);
  // console.log(ecoregions);

  const drawerBleeding = 56;
  const drawerWidth = 350;
  const [openSummary, setOpenSummary] = useState(false);
  const [openEco, setOpenEco] = useState(true);
  const [openDist, setOpenDist] = useState(false);
  const [wiki, setWiki] = useState();
  const [ecoName, setEcoName] = useState();
  const [ecoId, setEcoId] = useState();
  const [ecoMove, setEcoMove] = useState();
  const [click, setClick] = useState(true);
  const [hoverInfo, setHoverInfo] = useState(null);
  const { data: results } = useSWR(wiki ? wiki : null, fetcher);
  // console.log(ecoMove);

  const toggleDrawerSummary = (newOpen) => () => {
    setOpenSummary(newOpen);
  };

  const toggleDrawerEco = (newOpen) => () => {
    setOpenEco(newOpen);
  };

  const toggleDrawerDist = (newOpen) => () => {
    setOpenDist(newOpen);
  };

  const [dist, setDist] = useState([]);

  // const handleChange = async (e) => {
  //   console.log(e);
  //   if (e.target.value) {
  //     const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await res.json();
  //     setDist(data);
  //   }
  // };

  const [state, dispatch] = useReducer(reducer, speciesChips);

  // const handleSubmit = (event, newValue) => {
  //   if (newValue != null) {
  //     const dash = newValue.indexOf("-");
  //     const name = newValue.slice(0, dash - 1);
  //     for (const result of results) {
  //       if (result.scientific_name == name) {
  //         switch (state[0].count) {
  //           case 0:
  //             dispatch({
  //               type: "add",
  //               payload: 1,
  //               value: result.unique_id,
  //               s_name: result.scientific_name,
  //               c_name: result.common_name,
  //             });
  //             break;
  //           case 1:
  //             dispatch({
  //               type: "add",
  //               payload: 2,
  //               value: result.unique_id,
  //               s_name: result.scientific_name,
  //               c_name: result.common_name,
  //             });
  //             break;
  //           case 2:
  //             dispatch({
  //               type: "add",
  //               payload: 3,
  //               value: result.unique_id,
  //               s_name: result.scientific_name,
  //               c_name: result.common_name,
  //             });
  //             break;

  //           default:
  //             throw new Error();
  //         }
  //       }
  //     }

  //     setDist([]);
  //   }
  // };

  // const handleRemoveChip = (id) => {
  //   dispatch({
  //     type: "remove",
  //     payload: id,
  //     value: [],
  //     s_name: "",
  //     c_name: "",
  //   });
  // };

  return (
    <div id="map-main">
      <MapProvider>
        <MapMain
          zoom={isMobile ? 3 : 4}
          setEcoFilter={setEcoFilter}
          wiki={wiki}
          setWiki={setWiki}
          setEcoName={setEcoName}
          setEcoId={setEcoId}
          click={click}
          setClick={setClick}
          setOpenSummary={setOpenSummary}
          state={state}
          coords={coords}
          hoverInfo={hoverInfo}
          setHoverInfo={setHoverInfo}
        />
        <SwipeableDrawer
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
            {ecoregions && (
              <EcoRegions
                ecoregions={ecoregions && ecoregions}
                ecoMove={ecoMove}
                setEcoMove={setEcoMove}
                setEcoFilter={setEcoFilter}
                setHoverInfo={setHoverInfo}
                setWiki={setWiki}
                setEcoName={setEcoName}
                setEcoId={setEcoId}
              />
            )}
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
            {/* <Skeleton variant="rectangular" height="100%" /> */}

            <EcoSummary
              wiki={wiki}
              results={results && results}
              ecoName={ecoName && ecoName}
              ecoId={ecoId && ecoId}
            />
          </Box>
        </SwipeableDrawer>
        <SwipeableDrawer
          anchor="right"
          open={openDist}
          onClose={toggleDrawerDist(false)}
          onOpen={toggleDrawerDist(true)}
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
              top: 220,
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
              onClick={toggleDrawerDist(!openDist)}
              sx={{
                marginBottom: 5,
                transform: "rotate(-90deg)",
                mr: "-35px",
              }}
            >
              Distribution
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
            <EcoDist
              // handleSubmit={handleSubmit}
              // handleRemoveChip={handleRemoveChip}
              dist={dist}
              setDist={setDist}
              state={state}
              dispatch={dispatch}
            />
          </Box>
        </SwipeableDrawer>
      </MapProvider>
    </div>
  );
}
