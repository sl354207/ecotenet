import {
  AppBar,
  Box,
  ButtonGroup,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
// import dynamic from "next/dynamic";
import WelcomeDialog from "@components/dialogs/WelcomeDialog";
import EcoDist from "@components/EcoDist";
import EcoRegions from "@components/EcoRegions";
import EcoSummary from "@components/EcoSummary";
import MapMain from "@components/maps/MapMain";
import Coords from "@data/eco_coord.json";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled, useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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
        <Box sx={{ paddingInline: 3 }}>
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

export default function MapPage({
  ecoFilter,
  setEcoFilter,
  state,
  dispatch,
  visited,
  tab,
  setTab,
  setDrawerOpen,
  openEco,
  setOpenEco,
}) {
  // need to dynamically import to work with mapbox
  // const MapMain = dynamic(() => import("@components/maps/MapMain"), {
  //   ssr: false,
  // });
  // console.log(visited);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: ecoregions } = useSWR("/api/ecoregions", fetcher);

  const drawerBleeding = 56;
  const drawerWidth = 350;

  // const [openEco, setOpenEco] = useState(false);

  const [visitedHome, setVisitedHome] = useState(false);

  useEffect(() => {
    if (visited == "true") {
      setOpenEco(false);
      setVisitedHome(true);
    } else {
      setOpenEco(true);
      setVisitedHome(false);
    }
  }, [visited]);

  const [wiki, setWiki] = useState();

  const [ecoMove, setEcoMove] = useState();
  const [click, setClick] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    if (ecoFilter && !click) {
      setHoverInfo({
        longitude: ecoFilter.coordinates[0],
        latitude: ecoFilter.coordinates[1],
        regionName: ecoFilter.name,
        regionNum: ecoFilter.unique_id,
      });
    }
  }, [ecoFilter]);

  const [showPopup, setShowPopup] = useState(true);
  const [mapLoc, setMapLoc] = useState(false);

  const handleDrawerOpen = () => {
    setOpenEco(true);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleDrawerClose = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenEco(false);
    if (isMobile) {
      setTop("50vh");
      setDrawerHeight(1);
    }
  };

  const [dist, setDist] = useState([]);

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        setTab({ id: newValue, label: "Ecoregions" });

        break;
      case 1:
        setTab({ id: newValue, label: "Summary" });

        break;
      case 2:
        setTab({ id: newValue, label: "Distributions" });
        break;

      default:
        break;
    }
  };

  const [top, setTop] = useState("50vh");
  const [drawerHeight, setDrawerHeight] = useState(1);

  return (
    <div id="map-main">
      <MapProvider>
        <MapMain
          isMobile={isMobile}
          ecoFilter={ecoFilter}
          setEcoFilter={setEcoFilter}
          wiki={wiki}
          setWiki={setWiki}
          click={click}
          setClick={setClick}
          state={state}
          coords={coords}
          hoverInfo={hoverInfo}
          setHoverInfo={setHoverInfo}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          visitedHome={visitedHome}
          setTab={setTab}
          mapLoc={mapLoc}
          setMapLoc={setMapLoc}
        />
        {isMobile ? (
          <>
            <AppBar
              position="fixed"
              color="primary"
              sx={{ top: "auto", bottom: 0, zIndex: 1200, marginBottom: "0px" }}
            >
              <Toolbar sx={{ display: "grid" }}>
                <Tabs
                  // orientation="vertical"
                  value={tab.id}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  textColor="inherit"
                  indicatorColor="secondary"
                  centered
                >
                  <Tab
                    label="Ecoregions"
                    {...a11yProps(0)}
                    sx={{
                      "&:hover": {
                        color: theme.text,
                        opacity: 1,
                      },
                    }}
                    onClick={handleDrawerOpen}
                  />
                  <Tab
                    label="Summary"
                    {...a11yProps(1)}
                    sx={{
                      "&:hover": {
                        color: theme.text,
                        opacity: 1,
                      },
                    }}
                    onClick={handleDrawerOpen}
                  />
                  <Tab
                    label="Distributions"
                    {...a11yProps(2)}
                    sx={{
                      "&:hover": {
                        color: theme.text,
                        opacity: 1,
                      },
                    }}
                    onClick={handleDrawerOpen}
                  />
                </Tabs>
              </Toolbar>
            </AppBar>

            <Drawer
              anchor="bottom"
              open={openEco}
              onClose={handleDrawerClose}
              onOpen={handleDrawerOpen}
              // swipeAreaWidth={drawerBleeding}
              // disableSwipeToOpen={true}
              // ModalProps={{
              //   keepMounted: true,
              // }}
              hideBackdrop
              // variant="persistent"
              // elevation={10}
              sx={{
                width: "100%",
                flexShrink: 0,
                top: top,
                overflow: "visible",
                zIndex: 1100,
                "& .MuiDrawer-paper": {
                  width: "100%",
                  backgroundColor: theme.palette.primary.light,
                  margin: 0,
                  top: top,
                  overflow: "visible",
                  marginBottom: "55px",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "-40px",
                  display: "flex",
                  visibility: openEco ? "visible" : "hidden",
                  width: "100vw",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                {isMobile && (
                  <>
                    <ButtonGroup
                      // orientation="vertical"
                      aria-label="vertical outlined button group"
                      sx={{ marginLeft: "10px" }}
                    >
                      <IconButton
                        variant="text"
                        color="inherit"
                        onClick={() => {
                          switch (drawerHeight) {
                            case 0:
                              setTop("50vh");
                              setDrawerHeight(1);

                              break;
                            case 1:
                              setTop("40px");
                              setDrawerHeight(2);

                              break;

                            default:
                              break;
                          }
                        }}
                      >
                        <KeyboardArrowUpIcon />
                      </IconButton>
                      <IconButton
                        variant="text"
                        color="inherit"
                        onClick={() => {
                          switch (drawerHeight) {
                            case 1:
                              setTop("calc(85vh - 59px)");
                              setDrawerHeight(0);

                              break;
                            case 2:
                              setTop("50vh");
                              setDrawerHeight(1);

                              break;

                            default:
                              break;
                          }
                        }}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </ButtonGroup>
                    <Typography
                      align="center"
                      variant="h5"
                      disab
                      sx={{
                        position: "absolute",
                        left: "0px",
                        right: "0px",
                        marginInline: "auto",
                        marginTop: "3px",
                        width: "fit-content",
                      }}
                    >
                      {tab.label}
                    </Typography>
                  </>
                )}

                <IconButton
                  onClick={handleDrawerClose}
                  sx={{ marginLeft: "auto", marginRight: "10px" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider />
              <Box
                sx={{
                  marginTop: "10px",
                  height: "100%",
                  overflow: "auto",
                }}
              >
                {ecoregions && (
                  <>
                    <TabPanel value={tab.id} index={0}>
                      <EcoRegions
                        ecoregions={ecoregions && ecoregions}
                        ecoMove={ecoMove}
                        setEcoMove={setEcoMove}
                        setEcoFilter={setEcoFilter}
                        setHoverInfo={setHoverInfo}
                        setWiki={setWiki}
                        setShowPopup={setShowPopup}
                        visitedHome={visitedHome}
                        setTab={setTab}
                        click={click}
                        setClick={setClick}
                        isMobile={isMobile}
                      />
                    </TabPanel>
                    <TabPanel value={tab.id} index={1}>
                      <EcoSummary
                        wiki={wiki && wiki}
                        setWiki={setWiki}
                        ecoFilter={ecoFilter && ecoFilter}
                        isMobile={isMobile}
                      />
                    </TabPanel>
                    <TabPanel value={tab.id} index={2}>
                      <EcoDist
                        dist={dist}
                        setDist={setDist}
                        state={state}
                        dispatch={dispatch}
                        isMobile={isMobile}
                      />
                    </TabPanel>
                  </>
                )}
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Drawer
              anchor="right"
              open={openEco}
              onClose={handleDrawerClose}
              onOpen={handleDrawerOpen}
              // swipeAreaWidth={drawerBleeding}
              // disableSwipeToOpen={true}
              // ModalProps={{
              //   keepMounted: true,
              // }}
              hideBackdrop
              variant="persistent"
              // elevation={17}
              sx={{
                display: { xs: "none", md: "block" },
                "&.MuiDrawer-root > .MuiPaper-root": {
                  width: drawerWidth,
                  overflow: "visible",
                  top: 60,
                },
                width: drawerWidth,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  borderBottomLeftRadius: 8,
                  borderTopLeftRadius: 8,
                  visibility: "visible",
                  right: drawerWidth,
                  backgroundColor: "#f5f5dc",
                }}
              >
                <IconButton
                  color="primary"
                  sx={{
                    borderRadius: 0,
                    justifyContent: "start",
                    paddingLeft: "10px",
                    paddingRight: "72%",
                    "&:hover": {
                      borderRadius: 0,
                      backgroundColor: "rgba(0, 30, 60, 0.3)",
                    },
                  }}
                  onClick={() => setOpenEco(!openEco)}
                >
                  {openEco ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
                </IconButton>
                <Tabs
                  orientation="vertical"
                  value={tab.id}
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
                  <CustomTab
                    label="Ecoregions"
                    {...a11yProps(0)}
                    sx={{
                      borderBottom: "2px solid #1890ff",
                      borderTop: "2px solid #1890ff",
                    }}
                  />
                  <CustomTab
                    label="Summary"
                    {...a11yProps(1)}
                    sx={{ borderBottom: "2px solid #1890ff" }}
                  />
                  <CustomTab
                    label="Distributions"
                    {...a11yProps(2)}
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
                  height: "92vh",
                  overflow: "auto",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                {ecoregions && (
                  <>
                    <TabPanel value={tab.id} index={0}>
                      <EcoRegions
                        ecoregions={ecoregions && ecoregions}
                        ecoMove={ecoMove}
                        setEcoMove={setEcoMove}
                        setEcoFilter={setEcoFilter}
                        setHoverInfo={setHoverInfo}
                        setWiki={setWiki}
                        setShowPopup={setShowPopup}
                        visitedHome={visitedHome}
                        setTab={setTab}
                        click={click}
                        setClick={setClick}
                      />
                    </TabPanel>
                    <TabPanel value={tab.id} index={1}>
                      <EcoSummary
                        wiki={wiki && wiki}
                        setWiki={setWiki}
                        ecoFilter={ecoFilter && ecoFilter}
                      />
                    </TabPanel>
                    <TabPanel value={tab.id} index={2}>
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
            </Drawer>
          </>
        )}
      </MapProvider>
      {!visited && <WelcomeDialog />}
    </div>
  );
}
