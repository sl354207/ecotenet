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
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Popper,
  Grow,
  InputBase,
  ClickAwayListener,
  MenuList,
  Collapse,
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
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
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
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  searchPaper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    // zIndex: "2000",
  },
  searchPopper: {
    zIndex: "2000",
  },
}));

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
    },
    {
      menuTitle: "Plants",
      menuSubs: ["Trees", "Shrubs", "Vines", "Wildflowers", "Ferns", "Guides"],
      pageURL: "/posts/60da0c1ffde53f333e6498dd",
    },
    {
      menuTitle: "Fungi",
      menuSubs: ["Gilled", "Non-Gilled", "Gastromycetes", "Guides"],
      pageURL: "/history",
    },
    {
      menuTitle: "Arthropods",
      menuSubs: [
        "Crustaceans",
        "Myriapods",
        "Chelicerates",
        "Insects",
        "Guides",
      ],
      pageURL: "/gallery",
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
    },
    {
      menuTitle: "Gather",
      menuSubs: ["Edible", "Medicinal"],
      pageURL: "/volunteer",
    },
    {
      menuTitle: "Travel",
      menuSubs: ["Land", "Water"],
      pageURL: "/sponsors",
    },
    {
      menuTitle: "Survival",
      menuSubs: ["Fire", "Water", "Basic Shelter", "Navigation", "Emergency"],
      pageURL: "/contact",
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
    },
  ];

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
                  {ecoFilter && (
                    <div className={classes.searchPaper}>
                      Search for '{searchValue}' in Ecoregion
                    </div>
                  )}

                  <div className={classes.searchPaper}>
                    Search for '{searchValue}' in all Posts
                  </div>
                  <div className={classes.searchPaper}>
                    Search for '{searchValue}' in all Species
                  </div>
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
              {menuItems.map((menuItem) => {
                const { menuTitle, menuSubs, pageURL } = menuItem;

                return (
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        {menuTitle}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {menuSubs.map((menuSub) => (
                          <ListItem
                            button
                            key={menuSub}
                            onClick={() => {
                              handleDrawerClose(Event);
                              router.push(menuItem.pageURL);
                            }}
                          >
                            <ListItemText primary={menuSub} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
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
      <Toolbar></Toolbar>
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
