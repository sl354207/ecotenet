import { authOptions } from "@pages/api/auth/[...nextauth]";
import {
  deleteDirectoryPromise,
  deleteRecursive,
  generateDeleteURL,
} from "@utils/aws";
import { checkPerson } from "@utils/mongodb/mongoHelpers";
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

    const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
    // console.log(key)

    // const key = req.query.id;
    // // const name = "Muskrat";
    // // const postId = "62c9c684a38cd3357c7e28f3";
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
        if (typeof postId === "string" && postId.length === 24) {
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
        if (
          typeof postId === "string" &&
          postId.length === 24 &&
          typeof key === "string" &&
          key.substring(0, key.indexOf(".")).length === 32
        ) {
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
    } else if (
      !session.user.name &&
      typeof name === "string" &&
      name.length <= 60 &&
      !regex.test(name)
    ) {
      const person = await checkPerson(name);

      if (person && person.email === session.user.email) {
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
          if (typeof postId === "string" && postId.length === 24) {
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
          if (
            typeof postId === "string" &&
            postId.length === 24 &&
            typeof key === "string" &&
            key.substring(0, key.indexOf(".")).length === 32
          ) {
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
      res.status(401).json({ msg: "Unauthorized" });
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
