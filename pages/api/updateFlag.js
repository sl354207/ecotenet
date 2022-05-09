import { updateFlag } from "@utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const { _id, status } = req.body;

  try {
    const updatedFlag = await updateFlag(_id, status);
    return res.status(200).json(updatedFlag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
