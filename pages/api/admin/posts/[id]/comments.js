import { getPostComments } from "@utils/mongodb";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  // only allow get request
  if (req.method !== "GET") {
    return res.status(405);
  }

  const { id } = req.query;
  //   console.log(q);
  // try get request, if successful return response, otherwise return error message
  try {
    const comments = await getPostComments(id);

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
  //   res.end();
}
