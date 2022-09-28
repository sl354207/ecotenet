// import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());
const DrawerSpecies = ({ item }) => {
  // const { data } = useSWR(item ? `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${
  //     species.scientific_name.toLowerCase().split(" ")[0]
  //   }_${species.scientific_name.toLowerCase().split(" ")[1]}?redirect=true` : null, fetcher);

  return <div>{item}</div>;
};

export default DrawerSpecies;
