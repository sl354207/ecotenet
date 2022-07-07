import { Link, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { lazyLoad } from "@react-page/editor";
import Image from "next/image";
const ImageIcon = lazyLoad(() => import("@mui/icons-material/Landscape"));

const useStyles = makeStyles(() => ({
  image: {
    width: "100%",
    display: "grid",
    justifyContent: "center",
  },
  placeholder: {
    position: "relative",
    width: "100%",
    textAlign: "center",
  },
  icon: {
    width: "100%",
    height: "auto",
    padding: "0",
    color: "#aaa",
    textAlign: "center",
    minWidth: 64,
    minHeight: 64,
    maxHeight: 256,
  },
  border: {
    border: "2px solid #ffa726",
    borderRadius: 4,
  },
}));

// ImageRender takes in data as prop passed down from testPlugin
const ImageRender = ({ data, preview }) => {
  console.log(data);
  // console.log(preview);
  const isValidHttpUrl = (string) => {
    if (/^blob:http:\/\//.test(string)) {
      console.log("true blob");
      return true;
    } else {
      console.log(
        /^https?:\/\/.+\.(jpeg|jpg|jfif|pjpeg|pjpgif|png|apng|svg|webp|avif)$/.test(
          string
        )
      );
      return /^https?:\/\/./.test(string);
    }
  };

  //   const checkURL = (url) => {
  //     return(url.match(/\.(jpeg|jpg|jfif|pjpeg|pjpgif|png|apng|svg|webp|avif)$/) != null);
  // }

  const classes = useStyles();
  return (
    <div
      className={
        data.imageUrl.url &&
        data.imageUrl.url.startsWith("blob:") &&
        data.imageUrl.saved == false &&
        !preview
          ? classes.border
          : null
      }
    >
      {isValidHttpUrl(data.imageUrl.url) ? (
        // /* show preview*/ <img style={{ width: 300 }} src={data.imageUrl} />
        <>
          {/* {data.imageUrl.saved ? ( */}
          <div className={classes.image}>
            <figure>
              <Image
                src={data.imageUrl.url}
                // src={data.imageUrl.url || ""}
                alt={data.description || ""}
                width={data.width || 500}
                height={data.height || 500}
                // layout="fill"
                // className={classes.image}
              />
              <figcaption>
                {data.caption && (
                  <Typography variant="caption">{data.caption}.</Typography>
                )}{" "}
                {data.citation && <em>{data.citation}</em>}
                {data.imageUrl.url.startsWith("http") && (
                  <Link
                    href={data.imageUrl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </Link>
                )}
              </figcaption>
            </figure>
            {/* {data.caption && (
              <Typography variant="caption">{data.caption}.</Typography>
            )}
            {data.citation && <em>{data.citation}</em>}
            {data.imageUrl.url.startsWith("http") && (
              <Typography variant="caption">{data.imageUrl.url}</Typography>
            )} */}
          </div>
          {/* ) : (
            <div className={classes.image}>
              <figure>
                <img
                  src={data.imageUrl.url || ""}
                  alt={data.imageUrl.description || ""}
                  width={data.width || 500}
                  height={data.height || 500}
                  // layout="fill"
                  // className={classes.image}
                />

                <figcaption>
                  {data.caption}. {data.citation && <em>{data.citation}</em>}
                </figcaption>
              </figure>
            </div>
          )} */}
        </>
      ) : (
        <div className={classes.placeholder}>
          <ImageIcon className={classes.icon} />
        </div>
      )}
    </div>
  );
};

export default ImageRender;
