import { generateUploadURL } from "@utils/aws";
import { validID, validName } from "@utils/validationHelpers";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const name = req.query.name;
  const postId = req.query.post_id;
  const ext = req.query.ext;

  const allowedExtensions = [
    "image/apng",
    "image/avif",
    "image/gif",
    "image/jpg",
    "image/jpeg",
    "image/jfif",
    "image/pjpeg",
    "image/pjp",
    "image/png",
    "image/svg",
    "image/webp",
  ];

  if (
    validName(name) &&
    validID(postId) &&
    typeof ext === "string" &&
    allowedExtensions.includes(ext.toLowerCase())
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
    res.status(403).json({ msg: "Forbidden" });
  }
}
