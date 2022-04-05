import { updateComment } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const { _id, date, text, approved, updated } = req.body;

  try {
    const updatedComment = await updateComment(
      _id,
      date,
      text,
      approved,
      updated
    );
    return res.status(200).json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
