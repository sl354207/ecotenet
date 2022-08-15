import menuItems from "@data/categories.json";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
  AppBar,
  Autocomplete,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { alpha, useTheme } from "@mui/material/styles";

import { useSnackbarContext } from "@components/SnackbarContext";
import { createPost } from "@utils/api-helpers";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";
import CreatePostButton from "./CreatePostButton";
import { useUserContext } from "./UserContext";

const drawerWidth = 240;

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
  const { snackbar, setSnackbar } = useSnackbarContext();
  // console.log(userName);
  let status;
  if (user == undefined) {
    status = "loading";
  } else {
    status = user.status;
  }

  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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

  const startPost = async () => {
    const value = {
      title: "",
      description: "",
      category: "",
      tags: [],
      ecoregions: [],
      id: "",
      status: "",
      name: user.name,
      status: "draft",
      approved: "false",
      updated: false,
      featured: false,
      feature: "false",
      date: "",
      version: 1,
      rows: [],
    };

    const createResponse = await createPost(value);

    if (createResponse.ok) {
      const ID = await createResponse.json();
      router.push(`/dashboard/posts/${ID.insertedId}`);
    }
    if (!createResponse.ok) {
      setSnackbar({
        ...snackbar,
        open: true,
        severity: "error",
        message: "There was a problem creating post. Please try again later",
      });
    }
  };

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

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ margin: 0 }}>
        <Toolbar>
          {isMobile ? (
            <>
              {ecoFilter && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="filter"
                  size="small"
                  onClick={handleDrawerOpen}
                >
                  <Typography>{ecoFilter}</Typography>
                  <SortIcon sx={{ color: theme.palette.secondary.light }} />
                </IconButton>
              )}

              <div
                style={{
                  flexGrow: 1,
                  [theme.breakpoints.down("md")]: {
                    flexGrow: 1,
                  },
                }}
              >
                <Button
                  href="/"
                  size="small"
                  color="inherit"
                  sx={{ minWidth: "auto" }}
                >
                  et
                </Button>
              </div>

              <div
                style={{
                  position: "relative",
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: alpha(theme.palette.common.white, 0.15),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.25),
                  },
                  marginLeft: 0,
                  width: "auto",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    padding: theme.spacing(0, 2),
                    height: "100%",
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SearchIcon />
                </div>

                <Autocomplete
                  sx={{
                    "&.MuiAutocomplete-input": {
                      padding: theme.spacing(1, 1, 1, 0),
                      // vertical padding + font size from searchIcon
                      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                      transition: theme.transitions.create("width"),
                      width: "0ch",
                      "&:focus": {
                        width: "20ch",
                      },
                    },
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
                  id="nav-auto"
                  options={tags}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    // if (typeof option === "string") {
                    //   return option;
                    // }
                    // // Add "xxx" option created dynamically
                    // if (option.inputValue) {
                    //   return option.inputValue;
                    // }
                    // Regular option
                    return "";
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>{option.title}</li>
                  )}
                  freeSolo
                  renderInput={(params) => (
                    <InputBase
                      {...params}
                      placeholder="Search Site…"
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: theme.spacing(1, 1, 1, 0),
                          // vertical padding + font size from searchIcon
                          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                          transition: theme.transitions.create("width"),
                          width: "0ch",
                          "&:focus": {
                            width: "20ch",
                          },
                        },
                      }}
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                    />
                  )}
                />
              </div>

              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                ref={anchorRef}
                aria-controls={popper ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={togglePopper}
                size="large"
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
                      minWidth: 210,
                    }}
                  >
                    <Paper>
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
                            sx={{ color: theme.palette.secondary.main }}
                          >
                            Featured Posts
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/species-map");
                            }}
                            sx={{ color: theme.palette.secondary.main }}
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
                              sx={{ color: theme.palette.secondary.main }}
                            >
                              Dashboard
                            </MenuItem>
                          )}
                          {status == "authenticated" ? (
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
                                      startPost();
                                    }
                              }
                              sx={{
                                color: theme.palette.secondary.main,
                                border: `1px solid ${theme.palette.secondary.main}`,
                                borderRadius: "4px",
                                marginBottom: "4px",
                              }}
                            >
                              Create Post
                            </MenuItem>
                          ) : (
                            <MenuItem
                              // onClick={() => {
                              //   setPopper(false);
                              //   signIn();
                              // }}
                              disabled
                              sx={{
                                color: theme.palette.secondary.main,
                                border: `1px solid ${theme.palette.secondary.main}`,
                                borderRadius: "4px",
                                marginBottom: "4px",
                              }}
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
                            sx={{
                              color: theme.palette.secondary.main,
                              border: `1px solid ${theme.palette.secondary.main}`,
                              borderRadius: "4px",
                              marginBottom: "4px",
                            }}
                          >
                            {status == "authenticated" ? (
                              <>Sign Out</>
                            ) : (
                              <>Sign In</>
                            )}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setPopper(false);
                              router.push("/donate");
                            }}
                            sx={{
                              border: `1px solid ${theme.palette.secondary.main}`,
                              borderRadius: "4px",
                              backgroundColor: theme.palette.secondary.main,
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                backgroundColor: "#0071e4",
                                border: "1px solid #0071e4",
                                borderRadius: "4px",
                              },
                            }}
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
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    backgroundColor: theme.palette.primary.light,
                    margin: 0,
                  },
                }}
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerClose}
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
                      [theme.breakpoints.down("md")]: {
                        flexGrow: 1,
                      },
                    }}
                    onClick={() => {
                      setDrawerOpen(false);
                      router.push("/");
                    }}
                    variant="text"
                    color="inherit"
                  >
                    ecotenet
                  </Button>
                  <IconButton onClick={handleDrawerClose} size="large">
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />
                {state.map((menuItem) => {
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
                              key={menuSub}
                              sx={{ paddingLeft: theme.spacing(4) }}
                              onClick={() => {
                                handleDrawerClose(Event);
                                router.push({
                                  pathname: `/[region]/[category]`,
                                  query: {
                                    region: ecoFilter,
                                    category: menuSub.replaceAll("/", "_"),
                                    title: menuTitle,
                                  },
                                });
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
          ) : (
            <>
              {ecoFilter && (
                <IconButton
                  edge="start"
                  sx={{ marginRight: theme.spacing(2) }}
                  aria-label="filter"
                  onClick={handleDrawerOpen}
                  size="large"
                >
                  <Typography>{ecoFilter}</Typography>
                  <SortIcon sx={{ color: theme.palette.secondary.light }} />
                </IconButton>
              )}

              <div
                style={{
                  flexGrow: 1,
                  [theme.breakpoints.down("md")]: {
                    flexGrow: 1,
                  },
                }}
              >
                <Button href="/" variant="text" color="inherit">
                  ecotenet
                </Button>

                <div style={{ display: "inline-flex" }}>
                  <Button href="/featured" variant="text" color="secondary">
                    Featured Posts
                  </Button>
                  <Button href="/species-map" variant="text" color="secondary">
                    Species Map
                  </Button>
                  {status == "authenticated" && (
                    <Button
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

              <div
                style={{
                  position: "relative",
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: alpha(theme.palette.common.white, 0.15),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.25),
                  },
                  marginLeft: 0,
                  width: "auto",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    padding: theme.spacing(0, 2),
                    height: "100%",
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SearchIcon />
                </div>

                <Autocomplete
                  sx={{
                    "&.MuiAutocomplete-input": {
                      padding: theme.spacing(1, 1, 1, 0),
                      // vertical padding + font size from searchIcon
                      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                      transition: theme.transitions.create("width"),
                      width: "0ch",
                      "&:focus": {
                        width: "20ch",
                      },
                    },
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
                  id="nav-auto"
                  options={tags}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    // if (typeof option === "string") {
                    //   return option;
                    // }
                    // // Add "xxx" option created dynamically
                    // if (option.inputValue) {
                    //   return option.inputValue;
                    // }
                    // Regular option
                    return "";
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>{option.title}</li>
                  )}
                  freeSolo
                  renderInput={(params) => (
                    <InputBase
                      {...params}
                      placeholder="Search Site…"
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: theme.spacing(1, 1, 1, 0),
                          // vertical padding + font size from searchIcon
                          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                          transition: theme.transitions.create("width"),
                          width: "0ch",
                          "&:focus": {
                            width: "20ch",
                          },
                        },
                      }}
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                    />
                  )}
                />
              </div>

              {status == "authenticated" ? (
                <>
                  {user.name == undefined ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => router.push("/auth/new-user")}
                    >
                      Create Post
                    </Button>
                  ) : (
                    <CreatePostButton
                      name={user && user.name}
                      snackbar={snackbar}
                      setSnackbar={setSnackbar}
                      nav={true}
                    />
                  )}
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  // onClick={() => signIn()}
                  disabled
                >
                  Create Post
                </Button>
              )}

              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginLeft: "10px" }}
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
                sx={{ marginLeft: "10px" }}
              >
                Donate
              </Button>

              <Drawer
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    backgroundColor: theme.palette.primary.light,
                    margin: 0,
                  },
                }}
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerClose}
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
                      [theme.breakpoints.down("md")]: {
                        flexGrow: 1,
                      },
                    }}
                    onClick={() => {
                      setDrawerOpen(false);
                      router.push("/");
                    }}
                    variant="text"
                    color="inherit"
                  >
                    ecotenet
                  </Button>
                  <IconButton onClick={handleDrawerClose} size="large">
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />
                {state.map((menuItem) => {
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
                              key={menuSub}
                              sx={{ paddingLeft: theme.spacing(4) }}
                              onClick={() => {
                                handleDrawerClose(Event);
                                router.push({
                                  pathname: `/[region]/[category]`,
                                  query: {
                                    region: ecoFilter,
                                    category: menuSub.replaceAll(" ", "_"),
                                    title: menuTitle.replaceAll(" ", "_"),
                                  },
                                });
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
          )}
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </>
  );
};

export default Nav;
