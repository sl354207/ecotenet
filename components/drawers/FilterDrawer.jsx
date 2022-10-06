import menuItems from "@data/categories.json";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
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
    <Drawer
      sx={{
        width: { xs: "100%", lg: drawerWidth },
        flexShrink: 0,
        top: { xs: "calc(55%)", lg: "0px" },
        "& .MuiDrawer-paper": {
          width: { xs: "100%", lg: drawerWidth },
          backgroundColor: theme.palette.primary.light,
          margin: 0,
          // marginTop: { xs: "100px", lg: "0px" },
          top: { xs: "calc(55%)", lg: "0px" },
        },
      }}
      anchor={isMobile ? "bottom" : "left"}
      open={drawerOpen}
      onClose={handleDrawerClose}
      hideBackdrop
      // variant="persistent"
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
    </Drawer>
  );
};

export default FilterDrawer;
