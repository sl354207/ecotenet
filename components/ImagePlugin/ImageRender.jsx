import Image from "next/image";

// ImageRender takes in data as prop passed down from testPlugin
const ImageRender = ({ data }) => {
  return (
    <div>
      <h1>{data.title}</h1>
      {data.imageUrl ? (
        // /* show preview*/ <img style={{ width: 300 }} src={data.imageUrl} />
        <Image
          src={data.imageUrl}
          alt={"Picture of the author"}
          width={500}
          height={500}
        />
      ) : null}
      <p>{data.description}</p>
    </div>
  );
};

export default ImageRender;
