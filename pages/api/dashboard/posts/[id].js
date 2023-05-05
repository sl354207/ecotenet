import { authOptions } from "@pages/api/auth/[...nextauth]";
import { ajv } from "@schema/validation";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@utils/mongodb/mongoHelpers";
import { validID } from "@utils/validationHelpers";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const method = req.method;

    switch (method) {
      case "GET":
        const getName = req.query.name;
        const id = req.query.id;
        if (validID(id)) {
          if (session.user.name && session.user.name === getName) {
            // try get request, if successful return response, otherwise return error message
            try {
              const post = await getPostById(id);
              // don't send voters
              post.voters = [];

              return res.status(200).json(post);
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
        // console.log(getName);

        break;
      case "PUT":
        const { _id, ...data } = req.body;
        const validate = ajv.getSchema("post");
        const valid = validate(data);
        if (validID(_id) && valid) {
          if (session.user.name && session.user.name === data.name) {
            try {
              data.approved = "pending";
              data.date = new Date();
              data.feature = "false";
              const update = await updatePost(_id, data);

              // console.log(update);
              return res.status(200).json(update);
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

        break;

      case "DELETE":
        const deleteId = req.body._id;
        const deleteName = req.body.name;

        // try delete request, if successful return response, otherwise return error message

        // console.log(req.body);
        if (validID(deleteId)) {
          if (session.user.name && session.user.name === deleteName) {
            try {
              const deleted = await deletePost(deleteId);
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
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ msg: "Unauthorized" });
  }
  res.end();
}
