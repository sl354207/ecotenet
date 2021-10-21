import useSWR from "swr";
import { useRouter } from "next/router";

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
        // const { data: results } = useSWR(`/api/allpost`, fetcher);
        const dog = ["cat"];
        return {
          // test
          filter: "allposts",
          data: dog,
        };

        break;
      case "eco-posts":
        // const { data: results } = useSWR(`/api/allpost`, fetcher);

        return "ecoposts";

        break;
      case "all-species":
        // const { data: results } = useSWR(`/api/allpost`, fetcher);
        return "allspecies";

        break;
      case "eco-species":
        // const { data: results } = useSWR(`/api/allpost`, fetcher);
        return "ecospecies";

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

  //   // loading state until draft is retrieved
  //   if (!post || post == undefined) return "Loading...";

  return <div> {results.data}</div>;
}
