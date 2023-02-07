import { generateUploadURL } from "@utils/aws";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  const name = req.query.name;
  const postId = req.query.post_id;
  const ext = req.query.ext;

  if (
    typeof name == "string" &&
    name.length <= 100 &&
    typeof postId == "string" &&
    postId.length == 24 &&
    typeof ext == "string" &&
    (ext === "image/jpg" || ext === "image/jpeg" || ext === "image/png")
  ) {
    // try get request, if successful return response, otherwise return error message
    try {
      const url = await generateUploadURL(name, postId, ext);
      // await console.log(res.json(url))
      return res.status(200).json(url.substring(1, url.length - 1));
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403);
  }
}
