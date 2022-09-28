import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  InputBase,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { alpha, useTheme } from "@mui/material/styles";

import { useSnackbarContext } from "@components/SnackbarContext";
import { createPost } from "@utils/api-helpers";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import CreatePostButton from "./CreatePostButton";
import FilterDrawer from "./drawers/FilterDrawer";
import { useUserContext } from "./UserContext";

const CustomPopper = function (props) {
  return <Popper {...props} style={{ width: "400px" }} placement="bottom" />;
};

const Nav = ({ ecoFilter, state, dispatch }) => {
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();

  let status;
  if (user == undefined) {
    status = "loading";
  } else {
    status = user.status;
  }

  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();

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

  // set filter for autocomplete options
  const filter = createFilterOptions();
  // set tag options for autocomplete
  const tags = [];

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ margin: 0 }}>
        <Toolbar sx={{ paddingLeft: "10px", paddingRight: "0px" }}>
          {ecoFilter && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="filter"
              onClick={handleDrawerOpen}
              sx={{
                marginLeft: { xs: "1px", lg: "0px" },
                padding: { xs: "5px", lg: "12px" },
                fontSize: { xs: "18px", lg: "12px" },
              }}
            >
              <Typography>{ecoFilter}</Typography>
              <SortIcon sx={{ color: theme.palette.secondary.light }} />
            </IconButton>
          )}

          <Button
            href="/"
            size="large"
            color="inherit"
            sx={{
              minWidth: "auto",

              display: { xs: "block", lg: "none" },
            }}
          >
            et
          </Button>
          <Button
            href="/"
            color="inherit"
            sx={{
              display: { xs: "none", lg: "block" },
            }}
          >
            ecotenet
          </Button>
          <Button
            href="/featured"
            variant="text"
            color="secondary"
            sx={{
              display: { xs: "none", lg: "block" },
            }}
          >
            Featured Posts
          </Button>
          <Button
            href="/species-map"
            variant="text"
            color="secondary"
            sx={{
              display: { xs: "none", lg: "block" },
            }}
          >
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
              sx={{
                display: { xs: "none", lg: "block" },
              }}
            >
              Dashboard
            </Button>
          )}

          <div
            style={{
              position: "relative",
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginLeft: "auto",
              width: "auto",
              marginRight: "5px",
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
              autoHighlight
              disableClearable={true}
              onChange={(event, newValue) => {
                router.push(
                  `/search?q=${newValue.inputValue}&filter=${newValue.path}`
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
                return "";
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
              freeSolo
              PopperComponent={CustomPopper}
              ListboxProps={{
                sx: {
                  minHeight: ecoFilter ? "220px" : "auto",
                  "& .MuiAutocomplete-option": {
                    minHeight: "48px",
                  },
                },
              }}
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
                        width: { xs: "13ch", md: "19ch" },
                      },
                    },
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                />
              )}
            />
          </div>
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              ref={anchorRef}
              aria-controls={popper ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={togglePopper}
              size="large"
              sx={{ marginRight: "10px" }}
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
                        sx={{ marginRight: "2px" }}
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
          </Box>
          <Box sx={{ display: { xs: "none", lg: "flex" } }}>
            {status == "authenticated" ? (
              <>
                {user.name == undefined ? (
                  <Button
                    sx={{ marginLeft: "10px" }}
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
                sx={{ marginLeft: "10px" }}
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
          </Box>
          <FilterDrawer
            ecoFilter={ecoFilter}
            state={state}
            dispatch={dispatch}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            handleDrawerClose={handleDrawerClose}
          />
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </>
  );
};

export default Nav;
