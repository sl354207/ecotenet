import {
  deleteDirectoryPromise,
  deleteRecursive,
  generateDeleteURL,
} from "@utils/aws";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const name = req.query.name;
  const postId = req.query.post_id;
  const key = req.query.id;

  const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;

  // try get request, if successful return response, otherwise return error message

  if (typeof name === "string" && name.length <= 60 && !regex.test(name)) {
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
          return res.status(200).json(url);
        } catch (err) {
          console.error(err);

          res.status(500).json({ msg: "Something went wrong." });
        }
      } else {
        res.status(403).json({ msg: "Forbidden" });
      }
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
