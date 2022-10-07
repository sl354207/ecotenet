import menuItems from "@data/categories.json";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import CategoryList from "./CategoryList";

const drawerWidth = 350;

// reducer function used by useReducer hook. Toggles the openList value from true to false in menuItems to open and close the correct dropdowns on the drawer
const reducer = (menuItems, action) => {
  if (action.type == "toggle") {
    return menuItems.map((menuItem) => {
      if (menuItem.menuTitle == action.payload) {
        menuItem.openList = !menuItem.openList;
      }
      return menuItem;
    });
  }
  // else {
  // POTENTIALLY ADD ERROR MESSAGE
  //   return menuItems;
  // }
};

const FilterDrawer = ({
  ecoFilter,
  state,
  dispatch,
  drawerOpen,
  setDrawerOpen,
  handleDrawerClose,
  top,
  setTop,
  drawerHeight,
  setDrawerHeight,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [categorySelect, setCategorySelect] = useState(false);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState();

  // takes in the menuTitle of the button clicked as key to toggle correct dropdown in reducer function
  const handleListClick = (menuTitle) => {
    dispatchHook({ type: "toggle", payload: menuTitle });
  };

  // useReducer hook can be used for complex state manipulation or when a component has multiple substates such as menu dropdowns
  const [drawerState, dispatchHook] = useReducer(reducer, menuItems);
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          // top: "-1px",
          top: { xs: top.nav, lg: "-1px" },

          left: 0,
          // borderTopLeftRadius: 8,
          // borderTopRightRadius: 8,

          // display: drawerOpen ? "block" : "none",
          transform: {
            xs: drawerOpen ? "none" : "translatey(400px)",
            lg: drawerOpen ? "none" : "translateX(-350px)",
          },
          transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          visibility: "visible",
          width: { xs: "100vw", lg: drawerWidth },
          // right: 0,
          // left: 0,
          backgroundColor: theme.palette.primary.light,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
          }}
        >
          {isMobile && (
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
              size="small"
            >
              <IconButton
                variant="text"
                color="inherit"
                size="small"
                onClick={() => {
                  switch (drawerHeight) {
                    case 0:
                      setTop({ nav: "351px", drawer: "calc(55vh)" });
                      setDrawerHeight(1);

                      break;
                    case 1:
                      setTop({ nav: "0px", drawer: "69px" });
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
                size="small"
                onClick={() => {
                  switch (drawerHeight) {
                    case 1:
                      setTop({
                        nav: "calc(100vh - 129px)",
                        drawer: "calc(100vh - 59px)",
                      });
                      setDrawerHeight(0);

                      break;
                    case 2:
                      setTop({ nav: "351px", drawer: "calc(55vh)" });
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
          )}

          <Button
            sx={{
              flexGrow: 1,
              //
            }}
            onClick={() => {
              setDrawerOpen(false);
              router.push(`/ecoregions/${ecoFilter.unique_id}`);
            }}
            variant="text"
            color="inherit"
          >
            ECO-{ecoFilter && ecoFilter.unique_id}
          </Button>
          <IconButton onClick={handleDrawerClose} size="large">
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
      </Box>
      <SwipeableDrawer
        sx={{
          width: { xs: "100%", lg: drawerWidth },
          flexShrink: 0,
          top: { xs: top.drawer, lg: "56px" },
          // zIndex: 900,
          // display: "block",
          // height: `calc(50% - 56px)`,
          // overflow: "visible",
          "& .MuiDrawer-paper": {
            width: { xs: "100%", lg: drawerWidth },
            backgroundColor: theme.palette.primary.light,
            margin: 0,
            // zIndex: 900,
            // marginTop: { xs: "100px", lg: "0px" },
            top: { xs: top.drawer, lg: "56px" },
            // height: `calc(50% - 56px)`,
            // overflow: "visible",
          },
        }}
        // elevation={900}
        anchor={isMobile ? "bottom" : "left"}
        open={drawerOpen}
        onClose={handleDrawerClose}
        // swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: true,
        }}
        hideBackdrop
        // variant="persistent"
      >
        {categorySelect ? (
          <CategoryList
            category={category && category}
            ecoFilter={ecoFilter}
            title={title && title}
            dispatch={dispatch}
            state={state}
            setCategory={setCategory}
            setCategorySelect={setCategorySelect}
          />
        ) : (
          <>
            {drawerState.map((menuItem) => {
              const { menuTitle, menuSubs, openList } = menuItem;

              return (
                <List
                  component="nav"
                  aria-labelledby="nested-list"
                  key="mainlist"
                >
                  <ListItem
                    button
                    key={menuTitle}
                    onClick={() => handleListClick(menuTitle)}
                  >
                    <ListItemText primary={menuTitle} />
                    {openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>
                  <Collapse in={openList} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding key="sublist">
                      {menuSubs.map((menuSub) => (
                        <ListItem
                          button
                          key={menuSub.subTitle}
                          sx={{ paddingLeft: theme.spacing(4) }}
                          onClick={() => {
                            setCategorySelect(true);
                            setCategory(menuSub.query);
                            setTitle(menuSub.subTitle);
                          }}
                        >
                          <ListItemText primary={menuSub.subTitle} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider />
                </List>
              );
            })}
          </>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default FilterDrawer;
