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
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

import { useHomepageContext } from "@components/context/HomepageContext";
import { useSnackbarContext } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import CreatePostButton from "@components/layouts/CreatePostButton";
import { createPost } from "@utils/apiHelpers";
import { signIn, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const DynamicFilterDrawer = dynamic(
  () => import("@components/drawers/FilterDrawer"),
  {
    ssr: false,
  }
);
const DynamicSearchDialog = dynamic(
  () => import("@components/dialogs/SearchDialog"),
  {
    ssr: false,
  }
);
const DynamicFeatureDialog = dynamic(
  () => import("@components/dialogs/FeatureDialog"),
  {
    ssr: false,
  }
);
const DynamicLatestDialog = dynamic(
  () => import("@components/dialogs/LatestDialog"),
  {
    ssr: false,
  }
);

const Nav = () => {
  const { user } = useUserContext();
  const { snackbar, setSnackbar } = useSnackbarContext();
  const {
    ecoFilter,
    filterOpen,
    setFilterOpen,
    setEcoOpen,
    setFSOpen,
    visited,
    layer,
    setLayer,
  } = useHomepageContext();

  let status;
  if (user === undefined) {
    status = "loading";
  } else {
    status = user.status;
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("lg"));

  const router = useRouter();

  const [top, setTop] = useState("50vh");
  const [drawerHeight, setDrawerHeight] = useState(1);

  const [popper, setPopper] = useState(false);

  const [search, setSearch] = useState(false);
  const [feature, setFeature] = useState(false);
  const [latest, setLatest] = useState(false);

  const handleClickSearch = () => {
    setSearch(true);
  };

  const anchorRef = useRef(null);

  const togglePopper = () => {
    setPopper((prevOpen) => !prevOpen);
    setEcoOpen(false);
    setFSOpen(false);
    setFilterOpen(false);
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
      category: { title: "", sub: "" },
      originalUrl: null,
      tags: [],
      ecoregions: [],
      id: "",
      name: user.name,
      status: "draft",
      approved: "false",
      updated: false,
      featured: false,
      feature: "false",
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
        vertical: "bottom",
        horizontal: "left",
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

  const handleFilterOpen = () => {
    setFSOpen(false);
    setFilterOpen(true);
    if (isMobile) {
      setEcoOpen(false);
    }
  };

  const handleFilterClose = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setFilterOpen(false);
    if (isMobile) {
      setTop("50vh");
      setDrawerHeight(1);
    }
  };

  const [toolTip, setToolTip] = useState(false);
  // don't update on ecoFilter update
  const [ecoFilterUpdated, setEcoFilterUpdated] = useState(false);
  useEffect(() => {
    if (visited === null) {
      // setToolTip(true);
      if (ecoFilter && !ecoFilterUpdated) {
        setTimeout(() => setToolTip(true), 7000);
        setEcoFilterUpdated(true);
      }
    } else if (visited === undefined) {
      setToolTip(false);
    } else {
      setToolTip(false);
    }
  }, [visited, ecoFilter]);

  const handleTooltipClose = () => {
    setToolTip(false);
  };

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ margin: 0 }}>
        <Toolbar
          sx={{ paddingLeft: "10px!important", paddingRight: "10px!important" }}
        >
          {ecoFilter && (
            <>
              {isTab ? (
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <div>
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                        sx: {
                          "& .MuiTooltip-tooltip": {
                            border: `solid  3px ${theme.palette.secondary.main}`,
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.primary.dark,
                          },
                          "& .MuiTooltip-arrow": {
                            // border: "solid skyblue 1px",
                            top: "-9px!important",
                            width: "2em",
                            height: "1.42em",
                            color: theme.palette.secondary.main,
                          },
                        },
                      }}
                      onClose={handleTooltipClose}
                      open={toolTip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      sx={{ border: "2px solid" }}
                      title={
                        <div style={{ display: "grid" }}>
                          <Typography
                            color="inherit"
                            sx={{ marginBottom: "2px" }}
                          >
                            Explore posts and species for the selected ecoregion
                            by different categories
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ marginBottom: "2px" }}
                            onClick={() => handleTooltipClose()}
                          >
                            Got it!
                          </Button>
                        </div>
                      }
                      arrow
                    >
                      <Button
                        onClick={handleFilterOpen}
                        endIcon={<SortIcon sx={{ marginBottom: "2px" }} />}
                        variant="contained"
                        color="secondary"
                        size={isTab ? "small" : "medium"}
                        sx={{
                          maxWidth: { xs: "130px", md: "170px", lg: "none" },
                          whiteSpace: "wrap",
                        }}
                      >
                        {ecoFilter.layer === "ecoregions"
                          ? `Eco-${ecoFilter._id}`
                          : ecoFilter.layer === "feow"
                          ? `FEOW-${ecoFilter._id}`
                          : ecoFilter._id === "Rock debris or desert detritus"
                          ? "Rocks"
                          : ecoFilter._id === "Dunes or shifting sands"
                          ? "Dunes"
                          : `${ecoFilter._id}`}
                      </Button>
                    </Tooltip>
                  </div>
                </ClickAwayListener>
              ) : (
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <div>
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                        sx: {
                          "& .MuiTooltip-tooltip": {
                            border: `solid  3px ${theme.palette.secondary.main}`,
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.primary.dark,
                          },
                          "& .MuiTooltip-arrow": {
                            // border: "solid skyblue 1px",
                            top: "-9px!important",
                            width: "2em",
                            height: "1.42em",
                            color: theme.palette.secondary.main,
                          },
                        },
                      }}
                      onClose={handleTooltipClose}
                      open={toolTip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      sx={{ border: "2px solid" }}
                      title={
                        <div style={{ display: "grid" }}>
                          <Typography
                            color="inherit"
                            sx={{ marginBottom: "2px" }}
                          >
                            Explore posts and species for the selected ecoregion
                            by different categories
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ marginBottom: "2px" }}
                            onClick={() => handleTooltipClose()}
                          >
                            Got it!
                          </Button>
                        </div>
                      }
                      arrow
                    >
                      <Button
                        onClick={handleFilterOpen}
                        variant="contained"
                        color="secondary"
                        sx={{
                          maxWidth: { xs: "130px", md: "170px", lg: "none" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ecoFilter.layer === "ecoregions"
                          ? `Eco-${ecoFilter._id} Filter`
                          : ecoFilter.layer === "feow"
                          ? `FEOW-${ecoFilter._id} Filter`
                          : ecoFilter._id === "Rock debris or desert detritus"
                          ? "Rocks Filter"
                          : ecoFilter._id === "Dunes or shifting sands"
                          ? "Dunes Filter"
                          : `${ecoFilter._id} Filter`}
                      </Button>
                    </Tooltip>
                  </div>
                </ClickAwayListener>
              )}
            </>
          )}

          <Button
            onClick={() => {
              if (router.pathname === "/") {
                setFeature(true);
              } else {
                router.push("/featured");
              }
            }}
            variant="text"
            color="secondary"
            size={isTab ? "small" : "medium"}
            sx={{
              display: { xs: "none", md: "block" },
              marginLeft: "5px",
            }}
          >
            {isTab ? "Featured 5" : "Featured 5"}
          </Button>
          <Button
            sx={{
              display: { xs: "none", md: "block" },
            }}
            variant="text"
            color="secondary"
            size={isTab ? "small" : "medium"}
            onClick={
              status === "authenticated" && user.name === undefined
                ? () => router.push("/auth/new-user")
                : () => router.push(process.env.NEXT_PUBLIC_FORUM_URL)
            }
          >
            Forum
          </Button>

          {status === "authenticated" && (
            <Button
              variant="text"
              color="secondary"
              size={isTab ? "small" : "medium"}
              onClick={
                status === "authenticated" && user.name === undefined
                  ? () => router.push("/auth/new-user")
                  : () => router.push("/dashboard")
              }
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              {isTab ? "Dash" : "Dashboard"}
            </Button>
          )}

          <Button
            color="secondary"
            size={isTab ? "small" : "medium"}
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
            size={isTab ? "small" : "large"}
            sx={{ marginLeft: "auto", marginRight: "5px" }}
            onClick={handleClickSearch}
          >
            <SearchIcon sx={{ fontSize: isTab ? "1.8rem" : "2rem" }} />
          </IconButton>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {status === "authenticated" && (
              <>
                {user.name === undefined ? (
                  <Button
                    sx={{ marginLeft: "10px" }}
                    variant="outlined"
                    color="secondary"
                    size={isTab ? "small" : "medium"}
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
                    isTab={isTab}
                  />
                )}
              </>
            )}

            <Button
              variant="outlined"
              color="secondary"
              size={isTab ? "small" : "medium"}
              sx={{ marginLeft: "10px" }}
              disabled={status === "loading"}
              onClick={
                status === "authenticated"
                  ? () =>
                      signOut({
                        callbackUrl: "/",
                      })
                  : () => signIn()
              }
            >
              {status === "authenticated" ? <>Sign Out</> : <>Sign In</>}
            </Button>

            <Button
              href="/donate"
              variant="contained"
              color="secondary"
              size={isTab ? "small" : "medium"}
              sx={{ marginLeft: "10px" }}
            >
              Donate
            </Button>
          </Box>
          <Box>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              ref={anchorRef}
              aria-controls={popper ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={togglePopper}
              size="large"
              sx={{ marginRight: "0px", marginLeft: "10px" }}
            >
              <MenuIcon />
            </IconButton>
            <Popper
              open={popper}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              sx={{ zIndex: 1300 }}
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
                            if (router.pathname === "/") {
                              setFeature(true);
                            } else {
                              router.push("/featured");
                            }
                          }}
                          sx={{
                            color: theme.palette.secondary.main,
                            display: { xs: "flex", md: "none" },
                          }}
                        >
                          Featured 5
                        </MenuItem>
                        <MenuItem
                          onClick={
                            status === "authenticated" &&
                            user.name === undefined
                              ? () => {
                                  setPopper(false);
                                  router.push("/auth/new-user");
                                }
                              : () => {
                                  setPopper(false);
                                  router.push(
                                    process.env.NEXT_PUBLIC_FORUM_URL
                                  );
                                }
                          }
                          sx={{
                            color: theme.palette.secondary.main,
                            display: { xs: "flex", md: "none" },
                          }}
                        >
                          Forum
                        </MenuItem>

                        {status === "authenticated" && (
                          <MenuItem
                            onClick={
                              status === "authenticated" &&
                              user.name === undefined
                                ? () => {
                                    setPopper(false);
                                    router.push("/auth/new-user");
                                  }
                                : () => {
                                    setPopper(false);
                                    router.push("/dashboard");
                                  }
                            }
                            sx={{
                              color: theme.palette.secondary.main,
                              display: { xs: "flex", md: "none" },
                            }}
                          >
                            Dashboard
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            if (router.pathname === "/") {
                              setLatest(true);
                            } else {
                              router.push("/latest");
                            }
                          }}
                          sx={{ color: theme.palette.secondary.main }}
                        >
                          Latest Posts
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            router.push("/stats");
                          }}
                          sx={{ color: theme.palette.secondary.main }}
                        >
                          Stats
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setPopper(false);
                            router.push("/about");
                          }}
                          sx={{ color: theme.palette.secondary.main }}
                        >
                          About
                        </MenuItem>

                        {status === "authenticated" && (
                          <MenuItem
                            onClick={
                              status === "authenticated" &&
                              user.name === undefined
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
                              display: { xs: "flex", md: "none" },
                            }}
                          >
                            Create Post
                          </MenuItem>
                        )}

                        <MenuItem
                          disabled={status === "loading"}
                          onClick={
                            status === "authenticated"
                              ? () => {
                                  setPopper(false);
                                  signOut({
                                    callbackUrl: "/",
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
                            display: { xs: "flex", md: "none" },
                          }}
                        >
                          {status === "authenticated" ? (
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
                            display: { xs: "flex", md: "none" },
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
          {ecoFilter && (
            <DynamicFilterDrawer
              ecoFilter={ecoFilter}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              handleFilterClose={handleFilterClose}
              top={top}
              setTop={setTop}
              drawerHeight={drawerHeight}
              setDrawerHeight={setDrawerHeight}
            />
          )}
          {search && (
            <DynamicSearchDialog
              search={search}
              setSearch={setSearch}
              ecoFilter={ecoFilter && ecoFilter}
              layer={layer}
              setLayer={setLayer}
            />
          )}

          {router.pathname === "/" && (
            <>
              {feature && (
                <DynamicFeatureDialog
                  feature={feature}
                  setFeature={setFeature}
                />
              )}
              {latest && (
                <DynamicLatestDialog latest={latest} setLatest={setLatest} />
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </>
  );
};

export default Nav;
