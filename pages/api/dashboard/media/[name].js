import {
  deleteDirectoryPromise,
  deleteRecursive,
  generateDeleteURL,
} from "@utils/aws";
import { getSession } from "next-auth/react";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    if (req.method !== "GET") {
      return res.status(405);
    }
    // console.log(req.query);
    const name = req.query.name;
    const postId = req.query.post_id;
    const key = req.query.key;
    // console.log(key)

    // const key = req.query.id;
    // // const name = "Muskrat";
    // // const postId = "62c9c684a38cd3357c7e28f3";
    // // const key = "b36580f51a71b20d5f166a9807d98650.jpeg";

    if (session.user.name && session.user.name == name) {
      if (!postId && !key) {
        try {
          const paths = await deleteDirectoryPromise(`${name}/`);

          return res.status(200).json(paths);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!key) {
        try {
          const paths = await deleteRecursive(`${name}/${postId}/`);

          return res.status(200).json(paths);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        try {
          const url = await generateDeleteURL(name, postId, key);
          // await console.log(res.json(url))
          return res.status(200).json(url);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      }
    } else if (!session.user.name) {
      const person = await checkPerson(name);

      if (person && person.email == session.user.email) {
        // try get request, if successful return response, otherwise return error message
        if (!postId && !key) {
          try {
            const paths = await deleteDirectoryPromise(`${name}/`);

            return res.status(200).json(paths);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else if (!key) {
          try {
            const paths = await deleteRecursive(`${name}/${postId}/`);

            return res.status(200).json(paths);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          try {
            const url = await generateDeleteURL(name, postId, key);
            // await console.log(res.json(url))
            return res.status(200).json(url);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(401);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
