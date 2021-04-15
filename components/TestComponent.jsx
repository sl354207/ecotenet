import Image from 'next/image';

const TestComponent = ({data}) => {
    return (
        <div>
            <h1>{data.title}</h1>
            <img style={{ width: 300 }} src={data.imageUrl} />
            {/* <Image
                src={data.imageUrl}
                alt={"Picture of the author"}
                width={500}
                height={500}
            /> */}
            <p>{data.description}</p>
        </div>
    )
}

export default TestComponent