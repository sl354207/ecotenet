import { updateNotification } from "@utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // body must be in same format as database query
  const { _id, viewed } = req.body;

  try {
    const updatedNotification = await updateNotification(_id, viewed);
    return res.status(200).json(updatedNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
