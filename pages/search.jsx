import useSWR from "swr";
import { useRouter } from "next/router";
// import Nav from '../components/Nav'

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Search() {
  // set id to id in url query
  const router = useRouter();
  //   capture search query and filter parameters
  const query = router.query.q;
  const filter = router.query.s;

  //   store database search results from an immediately invoked function expression(braces around anonymous function followed by immediate functIon call)
  const results = ((search) => {
    //   Use switch statement to return correct data based on query and filter. Wrap switch statement in function call to store return value.
    switch (search) {
      case "all-posts":
        //   must use different names for swr data in each case
        const { data: allPosts } = useSWR(
          `/api/search/allPosts?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "posts",
        //   data: allPosts,
        // };
        return allPosts;

        break;
      case "eco-posts":
        const { data: ecoPosts } = useSWR(
          `/api/search/ecoPosts?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "posts",
        //   data: ecoPosts,
        // };
        console.log(ecoPosts);
        return ecoPosts;

        break;
      case "all-species":
        const { data: allSpecies } = useSWR(
          `/api/search/allSpecies?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "species",
        //   data: allSpecies,
        // };
        return allSpecies;

        break;
      case "eco-species":
        const { data: ecoSpecies } = useSWR(
          `/api/search/ecoSpecies?q=${query}`,
          fetcher
        );

        // return {
        //   filter: "species",
        //   data: ecoSpecies,
        // };
        return ecoSpecies;

        break;
      // default:
      //   console.log(`Sorry, we are out of ${search}.`);
    }
  })(filter);

  //   const _id = router.query._id;
  //   // capture url path to pass to form
  //   const pathName = router.pathname;

  //   // retrieve drafts from drafts api. convert swr data to name posts.
  //   const { data: post } = useSWR(`/api/getdrafts/${_id}`, fetcher);

  // loading state until draft is retrieved
  if (!results || results == undefined) return "Loading...";
  // console.log(results);
  // if (results[0].title) {
  return (
    <div>
      <ul>
        {results.map((result) => {
          return (
            <li>
              {result.title}
              {result.count}
            </li>
          );
        })}
      </ul>
      {query}
    </div>
  );
  // } else {
  //   return (
  //     <div>
  //       <ul>
  //         {results.map((result) => {
  //           return <li>{result.Scientific_Name}</li>;
  //         })}
  //       </ul>
  //       {query}
  //     </div>
  //   );
  // }
}
