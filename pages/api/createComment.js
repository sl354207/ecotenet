import { createComment } from "../../utils/mongodb";

// api endpoint to post a comment to the database
export default async function handler(req, res) {
  // body must be in same format as database query
  const { name, post_id, comment_ref, date, text, approved, updated } =
    req.body;

  // only allow post method
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  // try post request, if successful return response, otherwise return error message.
  try {
    const createdComment = await createComment(
      name,
      post_id,
      comment_ref,
      date,
      text,
      approved,
      updated
    );

    return res.status(200).json(createdComment);
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Something went wrong." });
  }
}
