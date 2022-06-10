import { updateFlag } from "@utils/mongodb";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const { status } = req.body;

  const _id = req.query.id;

  try {
    const updatedFlag = await updateFlag(_id, status);
    return res.status(200).json(updatedFlag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
