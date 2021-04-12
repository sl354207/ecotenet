import Image from 'next/image'

export default function TestImage({cow}) {
  return (
    <>
      <h1>My Homepage</h1>
      <h2>{cow}</h2>
      <Image
        src="https://res.cloudinary.com/sassafras/image/upload/v1614005803/20201129_153021_t9enhf.jpg"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <img src="https://res.cloudinary.com/sassafras/image/upload/v1614005803/20201129_153021_t9enhf.jpg"
        alt="Picture of the author"
        width={500}
        height={500}>
      </img>
      <p>Welcome to my homepage!</p>
    </>
  )
}

export const getStaticProps = async () => {
    const cow = 4;
  
    return {
      props: {
        cow
      }
    }
  
  }
