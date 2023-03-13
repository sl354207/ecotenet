import { updateFlag } from "@utils/mongodb/mongoHelpers";

// api endpoint to get all posts from database
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const { id, status } = req.body;

  // const _id = req.query.id;
  if (
    typeof id == "string" &&
    id.length == 24 &&
    (status === "resolved" || status === "pending")
  ) {
    try {
      const updatedFlag = await updateFlag(id, status);
      return res.status(200).json(updatedFlag);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
