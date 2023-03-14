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
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import CategoryList from "./CategoryList";

const drawerWidth = 370;

// reducer function used by useReducer hook. Toggles the openList value from true to false in menuItems to open and close the correct dropdowns on the drawer
const reducer = (menuItems, action) => {
  // doesn't work in react strict mode because it gets called twice
  if (action.type === "toggle") {
    return menuItems.map((menuItem) => {
      if (menuItem.menuTitle === action.payload) {
        menuItem.openList = !menuItem.openList;
      }

      return menuItem;
    });
  }
};

const FilterDrawer = ({
  ecoFilter,
  filterOpen,
  setFilterOpen,
  handleFilterClose,
  top,
  setTop,
  drawerHeight,
  setDrawerHeight,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [categorySelected, setCategorySelected] = useState(false);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  // takes in the menuTitle of the button clicked as key to toggle correct dropdown in reducer function
  const handleListClick = (menuTitle) => {
    drawerDispatch({ type: "toggle", payload: menuTitle });
  };

  // useReducer hook can be used for complex state manipulation or when a component has multiple substates such as menu dropdowns
  const [drawerState, drawerDispatch] = useReducer(reducer, menuItems);
  return (
    <>
      <Drawer
        sx={{
          width: { xs: "100%", md: drawerWidth },
          flexShrink: 0,
          top: { xs: top, md: "60px" },
          zIndex: 1100,
          overflow: "visible",
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: drawerWidth },
            backgroundColor: theme.palette.primary.light,
            margin: 0,
            top: { xs: top, md: "60px" },
            overflow: "visible",
            marginBottom: {
              xs: router.pathname === "/" ? "55px" : "0px",
              md: "0px",
            },
          },
        }}
        anchor={isMobile ? "bottom" : "left"}
        open={filterOpen}
        onClose={handleFilterClose}
        hideBackdrop
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: "-40px", md: "-60px" },
            paddingBlock: { xs: "0px", md: "10px" },
            display: "flex",
            visibility: filterOpen ? "visible" : "hidden",
            width: { xs: "100vw", md: drawerWidth },
            backgroundColor: theme.palette.primary.light,
          }}
        >
          {isMobile && (
            <>
              <ButtonGroup
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
            </>
          )}
          <Button
            sx={{
              flexGrow: { xs: 0, md: 1 },
              marginInline: { xs: "auto", md: "10px" },
              position: { xs: "absolute", md: "relative" },
              left: "0px",
              right: "0px",

              width: { xs: "55vw", md: "auto" },
            }}
            onClick={() => {
              setFilterOpen(false);
              router.push(`/ecoregions/${ecoFilter.unique_id}`);
            }}
            variant="text"
            color="inherit"
          >
            ECO-{ecoFilter && ecoFilter.unique_id}
          </Button>
          <IconButton
            onClick={handleFilterClose}
            sx={{ marginLeft: "auto", marginRight: "10px" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            marginTop: "10px",
            height: "91vh",
            overflow: "auto",
          }}
        >
          {categorySelected ? (
            <CategoryList
              category={category && category}
              ecoFilter={ecoFilter}
              title={title && title}
              description={description && description}
              setCategory={setCategory}
              setCategorySelected={setCategorySelected}
              handleFilterClose={handleFilterClose}
            />
          ) : (
            <>
              {drawerState.map((menuItem, index) => {
                const { menuTitle, menuSubs, openList } = menuItem;

                return (
                  <List
                    component="nav"
                    aria-labelledby="nested-list"
                    key={index}
                  >
                    <ListItemButton
                      key={menuTitle}
                      onClick={() => handleListClick(menuTitle)}
                    >
                      <ListItemText primary={menuTitle} />
                      {openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                    <Collapse in={openList} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding key="sublist">
                        {menuSubs.map((menuSub) => (
                          <ListItemButton
                            key={menuSub.subTitle}
                            sx={{ paddingLeft: theme.spacing(4) }}
                            onClick={() => {
                              if (menuSub.query.title) {
                                const title = encodeURIComponent(
                                  menuSub.query.title
                                );
                                const sub = encodeURIComponent(
                                  menuSub.query.sub
                                );
                                setCategorySelected(true);
                                setCategory({ title: title, sub: sub });
                                setTitle(menuSub.subTitle);
                                setDescription(menuSub.description);
                              } else {
                                setCategorySelected(true);
                                setCategory(menuSub.query);
                                setTitle(menuSub.subTitle);
                                setDescription(menuSub.description);
                              }
                            }}
                          >
                            <ListItemText primary={menuSub.subTitle} />
                          </ListItemButton>
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
      </Drawer>
    </>
  );
};

export default FilterDrawer;
