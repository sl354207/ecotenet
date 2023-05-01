import { updateNotification } from "@utils/mongodb/mongoHelpers";
import { validID } from "@utils/validationHelpers";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const { id, viewed } = req.body;

  if (validID(id) && viewed === true) {
    try {
      const updatedNotification = await updateNotification(id, viewed);
      return res.status(200).json(updatedNotification);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
