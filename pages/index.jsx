import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import theme from "@utils/theme";
// import dynamic from "next/dynamic";
import EcoDist from "@components/EcoDist";
import EcoRegions from "@components/EcoRegions";
import EcoSummary from "@components/EcoSummary";
import MapMain from "@components/maps/MapMain";
import Coords from "@data/eco_coord.json";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import { useState } from "react";
import { MapProvider } from "react-map-gl";
import useSWR from "swr";

const coords = Coords;

const fetcher = (url) => fetch(url).then((r) => r.json());

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const CustomTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  marginInline: "0px",
  paddingBlock: "20px",
  paddingInline: "5px",

  "&:hover": {
    color: theme.palette.text.secondary,
    backgroundColor: "rgba(0, 30, 60, 0.3)",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.secondary.dark,
    fontWeight: theme.typography.fontWeightMedium,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));

// test

export default function MapPage({ ecoFilter, setEcoFilter, state, dispatch }) {
  // need to dynamically import to work with mapbox
  // const MapMain = dynamic(() => import("@components/maps/MapMain"), {
  //   ssr: false,
  // });

  const { data: ecoregions } = useSWR("/api/ecoregions", fetcher);
  // console.log(ecoregions);

  const drawerBleeding = 56;
  const drawerWidth = 350;

  const [openEco, setOpenEco] = useState(true);

  const [wiki, setWiki] = useState();

  const [ecoMove, setEcoMove] = useState();
  const [click, setClick] = useState(true);
  const [hoverInfo, setHoverInfo] = useState(null);

  const toggleDrawerEco = (newOpen) => () => {
    setOpenEco(newOpen);
  };

  const [dist, setDist] = useState([]);

  const [tab, setTab] = useState(1);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div id="map-main">
      <MapProvider>
        <MapMain
          zoom={4}
          setEcoFilter={setEcoFilter}
          wiki={wiki}
          setWiki={setWiki}
          click={click}
          setClick={setClick}
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
            <Tabs
              orientation="vertical"
              value={tab}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.secondary.dark,
                  width: "0px",

                  left: 0,
                },
              }}
            >
              <IconButton
                color="primary"
                sx={{
                  borderRadius: 0,
                  justifyContent: "start",
                  paddingLeft: "10px",
                  "&:hover": {
                    borderRadius: 0,
                    backgroundColor: "rgba(0, 30, 60, 0.3)",
                  },
                }}
                {...a11yProps(0)}
                onClick={() => setOpenEco(!openEco)}
              >
                {openEco ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
              </IconButton>
              <CustomTab
                label="Ecoregions"
                {...a11yProps(1)}
                sx={{
                  borderBottom: "2px solid #1890ff",
                  borderTop: "2px solid #1890ff",
                }}
              />
              <CustomTab
                label="Summary"
                {...a11yProps(2)}
                sx={{ borderBottom: "2px solid #1890ff" }}
              />
              <CustomTab
                label="Distributions"
                {...a11yProps(3)}
                sx={{
                  "&.Mui-selected": {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                    fontWeight: theme.typography.fontWeightMedium,
                    borderBottomLeftRadius: 8,
                  },
                }}
              />
            </Tabs>
          </Box>
          <Box
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",

              backgroundColor: theme.palette.primary.light,
            }}
          >
            {ecoregions && (
              <>
                <TabPanel value={tab} index={1}>
                  <EcoRegions
                    ecoregions={ecoregions && ecoregions}
                    ecoMove={ecoMove}
                    setEcoMove={setEcoMove}
                    setEcoFilter={setEcoFilter}
                    setHoverInfo={setHoverInfo}
                    setWiki={setWiki}
                  />
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <EcoSummary
                    wiki={wiki && wiki}
                    setWiki={setWiki}
                    ecoFilter={ecoFilter && ecoFilter}
                  />
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  <EcoDist
                    dist={dist}
                    setDist={setDist}
                    state={state}
                    dispatch={dispatch}
                  />
                </TabPanel>
              </>
            )}
          </Box>
        </SwipeableDrawer>
      </MapProvider>
    </div>
  );
}
