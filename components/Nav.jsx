import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { MenuItem } from "@material-ui/core";
import { Menu } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import { useState, useEffect, useRef, useReducer } from "react";
import { useRouter } from "next/router";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";

import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import {
  Popper,
  Grow,
  InputBase,
  ClickAwayListener,
  MenuList,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  headerOptions: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.light,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  accordion: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&:expanded": {
      margin: "auto",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
    // },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    // width: "100%",
    // [theme.breakpoints.up("xs")]: {
    width: "0ch",
    "&:focus": {
      width: "20ch",
    },
    // },
  },
  searchPaper: {
    border: "1px solid #94c9ff",
    borderRadius: "10px",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    // zIndex: "2000",
  },
  searchPopper: {
    zIndex: "2000",
    paddingTop: theme.spacing(1),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

// initialize drawer categories
const menuItems = [
  {
    menuTitle: "Animals",
    menuSubs: [
      "Mammals",
      "Reptiles",
      "Amphibians",
      "Birds",
      "Fish/Mollusk",
      "Guides",
    ],
    pageURL: "/mammals",
    openList: false,
  },
  {
    menuTitle: "Plants",
    menuSubs: ["Trees", "Shrubs", "Vines", "Wildflowers", "Ferns", "Guides"],
    pageURL: "/posts/60da0c1ffde53f333e6498dd",
    openList: false,
  },
  {
    menuTitle: "Fungi",
    menuSubs: ["Gilled", "Non-Gilled", "Gastromycetes", "Guides"],
    pageURL: "/history",
    openList: false,
  },
  {
    menuTitle: "Arthropods",
    menuSubs: ["Crustaceans", "Myriapods", "Chelicerates", "Insects", "Guides"],
    pageURL: "/gallery",
    openList: false,
  },
  {
    menuTitle: "Hunt",
    menuSubs: [
      "Tracking/Stalking",
      "Trapping",
      "Fishing",
      "Strategies/Techniques",
      "Processing",
      "Tools",
    ],
    pageURL: "/pageant",
    openList: false,
  },
  {
    menuTitle: "Gather",
    menuSubs: ["Edible", "Medicinal"],
    pageURL: "/volunteer",
    openList: false,
  },
  {
    menuTitle: "Travel",
    menuSubs: ["Land", "Water"],
    pageURL: "/sponsors",
    openList: false,
  },
  {
    menuTitle: "Survival",
    menuSubs: ["Fire", "Water", "Basic Shelter", "Navigation", "Emergency"],
    pageURL: "/contact",
    openList: false,
  },
  {
    menuTitle: "Agriculture",
    menuSubs: [
      "Planting/Harvesting",
      "Maintenance/Management",
      "Processing/Storage",
      "Livestock",
      "Soil Health",
      "Propogation/Cultivation",
      "Irrigation",
      "Techniques/Systems",
      "Start-To-Finish/Lifecycles",
    ],
    pageURL: "/pageant",
    openList: false,
  },
  {
    menuTitle: "Building",
    menuSubs: [
      "Foundations/Floors",
      "Walls",
      "Roofs",
      "Complete Structures",
      "Water Systems",
      "Heating/Cooling",
      "Furniture/Utensils/Tools",
    ],
    pageURL: "/volunteer",
    openList: false,
  },
  {
    menuTitle: "Culture",
    menuSubs: [
      "Cooking/Recipes",
      "Clothing",
      "Art",
      "Music",
      "Rituals",
      "Stories",
    ],
    pageURL: "/sponsors",
    openList: false,
  },
];

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

const Nav = () => {
  const router = useRouter();
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openL, setOpenL] = useState(false);

  const anchor = Boolean(openL);
  const id = anchor ? "simple-popper" : undefined;
  // const anchorRef = useRef(null);

  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  const handleClose = (event, menuSub) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    // setOpen(false);
    setOpenL(!openL);
  };

  // function handleListKeyDown(event) {
  //   if (event.key === "Tab") {
  //     event.preventDefault();
  //     setOpen(false);
  //   }
  // }

  // return focus to the button when we transitioned from !open -> open
  // const prevOpen = useRef(open);
  // useEffect(() => {
  //   if (prevOpen.current === true && open === false) {
  //     anchorRef.current.focus();
  //   }

  //   prevOpen.current = open;
  // }, [open]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(false);
  };

  const [searchAnchor, setSearchAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchClick = (event) => {
    setSearchValue(event.target.value);
    console.log(event.target.value);
    if (event.target.value === "") {
      setSearchOpen(false);
      setSearchAnchor(null);
    } else {
      setSearchOpen(true);
      setSearchAnchor(event.currentTarget);
    }
  };

  const handleSearchClickAway = () => {
    setSearchOpen(false);
  };

  // const open = Boolean(searchAnchor);
  const searchID = searchOpen ? "simple-popper" : undefined;

  // const [openList, setOpenList] = useState(false);

  // takes in the menuTitle of the button clicked as key to toggle correct dropdown in reducer function
  const handleListClick = (menuTitle) => {
    // setOpenList(!openList);
    dispatch({ type: "toggle", payload: menuTitle });
  };

  // useReducer hook can be used for complex state manipulation or when a component has multiple substates such as menu dropdowns
  const [state, dispatch] = useReducer(reducer, menuItems);

  // category filter logic. Revisit
  const [ecoFilter, setEcoFilter] = useState("");

  // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  useEffect(() => {
    let ecoregion = sessionStorage.getItem("ecoregion");

    if (router.pathname == "/mammals") {
      sessionStorage.setItem("ecoregion", router.pathname);
      setEcoFilter(router.pathname);
    } else {
      setEcoFilter(ecoregion);
    }
  }, [router.pathname]);

  // router.pathname.includes("suc", 1)
  // router.pathname.substring(1)

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          {/* <div>
            <img src="/mound.jpg" />
          </div> */}
          {/* {isMobile ? ( */}
          {/* {router.pathname.includes("suc", 1)
            ? () => setCategoryFilter(true)
            : () => setCategoryFilter(false)} */}
          {/* <h1>Hello React with Local Storage!</h1>

          <input value={value} type="text" onChange={onChange} />

          <p>{value}</p> */}
          <>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title}>
              Mound
            </Typography>
            <ClickAwayListener onClickAway={handleSearchClickAway}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onFocus={() => setSearchValue("")}
                  onChange={handleSearchClick}
                  value={searchValue}
                />
                <Popper
                  id={id}
                  className={classes.searchPopper}
                  open={searchOpen}
                  anchorEl={searchAnchor}
                >
                  <List className={classes.searchPaper}>
                    {ecoFilter && (
                      <>
                        <ListItem
                          button
                          onClick={() => {
                            router.push(`/search?q=${searchValue}&s=eco-posts`);
                          }}
                        >
                          <ListItemText
                            primary={`Search for '${searchValue}' in ecoregion posts`}
                          ></ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem
                          button
                          onClick={() => {
                            router.push(
                              `/search?q=${searchValue}&s=eco-species`
                            );
                          }}
                        >
                          <ListItemText
                            primary={`Search for '${searchValue}' in ecoregion species`}
                          ></ListItemText>
                        </ListItem>
                        <Divider />
                      </>
                    )}

                    <ListItem
                      button
                      onClick={() => {
                        router.push(`/search?q=${searchValue}&s=all-posts`);
                      }}
                    >
                      <ListItemText
                        primary={`Search for '${searchValue}' in all posts`}
                      ></ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => {
                        router.push(`/search?q=${searchValue}&s=all-species`);
                      }}
                    >
                      <ListItemText
                        primary={`Search for '${searchValue}' in all species`}
                      ></ListItemText>
                    </ListItem>
                  </List>
                </Popper>
              </div>
            </ClickAwayListener>
            <Drawer
              className={classes.drawer}
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerClose}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                {/* <Typography variant="h6" className={classes.title}>
                  Mound
                </Typography> */}
                <Button
                  className={classes.title}
                  onClick={() => router.push("/category")}
                >
                  Categories
                </Button>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              {state.map((menuItem) => {
                const { menuTitle, menuSubs, pageURL, openList } = menuItem;

                return (
                  <List component="nav" aria-labelledby="nested-list">
                    <ListItem button onClick={() => handleListClick(menuTitle)}>
                      <ListItemText primary={menuTitle} />
                      {openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={openList} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {menuSubs.map((menuSub) => (
                          <ListItem
                            button
                            key={menuSub}
                            className={classes.nested}
                            onClick={() => {
                              handleDrawerClose(Event);
                              router.push(pageURL);
                            }}
                          >
                            <ListItemText primary={menuSub} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                    <Divider />
                  </List>
                );
              })}
            </Drawer>
          </>
          {/* ) : ( */}
          {/* <>
              <Typography variant="h6" className={classes.title}>
                Mound
              </Typography>
              <div className={classes.headerOptions}>
                {menuItems.map((menuItem) => {
                  const { menuTitle, menuSubs, pageURL } = menuItem;

                  // console.log(menuSubs);
                  return (
                    // <Button
                    //   variant="contained"
                    //   onClick={() => router.push(pageURL)}
                    // >
                    //   {menuTitle}
                    // </Button>
                    <>
                      <Button onClick={handleClose}>{menuTitle}</Button>
                    </>
                  );
                })}
                <Popper open={openL} anchorEl={openL}>
                  <List>
                    {menuItems.map((menuItem) => {
                      // console.log(menuSub);
                      const { menuTitle, menuSubs, pageURL } = menuItem;
                      return (
                        <ListItem
                          button
                          key={menuTitle}
                          onClick={() => {
                            console.log(menuSub);
                          }}
                        >
                          <ListItemText primary={menuTitle} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Popper>
              </div>
            </> */}
          {/* )} */}
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
      {/* <Toolbar></Toolbar> */}
    </div>
  );
};

export default Nav;

// import React from "react";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
// import InputBase from "@material-ui/core/InputBase";
// import Popper from "@material-ui/core/Popper";
// import { alpha, makeStyles } from "@material-ui/core/styles";
// import MenuIcon from "@material-ui/icons/Menu";
// import SearchIcon from "@material-ui/icons/Search";
// import ClickAwayListener from "@material-ui/core/ClickAwayListener";

// // CLICK AWAY LISTENER

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1
//   },
//   menuButton: {
//     marginRight: theme.spacing(2)
//   },
//   title: {
//     flexGrow: 1,
//     display: "none",
//     [theme.breakpoints.up("sm")]: {
//       display: "block"
//     }
//   },

// }));

// export default function SearchAppBar() {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <AppBar position="static">
//         <Toolbar>
//           <IconButton
//             edge="start"
//             className={classes.menuButton}
//             color="inherit"
//             aria-label="open drawer"
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography className={classes.title} variant="h6" noWrap>
//             Material-UI
//           </Typography>

//         </Toolbar>
//       </AppBar>
//     </div>
//   );
// }
