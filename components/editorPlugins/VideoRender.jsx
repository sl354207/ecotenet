import PlayArrow from "@mui/icons-material/PlayArrow";
import { Typography, useMediaQuery } from "@mui/material";

// import { lazyLoad } from "@react-page/editor";
import theme from "@utils/theme";
import { validVideoPluginURL } from "@utils/validationHelpers";
import ReactPlayer from "react-player/lazy";

// react player is big, better lazy load it.
// const ReactPlayer = lazyLoad(() => import("react-player"));

const VideoRender = ({ data, preview }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // console.log(data);
  // console.log(ReactPlayer.canPlay(data?.src));
  // const [error, setError] = useState(false);

  // const onError = (e) => {
  //   setError(true);
  // };
  return (
    <>
      {data?.src &&
      validVideoPluginURL(data?.src) &&
      ReactPlayer.canPlay(data?.src) ? (
        <div
          style={{
            position: "relative",
            height: 0,
            paddingBottom: "65.25%",
          }}
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
            config={{
              facebook: {
                attributes: {
                  // "data-width": "-webkit-fill-available",
                  "data-height": isMobile ? 250 : 650,
                },
              },
            }}

            // onError={(e) => onError(e)}
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
