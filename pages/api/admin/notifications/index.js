import { ajv } from "@schema/validation";
import {
  createNotification,
  getAdminNotifications,
} from "@utils/mongodb/mongoHelpers";

// api endpoint to post a comment to the database
export default async function handler(req, res) {
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const notifications = await getAdminNotifications();

        return res.status(200).json(notifications);
      } catch (err) {
        console.error(err);

        res.status(500).json({ msg: "Something went wrong." });
      }

      break;
    case "POST":
      const data = req.body;
      const validate = ajv.getSchema("notification");
      const valid = validate(data);
      if (valid) {
        // try post request, if successful return response, otherwise return error message.
        try {
          data.date = new Date();
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

      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
