import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

import { useSnackbarContext } from "@components/SnackbarContext";
import { createPost } from "@utils/api-helpers";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import CreatePostButton from "./CreatePostButton";
import SearchDialog from "./dialogs/SearchDialog";
import FilterDrawer from "./drawers/FilterDrawer";
import { useUserContext } from "./UserContext";

const Nav = ({ ecoFilter, state, dispatch }) => {
  // console.log(ecoFilter);
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();

  let status;
  if (user == undefined) {
    status = "loading";
  } else {
    status = user.status;
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [top, setTop] = useState("65vh");
  const [drawerHeight, setDrawerHeight] = useState(1);

  const [popper, setPopper] = useState(false);

  const [search, setSearch] = useState(false);

  const handleClickSearch = () => {
    setSearch(true);
  };

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
    if (isMobile) {
      setTop("65vh");
      setDrawerHeight(1);
    }
  };

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ margin: 0 }}>
        <Toolbar sx={{ paddingLeft: "10px", paddingRight: "0px" }}>
          {ecoFilter && (
            <Button
              onClick={handleDrawerOpen}
              endIcon={<SortIcon sx={{ marginBottom: "2px" }} />}
              variant="contained"
              color="secondary"
            >
              Eco-{ecoFilter.unique_id}
            </Button>
          )}

          <Button
            href="/featured"
            variant="text"
            color="secondary"
            sx={{
              display: { xs: "none", lg: "block" },
              marginLeft: "10px",
            }}
          >
            Featured Posts
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
          <Button
            color="secondary"
            href="/"
            sx={{
              position: "absolute",
              left: "0px",
              right: "0px",
              margin: "0px auto",
              width: "fit-content",
              "& .MuiButton-startIcon": { marginRight: "0px" },
            }}
            startIcon={
              <TripOriginIcon
                sx={{
                  marginBottom: "2px",
                }}
              />
            }
          >
            Ecotenet
          </Button>

          <IconButton
            color="secondary"
            size="large"
            sx={{ marginLeft: "auto", marginRight: "5px" }}
            onClick={handleClickSearch}
          >
            <SearchIcon sx={{ fontSize: "2rem" }} />
          </IconButton>

          <SearchDialog
            search={search}
            setSearch={setSearch}
            ecoFilter={ecoFilter && ecoFilter}
          />

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
            {status == "authenticated" && (
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
            top={top}
            setTop={setTop}
            drawerHeight={drawerHeight}
            setDrawerHeight={setDrawerHeight}
          />
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </>
  );
};

export default Nav;
