import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import {
  createComment,
  getDashboardComments,
} from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const method = req.method;

    switch (method) {
      case "GET":
        const getName = req.query.name;

        if (session.user.name && session.user.name === getName) {
          try {
            const comments = await getDashboardComments(getName);

            return res.status(200).json(comments);
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
        const validate = ajv.getSchema("comment");
        const valid = validate(data);
        if (valid) {
          if (session.user.name && session.user.name === data.name) {
            try {
              data.date = new Date();
              data.approved = "pending";
              data.updated = false;
              const createdComment = await createComment(data);

              return res.status(200).json(createdComment);
            } catch (err) {
              console.error(err);

              res.status(500).json({ msg: "Something went wrong." });
            }
          } else {
            res.status(401).json({ msg: "Unauthorized" });
          }
        } else {
          console.log(validate.errors);
          res.status(403).json({ msg: "Forbidden" });
        }
        // console.log(req.body);

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
