import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import { deleteComment, updateComment } from "@utils/mongodb/mongoHelpers";
import { validID } from "@utils/validationHelpers";
import { getServerSession } from "next-auth/next";
import * as Pusher from "pusher";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // console.log(session);
  if (session) {
    const method = req.method;

    switch (method) {
      case "PUT":
        const { id, ...data } = req.body;
        const validate = ajv.getSchema("comment");
        const valid = validate(data);
        if (validID(id) && valid) {
          if (session.user.name && session.user.name === data.name) {
            try {
              data.date = new Date();
              data.approved = "pending";
              data.updated = true;
              const updatedComment = await updateComment(id, data);

              const pusher = new Pusher({
                appId: process.env.PUSHER_APP_ID,
                key: process.env.NEXT_PUBLIC_PUSHER_KEY,
                secret: process.env.PUSHER_SECRET_KEY,
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
              });

              pusher.trigger("ecotenet", "comment", {
                type: "comment",
              });

              return res.status(200).json(updatedComment);
            } catch (err) {
              console.error(err);
              // console.log(err);
              res.status(500).json({ msg: "Something went wrong." });
            }
          } else {
            res.status(401).json({ msg: "Unauthorized" });
          }
        } else {
          console.log(validate.errors);
          res.status(403).json({ msg: "Forbidden" });
        }

        break;
      case "DELETE":
        const deleteId = req.body.id;
        const deleteName = req.body.name;

        // try delete request, if successful return response, otherwise return error message

        // console.log(req.body);
        if (validID(deleteId)) {
          if (session.user.name && session.user.name === deleteName) {
            try {
              const deleted = await deleteComment(deleteId);
              return res.status(200).json(deleted);
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
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
