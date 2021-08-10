import { getMammals } from "../utils/mongodb";

import Link from "next/link";

import { Button, IconButton } from "@material-ui/core";

const mammals = ({ mammals }) => {
  const uniqueFirst = [
    ...new Set(mammals.map((mammal) => mammal.Scientific_Name[0])),
  ];
  console.log(uniqueFirst);

  return (
    <>
      <ul>
        {uniqueFirst.map((entry) => {
          return (
            <>
              <li>
                <a href="/mammal">{entry}</a>
              </li>
              {mammals.map((mammal) => {
                if (mammal.Scientific_Name[0] === entry) {
                  return (
                    <li>
                      <a href="/mammal">{mammal.Scientific_Name}</a>
                    </li>
                  );
                }
              })}
            </>
          );
        })}
      </ul>
      <Link href="/posts">Go Back</Link>
    </>
  );
};

// retrieve data at build time
export const getStaticProps = async () => {
  const mammals = await getMammals(313);

  return {
    props: {
      mammals: JSON.parse(JSON.stringify(mammals)),
    },
  };
};

// build routing paths for each post at build time
// export const getStaticPaths = async () => {
//   const posts = await getPosts();

//   // create array of ids of each post in posts
//   const ids = posts.map((post) => post._id);

//   // create paths array with objects that follow structure given
//   const paths = ids.map((id) => ({ params: { id: id.toString() } }));

//   // return a path for each post id. If no id return 404
//   return {
//     paths,
//     fallback: false,
//   };
// };

export default mammals;
