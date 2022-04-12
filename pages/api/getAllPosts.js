import { getPosts } from "../../utils/mongodb";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  const status = req.query.q1;
  const approved = req.query.q2;

  // try get request, if successful return response, otherwise return error message
  try {
    const posts = await getPosts(status, approved);

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
