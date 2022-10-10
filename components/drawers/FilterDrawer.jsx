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
  setTab,
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
      <SwipeableDrawer
        sx={{
          width: { xs: "100%", lg: drawerWidth },
          flexShrink: 0,
          top: { xs: top, lg: "56px" },
          zIndex: 1100,
          overflow: "visible",
          "& .MuiDrawer-paper": {
            width: { xs: "100%", lg: drawerWidth },
            backgroundColor: theme.palette.primary.light,
            margin: 0,
            top: { xs: top, lg: "49px" },
            overflow: "visible",
            marginBottom: { xs: "55px", lg: "0px" },
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
        <Box
          sx={{
            position: "absolute",
            top: { xs: "-68px", lg: "-48px" },
            display: "flex",
            visibility: drawerOpen ? "visible" : "hidden",
            width: { xs: "100vw", lg: drawerWidth },
            backgroundColor: theme.palette.primary.light,
          }}
        >
          {isMobile && (
            <>
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
                        setTop("65vh");
                        setDrawerHeight(1);

                        break;
                      case 1:
                        setTop("69px");
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
                        setTop("calc(100vh - 59px)");
                        setDrawerHeight(0);

                        break;
                      case 2:
                        setTop("65vh");
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
            </>
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
        </Box>
        <Divider />
        <Box
          sx={{
            marginTop: "10px",
            height: "100%",
            overflow: "auto",
          }}
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
              setTab={setTab}
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
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default FilterDrawer;
