import Link from "@components/Link";
import { Typography } from "@mui/material";
import { lazyLoad } from "@react-page/editor";
import Image from "next/image";
const ImageIcon = lazyLoad(() => import("@mui/icons-material/Landscape"));

// ImageRender takes in data as prop passed down from testPlugin
const ImageRender = ({ data, preview }) => {
  // console.log(data);
  // console.log(preview);
  const isValidHttpUrl = (string) => {
    if (/^blob:http:\/\//.test(string)) {
      // console.log("true blob");
      return true;
    } else {
      // console.log(
      //   /^https?:\/\/.+\.(jpeg|jpg|jfif|pjpeg|pjpgif|png|apng|svg|webp|avif)$/.test(
      //     string
      //   )
      // );
      return /^https?:\/\/.+\.(jpeg|jpg|jfif|pjpeg|pjpgif|png|apng|svg|webp|avif)$/.test(
        string
      );
    }
  };

  return (
    <div
      style={
        data.image.url &&
        data.image.url.startsWith("blob:") &&
        data.image.saved == false &&
        !preview
          ? { border: "2px solid #ffa726", borderRadius: "4px" }
          : null
      }
    >
      {isValidHttpUrl(data.image.url) ? (
        <>
          {data.image.url.startsWith("https://eco-media-bucket.s3") ? (
            <div
              style={{
                width: "100%",
                display: "grid",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <figure
                style={{
                  display: "table",
                }}
              >
                <Image
                  src={data.image.url}
                  alt={data.description || ""}
                  width={data.width || 500}
                  height={data.height || 500}
                />
                <figcaption
                  style={{
                    display: "table-caption",
                    captionSide: "bottom",
                  }}
                >
                  {data.caption && (
                    <Typography variant="caption">{data.caption}.</Typography>
                  )}{" "}
                  {data.citation && (
                    <Typography variant="caption">{data.citation}</Typography>
                  )}
                </figcaption>
              </figure>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "grid",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <figure
                style={{
                  display: "table",
                }}
              >
                <span
                  style={{
                    boxSizing: "border-box",
                    display: "inline-block",
                    position: "relative",
                    maxWidth: "100%",
                    overflow: "hidden",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "block",
                      maxWidth: "100%",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <img
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                      }}
                      alt=""
                      aria-hidden={true}
                      src={`data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27${
                        data.width || 500
                      }%27%20height=%27${data.height || 500}%27/%3e`}
                    />
                  </span>

                  <img
                    srcSet={`${data.image.url} 2x`}
                    src={data.image.url}
                    alt={data.description || ""}
                    width={data.width || 500}
                    height={data.height || 500}
                    loading="lazy"
                    decoding="async"
                    data-nimg="intrinsic"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,

                      boxSizing: "border-box",
                      padding: 0,
                      border: "none",
                      margin: "auto",

                      display: "block",
                      width: 0,
                      height: 0,
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                  />
                </span>

                <figcaption
                  style={{
                    display: "table-caption",
                    captionSide: "bottom",
                  }}
                >
                  {data.caption && (
                    <Typography variant="caption">{data.caption}.</Typography>
                  )}{" "}
                  {data.citation && (
                    <Typography variant="caption">{data.citation}</Typography>
                  )}
                  {!data.image.url.startsWith("blob:") && (
                    <Link
                      href={data.image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </Link>
                  )}
                </figcaption>
              </figure>
            </div>
          )}
        </>
      ) : (
        <div
          style={{ position: "relative", width: "100%", textAlign: "center" }}
        >
          <ImageIcon
            sx={{
              width: "100%",
              height: "auto",
              padding: "0",
              color: "#aaa",
              textAlign: "center",
              minWidth: "64px",
              minHeight: "64px",
              maxHeight: "256px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageRender;
