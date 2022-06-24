import { lazyLoad } from "@react-page/editor";
import Image from "next/image";

const ImageIcon = lazyLoad(() => import("@material-ui/icons/Landscape"));

// ImageRender takes in data as prop passed down from testPlugin
const ImageRender = ({ data }) => {
  console.log(data);
  return (
    <div>
      {/* <h1>{data.title}</h1> */}
      {data.imageUrl ? (
        // /* show preview*/ <img style={{ width: 300 }} src={data.imageUrl} />
        <Image
          src={data.imageUrl}
          alt={"Picture of the author"}
          width={500}
          height={500}
        />
      ) : (
        <ImageIcon
          style={{
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
      )}
      <p>{data.description}</p>
    </div>
  );
};

export default ImageRender;
