import { authOptions } from "@pages/api/auth/[...nextauth]";
import {
  deleteDirectoryPromise,
  deleteRecursive,
  generateDeleteURL,
} from "@utils/aws";
import { validID, validKey } from "@utils/validationHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get image from aws s3 bucket
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method !== "GET") {
      return res.status(405).json({ msg: "Method not allowed" });
    }
    // console.log(req.query);
    const name = req.query.name;
    const postId = req.query.post_id;
    const key = req.query.key;

    // console.log(key)

    // const key = req.query.id;
    // const name = "Muskrat";
    // const postId = "62434f2ee7aaa0cc6f8d61cd";
    // // const key = "b36580f51a71b20d5f166a9807d98650.jpeg";

    if (session.user.name && session.user.name === name) {
      if (!postId && !key) {
        try {
          const paths = await deleteDirectoryPromise(`${name}/`);

          return res.status(200).json(paths);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else if (!key) {
        if (validID(postId)) {
          try {
            const paths = await deleteRecursive(`${name}/${postId}/`);

            return res.status(200).json(paths);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(403).json({ msg: "Forbidden" });
        }
      } else {
        if (validID(postId) && validKey(key)) {
          try {
            const url = await generateDeleteURL(name, postId, key);
            // await console.log(res.json(url))
            return res.status(200).json(url.substring(1, url.length - 1));
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(403).json({ msg: "Forbidden" });
        }
      }
    } else {
      res.status(401).json({ msg: "Unauthorized" });
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
