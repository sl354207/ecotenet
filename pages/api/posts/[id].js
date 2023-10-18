import { getPublishedApprovedPostById } from "@utils/mongodb/mongoHelpers";
import { validID } from "@utils/validationHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const id = req.query.id;
  // console.log(id);

  if (validID(id)) {
    try {
      const results = await getPublishedApprovedPostById(id);

      return res.status(200).json(results);
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
