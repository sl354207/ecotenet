import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  ButtonGroup,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import DrawerPost from "./DrawerPost";
import DrawerSpecies from "./DrawerSpecies";

const drawerWidth = 370;

const FeatureAndSearchDrawer = ({
  FS,
  FSOpen,
  handleFSClose,
  top,
  setTop,
  drawerHeight,
  setDrawerHeight,
  anchor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

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
              xs: router.pathname == "/" ? "55px" : "0px",
              md: "0px",
            },
          },
        }}
        anchor={anchor}
        open={FSOpen}
        onClose={handleFSClose}
        hideBackdrop
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: "-40px", md: "-60px" },
            paddingBlock: { xs: "0px", md: "10px" },
            display: "flex",
            visibility: FSOpen ? "visible" : "hidden",
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
              <Typography
                align="center"
                variant="h5"
                sx={{
                  position: "absolute",
                  left: "0px",
                  right: "0px",
                  marginInline: "auto",
                  marginTop: "3px",
                  width: "fit-content",
                }}
              >
                {FS.state}
              </Typography>
            </>
          )}
          <Typography
            align="center"
            variant="h5"
            sx={{
              position: "absolute",
              left: "0px",
              right: "0px",
              marginInline: "auto",
              marginTop: "3px",
              width: "fit-content",
              display: { xs: "none", md: "block" },
            }}
          >
            {FS.state}
          </Typography>

          <IconButton
            onClick={handleFSClose}
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
          {typeof FS.item == "string" ? (
            <DrawerPost id={FS.item} />
          ) : (
            <DrawerSpecies species={FS.item} />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FeatureAndSearchDrawer;
