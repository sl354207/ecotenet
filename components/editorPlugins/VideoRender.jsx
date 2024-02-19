// import { lazyLoad } from "@react-page/editor";

// react player is big, better lazy load it.
// const ReactPlayer = lazyLoad(() => import("react-player"));

// const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });
import PlayArrow from "@mui/icons-material/PlayArrow";
import { Typography } from "@mui/material";

import { validVideoPluginURL } from "@utils/validationHelpers";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const VideoRender = ({ data, preview }) => {
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // console.log(data);
  // console.log(ReactPlayer.canPlay(data?.src));

  return (
    <>
      {data?.src && validVideoPluginURL(data?.src) ? (
        // &&
        // ReactPlayer.canPlay(data?.src)
        <div
          style={{
            position: "relative",
            height: 0,
            paddingBottom: "65.25%",
          }}
        >
          <ReactPlayer
            url={data?.src}
            height="100%"
            width="100%"
            controls
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      ) : (
        <>
          {data?.src ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                textAlign: "center",
                border: `2px solid ${theme.palette.error.main}`,
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{ position: "relative", marginTop: "100px" }}
              >
                Sorry there was a problem. We cannot play this video
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{ position: "relative", marginBottom: "100px" }}
              >
                (known issues: Youtube live, Twitch clips, and Dailymotion embed
                urls)
              </Typography>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                textAlign: "center",
              }}
            >
              <PlayArrow
                sx={{
                  width: "100%",
                  height: "auto",
                  padding: "0",
                  color: "#aaa",
                  textAlign: "center",
                  minWidth: 64,
                  minHeight: 64,
                  maxHeight: 256,
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VideoRender;
