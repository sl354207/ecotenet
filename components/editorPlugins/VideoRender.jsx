import PlayArrow from "@mui/icons-material/PlayArrow";
import { Typography } from "@mui/material";
import theme from "@utils/theme";

import { validVideoPluginURL } from "@utils/validationHelpers";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const VideoRender = ({ data, preview }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [data]);

  const onError = (e) => {
    if (e.type === "error") {
      setError(true);
    }
  };
  return (
    <div style={{ marginBlock: "10px" }}>
      {data?.src && validVideoPluginURL(data?.src) ? (
        error ? (
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
              onError={(e) => onError(e)}
            />
          </div>
        )
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
    </div>
  );
};

export default VideoRender;
