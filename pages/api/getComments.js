import { getComments } from "../../utils/mongodb";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  const { q } = req.query;
  // console.log(name);
  // try get request, if successful return response, otherwise return error message
  try {
    const comments = await getComments(q);

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
