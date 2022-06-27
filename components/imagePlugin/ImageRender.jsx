import { makeStyles } from "@material-ui/core/styles";
import { lazyLoad } from "@react-page/editor";
import Image from "next/image";
const ImageIcon = lazyLoad(() => import("@material-ui/icons/Landscape"));

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
    border: "1px solid red",
  },
}));

// ImageRender takes in data as prop passed down from testPlugin
const ImageRender = ({ data, preview }) => {
  console.log(data);
  // console.log(preview);

  const classes = useStyles();
  return (
    <div className={data.imageUrl && !preview ? classes.border : null}>
      {data.imageUrl ? (
        // /* show preview*/ <img style={{ width: 300 }} src={data.imageUrl} />
        <div className={classes.image}>
          <figure>
            <Image
              src={data.imageUrl}
              alt={"Picture of the author"}
              width={500}
              height={500}
              // layout="fill"
              // className={classes.image}
            />

            <figcaption>{data.caption}</figcaption>
          </figure>
        </div>
      ) : (
        <div className={classes.placeholder}>
          <ImageIcon className={classes.icon} />
        </div>
      )}
    </div>
  );
};

export default ImageRender;
