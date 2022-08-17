import {
  deleteDirectoryPromise,
  deleteRecursive,
  generateDeleteURL,
} from "@utils/aws";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  const name = req.query.name;
  const postId = req.query.post_id;
  const key = req.query.id;

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
}