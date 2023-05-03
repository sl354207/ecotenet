import PlayArrow from "@mui/icons-material/PlayArrow";
import { Typography } from "@mui/material";

import { lazyLoad } from "@react-page/editor";
import { validVideoPluginURL } from "@utils/validationHelpers";

// react player is big, better lazy load it.
const ReactPlayer = lazyLoad(() => import("react-player"));

const VideoRender = ({ data, preview }) => {
  return (
    <>
      {data?.src ? (
        <div
          style={{ position: "relative", height: 0, paddingBottom: "65.25%" }}
        >
          {preview ? null : (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
              }}
            />
          )}
          {validVideoPluginURL(data?.src) ? (
            <ReactPlayer
              url={data?.src}
              height="100%"
              width="100%"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <Typography
              variant="h6"
              align="center"
              sx={{ position: "relative", marginTop: "100px" }}
            >
              Must be a Youtube url
            </Typography>
          )}
        </div>
      ) : (
        <div
          style={{ position: "relative", width: "100%", textAlign: "center" }}
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
  );
};

export default VideoRender;
