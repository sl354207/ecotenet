import { getPostComments } from "@utils/mongodb/mongoHelpers";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { id } = req.query;

  if (typeof id == "string" && id.length == 24) {
    try {
      const comments = await getPostComments(id);

      return res.status(200).json(comments);
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
