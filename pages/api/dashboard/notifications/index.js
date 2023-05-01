import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import {
  createNotification,
  getNotifications,
} from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

// api endpoint to get all posts by user from database
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const method = req.method;

    switch (method) {
      case "GET":
        const getName = req.query.name;

        if (session.user.name && session.user.name === getName) {
          try {
            const notifications = await getNotifications(getName);

            return res.status(200).json(notifications);
          } catch (err) {
            console.error(err);

            res.status(500).json({ msg: "Something went wrong." });
          }
        } else {
          res.status(401).json({ msg: "Unauthorized" });
        }

        break;
      case "POST":
        const data = req.body;
        const { name } = req.body;
        const validate = ajv.getSchema("notification");
        const valid = validate(data);
        if (valid) {
          if (session.user.name && session.user.name === name) {
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
            res.status(401).json({ msg: "Unauthorized" });
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
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
