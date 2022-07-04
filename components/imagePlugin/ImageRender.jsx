import makeStyles from "@mui/styles/makeStyles";
import { lazyLoad } from "@react-page/editor";
import Image from "next/image";
const ImageIcon = lazyLoad(() => import("@mui/icons-material/Landscape"));

const useStyles = makeStyles(() => ({
  image: {
    width: "100%",
    display: "flex",
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
    let url;
    if (
      url.match(/\.(jpeg|jpg|jfif|pjpeg|pjpgif|png|apng|svg|webp|avif)$/) !=
      null
    ) {
      try {
        url = new URL(string);
      } catch (e) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    } else {
      return false;
    }
  };

  //   const checkURL = (url) => {
  //     return(url.match(/\.(jpeg|jpg|jfif|pjpeg|pjpgif|png|apng|svg|webp|avif)$/) != null);
  // }

  const classes = useStyles();
  return (
    <div
      className={
        data.imageUrl.url && data.imageUrl.saved == false && !preview
          ? classes.border
          : null
      }
    >
      {data.imageUrl.url ? (
        // /* show preview*/ <img style={{ width: 300 }} src={data.imageUrl} />
        <>
          {/* {data.imageUrl.saved ? ( */}
          <div className={classes.image}>
            <figure>
              <Image
                src={data.imageUrl.url || ""}
                alt={data.description || ""}
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
