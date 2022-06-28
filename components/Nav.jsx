import menuItems from "@data/categories.json";
import {
  AppBar,
  Button,
  ClickAwayListener,
  Collapse,
  Divider,
  Drawer,
  Grow,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";
import { useUserContext } from "./UserContext";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down('md')]: {
      flexGrow: 1,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.light,
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "auto",
    marginRight: 10,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    color: "inherit",
  },
  input: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "0ch",
    "&:focus": {
      width: "20ch",
    },
  },
  popper: {
    backgroundColor: theme.palette.primary.light,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  sort: {
    color: theme.palette.secondary.light,
  },
  home: {
    minWidth: "auto",
  },
  spacer: {
    marginLeft: 10,
  },
  desktop: {
    display: "inline-flex",
  },
  popperTop: {
    color: theme.palette.secondary.main,
  },
  popperBottom: {
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: 4,
    marginBottom: 4,
  },
  donate: {
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: 4,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: "#0071e4",
      border: "1px solid #0071e4",
      borderRadius: 4,
    },
  },
}));

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
  // const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);
  const { user } = useUserContext();
  // console.log(userName);
  let status;
  if (user == undefined) {
    status = "loading";
  } else {
    status = user.status;
  }

  const router = useRouter();
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'));

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
    dispatch({ type: "toggle", payload: menuTitle });
  };

  // useReducer hook can be used for complex state manipulation or when a component has multiple substates such as menu dropdowns
  const [state, dispatch] = useReducer(reducer, menuItems);

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  return <>
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        <>
          {ecoFilter && (
            <>
              {isMobile ? (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="filter"
                  size="small"
                  onClick={handleDrawerOpen}
                >
                  <SortIcon className={classes.sort} />
                </IconButton>
              ) : (
                <IconButton
                  edge="start"
                  className={classes.button}
                  color="inherit"
                  aria-label="filter"
                  onClick={handleDrawerOpen}
                  size="large">
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

              <div className={classes.desktop}>
                <Button href="/featured" variant="text" color="secondary">
                  Featured Posts
                </Button>
                <Button href="/species" variant="text" color="secondary">
                  Species Map
                </Button>
                {status == "authenticated" && (
                  <Button
                    // href="/dashboard"
                    variant="text"
                    color="secondary"
                    onClick={
                      status == "authenticated" && user.name == undefined
                        ? () => router.push("/auth/new-user")
                        : () => router.push("/dashboard")
                    }
                  >
                    Dashboard
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon
              // onClick={() => router.push("/success")}
              />
            </div>

            <Autocomplete
              classes={{
                paper: classes.popper,
                root: classes.root,
                input: classes.input,
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
                        title: `"${params.inputValue}" in all posts`,
                        path: "allPosts",
                      },
                      {
                        inputValue: params.inputValue,
                        title: `"${params.inputValue}" in all species`,
                        path: "allSpecies",
                      }
                    );
                  }
                } else {
                  if (params.inputValue !== "") {
                    filtered.push(
                      {
                        inputValue: params.inputValue,
                        title: `"${params.inputValue}" in ecoregion posts`,
                        path: "ecoPosts",
                      },
                      {
                        inputValue: params.inputValue,
                        title: `"${params.inputValue}" in ecoregion species`,
                        path: "ecoSpecies",
                      },
                      {
                        inputValue: params.inputValue,
                        title: `"${params.inputValue}" in all posts`,
                        path: "allPosts",
                      },
                      {
                        inputValue: params.inputValue,
                        title: `"${params.inputValue}" in all species`,
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
                    root: classes.root,
                    input: classes.input,
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                />
              )}
            />
          </div>

          {!isMobile && (
            <>
              {status == "authenticated" && (
                <Button
                  // href="/dashboard/editor"
                  variant="outlined"
                  color="secondary"
                  onClick={
                    status == "authenticated" && user.name == undefined
                      ? () => router.push("/auth/new-user")
                      : () => router.push("/dashboard/editor")
                  }
                >
                  Create Post
                </Button>
              )}

              <Button
                variant="outlined"
                color="secondary"
                className={classes.spacer}
                disabled={status == "loading"}
                onClick={
                  status == "authenticated"
                    ? () =>
                        signOut({
                          callbackUrl: "http://localhost:3000",
                        })
                    : () => signIn()
                }
              >
                {status == "authenticated" ? <>Sign Out</> : <>Sign In</>}
              </Button>

              <Button
                href="/donate"
                variant="contained"
                color="secondary"
                className={classes.spacer}
              >
                Donate
              </Button>
            </>
          )}

          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                ref={anchorRef}
                aria-controls={popper ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={togglePopper}
                size="large">
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
                        placement === "bottom"
                          ? "center top"
                          : "center bottom",
                      minWidth: 210,
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
                              router.push("/featured");
                            }}
                            className={classes.popperTop}
                          >
                            Featured Posts
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species");
                            }}
                            className={classes.popperTop}
                          >
                            Species Map
                          </MenuItem>
                          {status == "authenticated" && (
                            <MenuItem
                              onClick={
                                status == "authenticated" &&
                                user.name == undefined
                                  ? () => {
                                      setPopper(false);
                                      router.push("/auth/new-user");
                                    }
                                  : () => {
                                      setPopper(false);
                                      router.push("/dashboard");
                                    }
                              }
                              className={classes.popperTop}
                            >
                              Dashboard
                            </MenuItem>
                          )}
                          {status == "authenticated" && (
                            <MenuItem
                              onClick={
                                status == "authenticated" &&
                                user.name == undefined
                                  ? () => {
                                      setPopper(false);
                                      router.push("/auth/new-user");
                                    }
                                  : () => {
                                      setPopper(false);
                                      router.push("/dashboard/editor");
                                    }
                              }
                              className={classes.popperBottom}
                            >
                              Create Post
                            </MenuItem>
                          )}

                          <MenuItem
                            disabled={status == "loading"}
                            onClick={
                              status == "authenticated"
                                ? () => {
                                    setPopper(false);
                                    signOut({
                                      callbackUrl: "http://localhost:3000",
                                    });
                                  }
                                : () => {
                                    setPopper(false);
                                    signIn();
                                  }
                            }
                            className={classes.popperBottom}
                          >
                            Sign In
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/donate");
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
            </>
          )}

          <Drawer
            className={classes.drawer}
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerClose}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.header}>
              <Button
                className={classes.title}
                onClick={() => {
                  setDrawerOpen(false);
                  router.push("/");
                }}
              >
                ecotenet
              </Button>
              <IconButton onClick={handleDrawerClose} size="large">
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
      </Toolbar>
    </AppBar>
    <Toolbar></Toolbar>
  </>;
};

export default Nav;
