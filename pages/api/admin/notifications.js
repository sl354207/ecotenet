import { ajv } from "@schema/validation";
import { createNotification } from "@utils/mongodb/mongoHelpers";

// api endpoint to post a comment to the database
export default async function handler(req, res) {
  // body must be in same format as database query

  // only allow post method
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  const data = req.body;
  const validate = ajv.getSchema("notification");
  const valid = validate(data);
  if (valid) {
    // try post request, if successful return response, otherwise return error message.
    try {
      data.date = new Date().toUTCString();
      data.viewed = false;
      const createdNotification = await createNotification(data);

      return res.status(200).json(createdNotification);
    } catch (err) {
      console.error(err);

      res.status(500).json({ msg: "Something went wrong." });
    }
  } else {
    res.status(403).json({ msg: "Forbidden" });
  }
}
