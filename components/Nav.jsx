import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, Paper } from "@material-ui/core";
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

import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import FilterListIcon from "@material-ui/icons/FilterList";
import SortIcon from "@material-ui/icons/Sort";
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
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

import menuItems from "../data/categories.json";

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
    // marginLeft: theme.spacing(1),
    width: "auto",
    marginRight: 10,
    // },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    // pointerEvents: "none",
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
  popper: {
    backgroundColor: theme.palette.primary.light,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  sort: {
    color: theme.palette.secondary.light,
    // marginLeft: -8,
  },
  home: {
    minWidth: "auto",
  },
}));

// initialize drawer categories
//

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

const Nav = ({ ecoFilter }) => {
  const router = useRouter();
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openL, setOpenL] = useState(false);

  const anchor = Boolean(openL);
  const id = anchor ? "simple-popper" : undefined;

  const handleClose = (event, menuSub) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    // setOpen(false);
    setOpenL(!openL);
  };

  const [popper, setPopper] = useState(false);
  const anchorRef = useRef(null);

  const togglePopper = () => {
    setPopper((prevOpen) => !prevOpen);
  };

  const closePopper = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setPopper(false);
  };

  function handlePopperKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setPopper(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(popper);
  useEffect(() => {
    if (prevOpen.current === true && popper === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = popper;
  }, [popper]);

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

  // takes in the menuTitle of the button clicked as key to toggle correct dropdown in reducer function
  const handleListClick = (menuTitle) => {
    // setOpenList(!openList);
    dispatch({ type: "toggle", payload: menuTitle });
  };

  // useReducer hook can be used for complex state manipulation or when a component has multiple substates such as menu dropdowns
  const [state, dispatch] = useReducer(reducer, menuItems);

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          {/* {isMobile ? ( */}
          {/* {router.pathname.includes("suc", 1)
            //   ? () => setCategoryFilter(true)
            //   : () => setCategoryFilter(false)} */}
          {/* <h1>Hello React with Local Storage!</h1>

            // <input value={value} type="text" onChange={onChange} />

            // <p>{value}</p> */}
          <>
            {ecoFilter && (
              <>
                {isMobile ? (
                  <IconButton
                    edge="start"
                    // className={classes.menuButton}
                    color="inherit"
                    aria-label="filter"
                    size="small"
                    onClick={handleDrawerOpen}
                  >
                    {/* <FilterListIcon color="secondary" /> */}
                    <SortIcon className={classes.sort} />
                  </IconButton>
                ) : (
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="filter"
                    onClick={handleDrawerOpen}
                  >
                    {/* <FilterListIcon color="secondary" /> */}
                    <SortIcon className={classes.sort} />
                  </IconButton>
                )}
              </>
            )}

            {isMobile ? (
              <div className={classes.title}>
                <Button href="/" size="small" className={classes.home}>
                  et
                </Button>
              </div>
            ) : (
              <div className={classes.title}>
                <Button href="/">ecotenet</Button>
              </div>
            )}

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon onClick={() => router.push("/success")} />
              </div>

              <Autocomplete
                classes={{
                  paper: classes.popper,
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                autoHighlight
                disableClearable={true}
                onChange={(event, newValue) => {
                  router.push(
                    `/search?q=${newValue.inputValue}&s=${newValue.path}`
                  );
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  if (!ecoFilter) {
                    if (params.inputValue !== "") {
                      filtered.push(
                        {
                          inputValue: params.inputValue,
                          title: `Search for "${params.inputValue}" in all posts`,
                          path: "allPosts",
                        },
                        {
                          inputValue: params.inputValue,
                          title: `Search for "${params.inputValue}" in all species`,
                          path: "allSpecies",
                        }
                      );
                    }
                  } else {
                    if (params.inputValue !== "") {
                      filtered.push(
                        {
                          inputValue: params.inputValue,
                          title: `Search for "${params.inputValue}" in ecoregion posts`,
                          path: "ecoPosts",
                        },
                        {
                          inputValue: params.inputValue,
                          title: `Search for "${params.inputValue}" in ecoregion species`,
                          path: "ecoSpecies",
                        },
                        {
                          inputValue: params.inputValue,
                          title: `Search for "${params.inputValue}" in all posts`,
                          path: "allPosts",
                        },
                        {
                          inputValue: params.inputValue,
                          title: `Search for "${params.inputValue}" in all species`,
                          path: "allSpecies",
                        }
                      );
                    }
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={tags}
                renderOption={(option) => option.title}
                freeSolo
                renderInput={(params) => (
                  <InputBase
                    {...params}
                    placeholder="Search Site…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                  />
                )}
              />
            </div>
            {/* {isMobile && (
              <div>
                <Button href="/">ecotenet</Button>
              </div>
            )} */}
            {!isMobile && (
              <Button variant="outlined" color="secondary">
                Sign In
              </Button>
            )}

            <IconButton
              edge="end"
              // className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              ref={anchorRef}
              aria-controls={popper ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={togglePopper}
              // onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Popper
              open={popper}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper className={classes.popper}>
                    <ClickAwayListener onClickAway={closePopper}>
                      <MenuList
                        autoFocusItem={popper}
                        id="menu-list-grow"
                        onKeyDown={handlePopperKeyDown}
                      >
                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            router.push("/species");
                          }}
                        >
                          Featured Posts
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            router.push("/species");
                          }}
                        >
                          Species Map
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            router.push("/species");
                          }}
                          divider={true}
                        >
                          Dashboard
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            router.push("/species");
                          }}
                        >
                          Donate
                        </MenuItem>
                        {isMobile && (
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species");
                            }}
                          >
                            Sign In
                          </MenuItem>
                        )}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

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
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="filter"
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>

              <div className={classes.title}>
                <Button href="/">ecotenet</Button>
              </div>

              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>

                <Autocomplete
                  classes={{
                    paper: classes.popper,
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  autoHighlight
                  disableClearable={true}
                  onChange={(event, newValue) => {
                    router.push(
                      `/search?q=${newValue.inputValue}&s=${newValue.path}`
                    );
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (!ecoFilter) {
                      if (params.inputValue !== "") {
                        filtered.push(
                          {
                            inputValue: params.inputValue,
                            title: `Search for "${params.inputValue}" in all posts`,
                            path: "allPosts",
                          },
                          {
                            inputValue: params.inputValue,
                            title: `Search for "${params.inputValue}" in all species`,
                            path: "allSpecies",
                          }
                        );
                      }
                    } else {
                      if (params.inputValue !== "") {
                        filtered.push(
                          {
                            inputValue: params.inputValue,
                            title: `Search for "${params.inputValue}" in ecoregion posts`,
                            path: "ecoPosts",
                          },
                          {
                            inputValue: params.inputValue,
                            title: `Search for "${params.inputValue}" in ecoregion species`,
                            path: "ecoSpecies",
                          },
                          {
                            inputValue: params.inputValue,
                            title: `Search for "${params.inputValue}" in all posts`,
                            path: "allPosts",
                          },
                          {
                            inputValue: params.inputValue,
                            title: `Search for "${params.inputValue}" in all species`,
                            path: "allSpecies",
                          }
                        );
                      }
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="free-solo-with-text-demo"
                  options={tags}
                  renderOption={(option) => option.title}
                  freeSolo
                  renderInput={(params) => (
                    <InputBase
                      {...params}
                      placeholder="Search Site…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                    />
                  )}
                />
              </div>
              <Button variant="outlined" color="secondary">
                Sign In
              </Button>
              <IconButton
                edge="end"
                // className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                ref={anchorRef}
                aria-controls={popper ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={togglePopper}
                // onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
              <Popper
                open={popper}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper className={classes.popper}>
                      <ClickAwayListener onClickAway={closePopper}>
                        <MenuList
                          autoFocusItem={popper}
                          id="menu-list-grow"
                          onKeyDown={handlePopperKeyDown}
                        >
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species");
                            }}
                          >
                            Featured Posts
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species");
                            }}
                          >
                            Species Map
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species");
                            }}
                            divider={true}
                          >
                            Dashboard
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species");
                            }}
                            className={classes.donate}
                          >
                            Donate
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

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
